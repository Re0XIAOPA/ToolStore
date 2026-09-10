/**
 * 机场在线状态模块
 *
 * 两级检测：
 *   1. 服务端：GitHub Actions 每 6 小时真实请求一次，结果落在
 *      assets/data/airport-status.json。带 HTTP 状态码和响应耗时，首屏直接秒显。
 *   2. 浏览器校准：首屏渲染完后，用访客自己的网络在后台重测一遍。
 *      服务端在境外，网络环境和访客不同，所以以本地结果为准覆盖徽章，
 *      并把两者的差异写进悬浮提示里。
 *
 * 对外接口：
 *   - initUptimeBadges()   渲染完卡片后调用，给每张机场卡片挂状态徽章
 *   - getUptimeEntry(name) 查询某个机场的检测结果
 *   - buildUptimeBar(name) 生成详情弹窗里的状态提示条 HTML
 */

import { airportData } from '../configs/airports-data.js';

const STATUS_URL = 'assets/data/airport-status.json';

// 关掉后只用服务端数据，不再用访客网络重测
const ENABLE_LOCAL_CALIBRATION = true;
// 本地探测的超时时间：服务端在境外跑可以慢慢等，浏览器里要顾及访客体感
const PROBE_TIMEOUT = 6000;
// 并发数。每个站点只会收到 1 个 HEAD 请求，谈不上压力，
// 压到 3 是为了不一次性占满访客浏览器的连接数，也给对方站点留余地
const CONCURRENCY = 3;
// 两次探测之间的小间隔，把请求摊开
const PROBE_GAP_MS = 200;
// status.json 超过这个时长就认为过期
const STALE_MS = 26 * 60 * 60 * 1000;
// 等首屏渲染完再开始本地探测，避免和图片等资源抢带宽
const CALIBRATION_DELAY = 800;
// 本地探测结果在浏览器里的缓存时长，避免刷新一次就重打一遍所有站点
const CALIBRATION_TTL = 30 * 60 * 1000;
const CACHE_KEY = 'airportUptimeLocal';

const STATUS_META = {
    checking: { text: '检测中', word: '正在检测站点可达性' },
    online: { text: '在线', word: '当前网络可正常访问该站点' },
    degraded: { text: '异常', word: '站点有响应，但返回了错误状态' },
    blocked: {
        text: '无法访问',
        word: '当前网络环境无法连通该站点（可能需要代理），不代表站点离线'
    },
    offline: { text: '离线', word: '各检测点均无法连通该站点，可能已停止服务' },
    unknown: { text: '未检测', word: '暂无可用的检测数据' }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 常见网络错误码的中文说明
const ERROR_TEXT = {
    TIMEOUT: '连接超时',
    UND_ERR_CONNECT_TIMEOUT: '连接超时',
    ETIMEDOUT: '连接超时',
    ESOCKETTIMEDOUT: '连接超时',
    NETWORK_ERROR: '网络不可达',
    ECONNREFUSED: '连接被拒绝',
    ECONNRESET: '连接被重置',
    ENOTFOUND: '域名无法解析',
    EAI_AGAIN: '域名解析失败',
    CERT_HAS_EXPIRED: '证书已过期',
    DEPTH_ZERO_SELF_SIGNED_CERT: '证书不受信任',
    ROBOTS_DISALLOWED: 'robots.txt 限制，未探测'
};

// name -> 检测结果（服务端结果，本地结果挂在 entry.local 上）
const uptimeMap = new Map();
// name -> [{ card, badge }]
const badgeMap = new Map();

let metaSource = '';
let metaUpdatedAt = null;
let calibrating = false;
let calibrated = false;
let calibratedFromCache = false;
let blockedCount = 0;

/**
 * 读取本地探测结果的缓存，过期或不可用时返回 null
 */
function loadLocalCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || !data.results || Date.now() - data.at > CALIBRATION_TTL) return null;
        return data.results;
    } catch (err) {
        // 隐私模式下 localStorage 可能不可用，退化成每次都探测
        return null;
    }
}

/**
 * 缓存本地探测结果
 */
function saveLocalCache(results) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), results }));
    } catch (err) {
        // 存不了就算了，下次重新探测
    }
}

/**
 * 取站点根地址
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
 * 把时间格式化成「刚刚 / N 分钟前 / N 小时前 / N 天前」
 */
function formatRelative(iso) {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';

    const diff = Date.now() - then;
    if (diff < 0) return '刚刚';

    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;

    const days = Math.floor(hours / 24);
    return `${days} 天前`;
}

/**
 * 最终展示给访客的状态
 *
 * 两个探测点各有各的局限：服务端看得到状态码，但网络环境和访客不同；
 * 访客本地反映的是真实体验，但 no-cors 探测拿不到状态码。
 * 两者合起来才能区分「站点死了」和「你访问不到」这两件完全不同的事。
 */
