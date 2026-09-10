/**
 * 机场在线状态检测脚本
 *
 * 从机场配置中读取所有机场的官网链接，逐个发起真实 HTTP 请求，
 * 把结果写入 public/assets/data/airport-status.json 供前端首屏读取。
 *
 * 该产物已在 .gitignore 中排除，不进源码分支：
 * 正常由 deploy.yml 在构建阶段调用，生成后随构建发布到部署分支。
 *
 * 用法：npm run check-airports
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const CONFIG_DIR = path.join(
    __dirname, '..', 'public', 'assets', 'scripts', 'configs'
);
const OUTPUT_FILE = path.join(
    __dirname, '..', 'public', 'assets', 'data', 'airport-status.json'
);

// 单次请求超时（毫秒）
const TIMEOUT_MS = 10000;
// 并发数：这里的目的是「确认站点还活着」，不是压测。
// 每个站点每轮只收到 1 次 HEAD（必要时 +1 次 GET），而且分散在不同域名上，
// 3 路并发对任何单个站点都不构成负担
const CONCURRENCY = 3;
// 每个站点探测前的固定间隔。18 个站点 × 0.8s ≈ 14s，是构建耗时的主要来源；
// 3 路并发下整体速率约每秒 3-4 个请求，但每个域名每轮仍然只有 1 个请求
const SITE_DELAY_MS = 800;
// 是否遵守目标站点的 robots.txt。站点明确写了 Disallow: / 就跳过不测
const RESPECT_ROBOTS_TXT = true;
// 每个站点每天最多被请求 2 轮 × (robots + HTTP) ≈ 6 次，属于正常监控量级。
// UA 里保留浏览器标识是为了不被 WAF 直接挡掉（那会造成大量误判），
// 同时用 compatible 段亮明自己的身份和来源，方便站站长联系或封禁
const UA = 'Mozilla/5.0 (compatible; ToolStore-UptimeBot/1.0; ' +
    '+https://github.com/Re0XIAOPA/ToolStore) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 读取机场列表
 *
 * 前端的机场配置是 ESM（浏览器用 <script type="module"> 直接加载），这个脚本是 CJS，
 * 不能直接 require。配置目录又在 public/ 下，也不适合为了 Node 往部署目录里塞标记文件。
 * 所以把配置复制一份到系统临时目录，在那里补 {"type":"module"} 再 import ——
 * 既不污染部署目录，也不依赖 Node 的 ESM 语法探测回退（那需要 Node >= 20.10）。
 */
async function loadAirports() {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'airport-check-'));

    const copyScripts = (src, dst) => {
        fs.mkdirSync(dst, { recursive: true });
        for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
            if (entry.name === 'node_modules' || entry.name === 'package.json') continue;
            const from = path.join(src, entry.name);
            const to = path.join(dst, entry.name);
            if (entry.isDirectory()) copyScripts(from, to);
            else if (entry.name.endsWith('.js')) fs.copyFileSync(from, to);
        }
    };

    try {
        copyScripts(CONFIG_DIR, tmpDir);
        fs.writeFileSync(path.join(tmpDir, 'package.json'), '{"type":"module"}');

        const { airportData } = await import(pathToFileURL(path.join(tmpDir, 'airports-data.js')).href);
        return airportData.map(item => ({
            name: item.name,
            link: item.link,
            category: item.category || 'other',
            tier: item.tier || 'default'
        }));
    } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
}

/**
 * 从注册链接里取出站点根地址
 * @param {string} link
 * @returns {string|null}
 */
function getOrigin(link) {
    if (!link || typeof link !== 'string') return null;
    try {
        const url = new URL(link.trim());
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
        return url.origin;
    } catch (err) {
        return null;
    }
}

/**
 * 发起一次探测请求
 * @param {string} url
 * @param {'HEAD'|'GET'} method
 */
async function probeOnce(url, method) {
    const started = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            method,
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                'User-Agent': UA,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
            }
        });

        // 只关心响应头，立刻丢弃 body，避免下载整页拖慢整体速度
        if (res.body && typeof res.body.cancel === 'function') {
            res.body.cancel().catch(() => {});
        }

        return { ok: true, status: res.status, latency: Date.now() - started };
    } catch (err) {
        const code = err && err.cause && err.cause.code ? err.cause.code : null;
        return {
            ok: false,
            latency: Date.now() - started,
            error: code || (err && err.name === 'AbortError' ? 'TIMEOUT' : (err && err.message) || 'ERROR')
        };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * 探测单个站点：先 HEAD，拿不到有效响应再退化为 GET
 * @param {string} url
 */
async function probeSite(url) {
    const head = await probeOnce(url, 'HEAD');

    if (head.ok && head.status < 400) {
        return { status: 'online', code: head.status, latency: head.latency };
    }

    const get = await probeOnce(url, 'GET');
    if (get.ok) {
        // 5xx 说明服务器还活着但已经不正常，标记为 degraded
        return {
            status: get.status >= 500 ? 'degraded' : 'online',
            code: get.status,
            latency: get.latency
        };
    }

    // 两个方法都拿不到响应，但 HEAD 曾经给过 4xx：说明服务器在线（可能是反爬 / 鉴权）
    if (head.ok) {
        return {
            status: head.status >= 500 ? 'degraded' : 'online',
            code: head.status,
            latency: head.latency
        };
    }

    return { status: 'offline', code: null, latency: get.latency, error: get.error };
}

/**
 * 读取站点的 robots.txt
 * 拿不到（404、超时、非文本）时按惯例视为允许
 */
async function fetchRobots(origin) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(origin + '/robots.txt', {
            redirect: 'follow',
            signal: controller.signal,
            headers: { 'User-Agent': UA, 'Accept': 'text/plain,*/*;q=0.8' }
        });
        if (!res.ok || res.status >= 400) return null;
        return await res.text();
    } catch (err) {
        return null;
    } finally {
        clearTimeout(timer);
    }
}