function effectiveStatus(entry) {
    if (!entry) return 'unknown';

    const local = entry.local;
    // 还没有本地结果时，先给服务端的结论
    if (!local || local.status === 'unknown') return entry.status;

    // 本地能连通，对访客来说就是能打开
    if (local.status === 'online') return 'online';

    // 本地连不上：只有当另一个检测点也连不上，才能说站点离线。
    // 否则只能说明当前网络环境访问不了（地区限制、需要代理等），站点可能仍在运行
    if (local.status === 'offline') {
        return entry.status === 'offline' ? 'offline' : 'blocked';
    }

    return entry.status;
}

/**
 * 生成徽章的悬浮提示文案
 *
 * 统一按「结论 · 本地探测结果 · 服务端检测结果 · 检测时间」组织，
 * 各检测点的结论逐条列出，不做“谁推翻谁”的判断，标签与文案始终一致。
 */
function describe(entry) {
    if (!entry) return '暂无检测数据';

    const shown = effectiveStatus(entry);
    const local = entry.local;

    let word = STATUS_META[shown] ? STATUS_META[shown].word : '状态未知';
    // 4xx 说明服务器确实在响应，只是拒绝了自动访问（WAF、反爬、地区限制等）
    if (entry.code >= 400 && entry.code < 500 && (shown === 'online' || shown === 'degraded')) {
        word = '站点已响应，可能限制了自动访问';
    }

    const parts = [word];

    if (local && local.status !== 'unknown') {
        parts.push(local.status === 'online' ? '本地探测可连通' : '本地探测无法连通');
    }

    if (entry.source !== 'browser' && entry.status !== 'unknown' && entry.status !== 'checking') {
        if (entry.code) {
            parts.push(`服务端 HTTP ${entry.code}`);
        } else if (entry.error) {
            parts.push(`服务端 ${ERROR_TEXT[entry.error] || entry.error}`);
        }
    } else if (entry.error) {
        parts.push(ERROR_TEXT[entry.error] || entry.error);
    }

    const when = formatRelative((local && local.checkedAt) || entry.checkedAt);
    if (when) parts.push(`检测于${when}`);

    return parts.join(' · ');
}

/**
 * 在卡片上创建状态徽章
 */
function createBadge(card) {
    let badge = card.querySelector('.uptime-badge');
    if (badge) return badge;

    badge = document.createElement('div');
    badge.className = 'uptime-badge is-checking';
    badge.innerHTML = '<span class="uptime-dot"></span><span class="uptime-text">检测中</span>';
    card.appendChild(badge);
    return badge;
}

/**
 * 把某个机场的检测结果刷到对应卡片上
 */
function setStatus(name, entry) {
    const items = badgeMap.get(name);
    if (!items) return;

    const shown = effectiveStatus(entry);
    const meta = STATUS_META[shown] || STATUS_META.unknown;
    const isOffline = shown === 'offline';

    items.forEach(({ card, badge }) => {
        badge.className = `uptime-badge is-${shown}`;
        badge.querySelector('.uptime-text').textContent = meta.text;
        badge.title = `${name}：${describe(entry)}`;
        badge.setAttribute('aria-label', badge.title);
        card.classList.toggle('airport-offline', isOffline);
    });
}

/**
 * 读取服务端生成的 status.json
 */