/**
 * 判断 robots.txt 是否禁止抓取整站
 *
 * 只做最小实现：看 `User-agent: *`（或点名本 bot）分组里有没有 `Disallow: /`。
 * 不实现完整的最长匹配规则和 Crawl-delay —— 那种精度对「探一下首页在不在」没必要，
 * 宁可判宽松些，也不要因为解析差异误伤站点正常展示。
 */
function robotsDisallowsAll(text) {
    if (!text) return false;

    let applies = false;
    for (const raw of text.split(/\r?\n/)) {
        const line = raw.split('#')[0].trim();
        if (!line) continue;

        const sep = line.indexOf(':');
        if (sep === -1) continue;

        const key = line.slice(0, sep).trim().toLowerCase();
        const value = line.slice(sep + 1).trim();

        if (key === 'user-agent') {
            applies = value === '*' || value.toLowerCase().includes('toolstore');
            continue;
        }
        if (applies && key === 'disallow' && value === '/') {
            return true;
        }
    }
    return false;
}

/**
 * 简易并发池
 * @param {Array} items
 * @param {number} limit
 * @param {Function} worker
 */
async function runPool(items, limit, worker) {
    const results = new Array(items.length);
    let cursor = 0;

    const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (cursor < items.length) {
            const index = cursor++;
            results[index] = await worker(items[index], index);
        }
    });

    await Promise.all(runners);
    return results;
}

async function main() {
    console.log('开始检测机场在线状态...\n');

    // 机场配置是 ESM，复制一份到临时目录标记成 module 后再 import
    const airports = await loadAirports();

    const targets = airports
        .map(item => ({
            name: item.name,
            category: item.category,
            tier: item.tier,
            url: getOrigin(item.link)
        }));

    console.log(`共发现 ${targets.length} 个机场\n`);

    const startedAt = Date.now();
    const checkedAt = new Date().toISOString();

    const results = await runPool(targets, CONCURRENCY, async (target) => {
        if (!target.url) {
            console.log(`  [跳过]   ${target.name} —— 链接无效`);
            return { ...target, status: 'unknown', code: null, latency: null, checkedAt };
        }

        // 固定间隔，把请求摊开，不在短时间内连续打向任何站点
        await sleep(SITE_DELAY_MS);

        // 站点在 robots.txt 里明确禁止就别硬测，如实标成未检测
        if (RESPECT_ROBOTS_TXT) {
            const robots = await fetchRobots(target.url);
            if (robotsDisallowsAll(robots)) {
                console.log(`  [跳过]   ${target.name} —— robots.txt 不允许自动访问`);
                return {
                    ...target,
                    status: 'unknown',
                    code: null,
                    latency: null,
                    error: 'ROBOTS_DISALLOWED',
                    checkedAt
                };
            }
        }

        const outcome = await probeSite(target.url);

        const icon = { online: '在线', degraded: '异常', offline: '离线', unknown: '未知' }[outcome.status];
        const detail = outcome.code ? `HTTP ${outcome.code}` : (outcome.error || '');
        console.log(
            `  [${icon}] ${target.name.padEnd(18, ' ')} ${String(outcome.latency).padStart(5)}ms  ${detail}  ${target.url}`
        );

        return { ...target, ...outcome, checkedAt };
    });

    const summary = { total: results.length, online: 0, degraded: 0, offline: 0, unknown: 0 };
    results.forEach(r => { summary[r.status] = (summary[r.status] || 0) + 1; });

    const payload = {
        updatedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        summary,
        airports: results
    };

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');

    console.log('\n检测完成');
    console.log(`  在线 ${summary.online} · 异常 ${summary.degraded} · 离线 ${summary.offline} · 未知 ${summary.unknown}`);
    console.log(`  耗时 ${(payload.durationMs / 1000).toFixed(1)}s`);
    console.log(`  已写入 ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

main().catch(err => {
    console.error('检测机场状态时出错:', err);
    process.exit(1);
});