async function loadRemoteStatus() {
    try {
        const res = await fetch(`${STATUS_URL}?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return null;

        const data = await res.json();
        if (!data || !Array.isArray(data.airports)) return null;

        return { list: data.airports, updatedAt: data.updatedAt };
    } catch (err) {
        return null;
    }
}

/**
 * 浏览器端探测
 *
 * no-cors 模式下读不到状态码，但只要 fetch 没抛错就说明 TCP/TLS 握手成功、
 * 服务器给了响应；抛错则是 DNS 失败、连接被拒或超时。
 * HEAD 不被接受时退化为 GET。
 */
async function probeFromBrowser(url) {
    const checkedAt = new Date().toISOString();
    if (!url) return { status: 'unknown', source: 'browser', checkedAt };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT);
    const started = performance.now();

    try {
        // no-cors 下 405 这类响应 fetch 同样会 resolve，只有 DNS 失败、连接被拒、
        // 超时才会 reject；既然连不上，换 GET 也不会通，没必要再打一次请求
        await fetch(`${url}/?_uptime=${Date.now()}`, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            credentials: 'omit',
            signal: controller.signal
        });
        return {
            status: 'online',
            latency: Math.round(performance.now() - started),
            source: 'browser',
            checkedAt
        };
    } catch (err) {
        return {
            status: 'offline',
            error: err && err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
            latency: Math.round(performance.now() - started),
            source: 'browser',
            checkedAt
        };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * 在机场分区标题下补一行状态说明
 */
function renderSectionMeta() {
    const header = document.querySelector('#proxy .tools-header');
    if (!header) return;

    let meta = header.querySelector('.uptime-meta');
    if (!meta) {
        meta = document.createElement('div');
        meta.className = 'uptime-meta';
        header.appendChild(meta);
    }

    let text;
    if (calibrating) {
        text = '正在按你的网络校准站点状态…';
    } else if (calibrated) {
        const tail = blockedCount > 0
            ? `${blockedCount} 个站点在当前网络下无法连通`
            : '所列站点均可正常访问';
        text = `状态已结合当前网络校准 · ${tail}${calibratedFromCache ? '（近 30 分钟内的结果）' : ''}`;
    } else if (metaSource === 'server') {
        text = `站点状态由服务端每 6 小时自动检测 · 更新于${formatRelative(metaUpdatedAt) || '刚刚'}`;
    } else if (metaSource === 'browser') {
        text = '站点状态由当前浏览器实时检测';
    } else {
        meta.textContent = '';
        return;
    }

    meta.innerHTML = '<span class="uptime-meta-dot"></span>' + text;
}

/**
 * 等页面空闲后再跑本地探测
 */
function scheduleCalibration() {
    const run = () => { calibrate(); };
    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(run, { timeout: 3000 });
    } else {
        setTimeout(run, CALIBRATION_DELAY);
    }
}

/**
 * 把本地探测结果合并进检测结果并刷新徽章
 * @param {Object} results name -> 本地探测结果
 */
function applyLocalResults(results) {
    badgeMap.forEach((_, name) => {
        const base = uptimeMap.get(name) || { name, status: 'unknown' };
        const merged = results[name] ? { ...base, local: results[name] } : base;
        uptimeMap.set(name, merged);
        setStatus(name, merged);
    });

    // 统计「站点可能仍在运行、只是当前网络访问不了」的站点数
    blockedCount = Array.from(uptimeMap.values())
        .filter(e => effectiveStatus(e) === 'blocked').length;

    calibrated = true;
    renderSectionMeta();
}

/**
 * 用访客自己的网络重测所有机场，并覆盖徽章
 */
async function calibrate() {
    if (calibrating) return;
    calibrating = true;
    renderSectionMeta();

    const names = Array.from(badgeMap.keys());
    const results = {};
    let cursor = 0;

    const runners = Array.from({ length: Math.min(CONCURRENCY, names.length) }, async () => {
        while (cursor < names.length) {
            const name = names[cursor++];
            await sleep(PROBE_GAP_MS);
            const item = airportData.find(a => a.name === name);
            const url = item ? getOrigin(item.link) : null;
            results[name] = await probeFromBrowser(url);
        }
    });

    await Promise.all(runners);

    saveLocalCache(results);
    calibrating = false;
    applyLocalResults(results);
}

/**
 * 入口：给所有机场卡片挂上状态徽章
 */
export async function initUptimeBadges() {
    const cards = Array.from(document.querySelectorAll('#proxy .card.proxy-card'));
    if (!cards.length) return;

    badgeMap.clear();
    uptimeMap.clear();
    calibrating = false;
    calibrated = false;
    calibratedFromCache = false;
    blockedCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.card-title');
        const name = title ? title.textContent : '';
        if (!name) return;
        const key = name.trim();
        const badge = createBadge(card);
        if (!badgeMap.has(key)) badgeMap.set(key, []);
        badgeMap.get(key).push({ card, badge });
    });

    // 先统一显示「检测中」
    badgeMap.forEach((_, name) => setStatus(name, { status: 'checking' }));

    const remote = await loadRemoteStatus();
    const stale = !remote || !remote.updatedAt ||
        (Date.now() - new Date(remote.updatedAt).getTime() > STALE_MS);

    if (remote && !stale) {
        metaSource = 'server';
        metaUpdatedAt = remote.updatedAt;
        remote.list.forEach(entry => {
            if (entry && entry.name) uptimeMap.set(entry.name, entry);
        });
    } else {
        metaSource = 'browser';
    }

    badgeMap.forEach((_, name) => {
        setStatus(name, uptimeMap.get(name) || { name, status: 'unknown' });
    });
    renderSectionMeta();

    if (ENABLE_LOCAL_CALIBRATION) {
        const cached = loadLocalCache();
        if (cached) {
            // 30 分钟内探测过就直接复用，不再打扰那 18 个站点
            calibratedFromCache = true;
            applyLocalResults(cached);
        } else {
            scheduleCalibration();
        }
    }
}

/**
 * 供详情弹窗查询检测结果
 */
export function getUptimeEntry(name) {
    return uptimeMap.get((name || '').trim()) || null;
}

/**
 * 生成详情弹窗里的状态提示条
 */
export function buildUptimeBar(name) {
    const entry = getUptimeEntry(name);
    if (!entry) return '';

    const shown = effectiveStatus(entry);
    if (shown === 'checking' || shown === 'unknown') return '';

    const meta = STATUS_META[shown] || STATUS_META.unknown;
    const detail = describe(entry);

    return `
        <div class="uptime-bar uptime-bar-${shown}">
            <span class="uptime-bar-dot"></span>
            <div class="uptime-bar-text">
                <strong>${meta.text}</strong>
                <span>${detail}</span>
            </div>
        </div>
    `;
}
