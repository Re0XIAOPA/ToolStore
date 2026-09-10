/**
 * 机场在线状态模块
 *
 * 两级检测：
 *   1. 服务端：GitHub Actions 真实请求一次，结果落在
 *      assets/data/airport-status.json。带 HTTP 状态码和响应耗时，首屏直接秒显。
 *   2. 浏览器校准：首屏渲染完后，用访客自己的网络在后台重测一遍。
 *      服务端在境外，网络环境和访客不同，所以以本地结果为准覆盖徽章，
 *      并把两者的差异写进悬浮提示里。
 *
 * ── 关于「本地探测」与代理（重要，先读这段）─────────────────────────────
 *
 * 本地探测用的是浏览器原生的 fetch / no-cors 请求。关于代理，有一条容易被
 * 误解的事实：
 *
 *   浏览器的所有请求本来就会自动走「浏览器/操作系统的代理设置」。
 *   网页 JS 既没有开关去绕过代理，也没有能力去指定或切换代理。
 *
 * 也就是说，用户开了系统级代理 / 全局模式 VPN，我们的探测请求会自动跟着走
 * 代理，无需我们做任何「切换」；用户没开，就是直连。所以「检测走不走代理」
 * 这件事浏览器已经替我们处理好了，本模块不需要也无法干预。
 *
 * 那为什么还会出现「用户手动能打开、检测却说连不上」？真正的原因通常是下面
 * 这几种，都和「绕过代理」无关：
 *
 *   a. 混合内容拦截：本站是 HTTPS，部分机场官网是 HTTP。浏览器禁止 HTTPS
 *      页面用脚本去请求 HTTP 站点。用户手动在地址栏打开 HTTP 链接是允许的，
 *      但脚本请求会被拦 —— 这是最典型、也最常见的一种误判。→ 标记为
 *      undetectable「无法探测」，而不是「离线」。
 *   b. 应用级 / 扩展级代理：代理只管住了部分应用或部分域名（PAC 规则、
 *      SwitchyOmega 等），浏览器整体没走代理，那么网页侧无论如何都改不了，
 *      只能由用户在浏览器里开系统/全局代理。→ 通过「整体不可达」提示引导用户。
 *   c. 探测请求被当成失败：DNS 污染、端口封锁、证书错误、超时，都会让
 *      fetch reject。其中「超时」在走代理握手慢时尤其容易发生。→ 提高超时并重试。
 *
 * 网页无法自动读取系统代理配置，也无法检测 VPN 是否开启（Web 平台没有这种
 * API，只有浏览器扩展才有 chrome.proxy 之类的能力）。因此本模块的策略是：
 *   - 依靠浏览器自身的网络栈（自动含系统代理），不做多余干预；
 *   - 先做一次「本机能否上网」的基线探测，把「设备没网」和「站点连不上」分开；
 *   - 把浏览器策略导致的失败单独标成 undetectable，绝不冒充「离线」；
 *   - 提供一个显式的「网络环境」声明（自动 / 已用代理 / 直连），因为网页
 *     检测不了代理，只能让用户告诉我们，用来把文案调准。
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
// 本地探测的超时时间：4 秒。健康站点通常在 1 秒内就有响应，走代理也只是稍慢；
// 只有「超时」才会重试一次，所以一个慢站累计仍有约 9 秒耐心（4 + 1.2 + 4），
// 比原来「单次等 8 秒」更宽容，而真正连不上的站点能更快收敛（原来 8 + 1.2 + 8 ≈ 17 秒）
const PROBE_TIMEOUT = 4000;
// 失败后重试次数与两次尝试之间的间隔
const PROBE_RETRY = 1;
const RETRY_GAP_MS = 1200;
// 并发数。每个站点只会收到 1 个 HEAD 请求，谈不上压力，
// 压到 3 是为了不一次性占满访客浏览器的连接数，也给对方站点留余地
const CONCURRENCY = 3;
// 两次探测之间的小间隔，把请求摊开
const PROBE_GAP_MS = 200;
// status.json 超过这个时长就认为过期
const STALE_MS = 26 * 60 * 60 * 1000;
// 等首屏渲染完再开始本地探测，避免和图片等资源抢带宽
const CALIBRATION_DELAY = 800;
// 用 requestIdleCallback 排队时的最长等待上限。
// 注意这是「兜底上限」而非固定延迟：页面空闲就立刻跑，一直忙才等到这里
const IDLE_TIMEOUT_MS = 1200;
// 本地探测要不要覆盖 robots.txt 禁止自动访问的站点
//
// robots.txt 约束的是「爬虫」，而本地探测是访客自己浏览器发起的一次 HEAD，
// 和用户手动打开网站没有区别，不属于爬虫行为。对访客来说，能看到真实状态
// 远比一句「未检测」有用，所以这里默认照测；服务端那个 bot 仍严格遵守 robots.txt。
const PROBE_ROBOTS_BLOCKED_SITES = true;
// 本地探测结果在浏览器里的缓存时长，避免刷新一次就重打一遍所有站点
const CALIBRATION_TTL = 30 * 60 * 1000;
const CACHE_KEY = 'airportUptimeLocal';
// 用户显式声明的网络环境：auto | proxy | direct（网页读不到系统代理，只能问用户）
const NET_ENV_KEY = 'airportNetEnv';

const STATUS_META = {
    checking: { text: '检测中', word: '正在检测站点可达性' },
    online: { text: '在线', word: '当前网络可正常访问该站点' },
    degraded: { text: '异常', word: '站点有响应，但返回了错误状态' },
    blocked: {
        text: '无法访问',
        word: '当前网络环境无法连通该站点（可能需要代理），不代表站点离线'
    },
    // 浏览器策略拦住、根本没测成 —— 既不能说在线，也不能说离线
    undetectable: {
        text: '无法探测',
        word: '受浏览器安全策略限制，未能完成探测，请手动打开确认'
    },
    offline: { text: '离线', word: '各检测点均无法连通该站点，可能已停止服务' },
    unknown: { text: '未检测', word: '暂无可用的检测数据' }
};

// 用户可选网络环境的展示文案
const NET_ENV_LABEL = {
    auto: '网络环境：自动',
    proxy: '网络环境：已用代理',
    direct: '网络环境：直连'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 服务端探测的常见错误码中文说明
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

// 本地（浏览器）探测失败的说明，区分「测不了」和「测到连不上」
const LOCAL_ERROR_TEXT = {
    MIXED_CONTENT: '浏览器不允许 HTTPS 页面用脚本请求 HTTP 站点',
    DEVICE_OFFLINE: '本机当前未联网',
    DEVICE_NETWORK: '本机网络异常，探测请求发不出去',
    TIMEOUT: '连接超时（代理或线路较慢时常见）',
    NETWORK_ERROR: '连接失败（可能被拦截，或需要代理）'
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
// 本机基线探测失败：设备整体上不了网（区别于「站点连不上」）
let networkDown = false;
// 基线正常，但所有被测站点都连不上 —— 多半是本机代理/VPN 没覆盖浏览器
let allUnreachable = false;
// 用户声明的网络环境，仅用于校准文案
let netEnv = 'auto';
// 校准进度，用于「正在校准 x/y」的提示
let calibrationProgress = { done: 0, total: 0 };

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
 * 读取用户声明的网络环境（网页读不到系统代理，只能由用户选择）
 */
function loadNetEnv() {
    try {
        const v = localStorage.getItem(NET_ENV_KEY);
        return v === 'proxy' || v === 'direct' ? v : 'auto';
    } catch (err) {
        return 'auto';
    }
}

function saveNetEnv(value) {
    try {
        localStorage.setItem(NET_ENV_KEY, value);
    } catch (err) {
        // 存不了就只在本次会话生效
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

/* ============================ 本地探测 ============================ */

/**
 * 该目标是否会被浏览器安全策略直接拦掉（脚本请求不出去）
 *
 * 本站以 HTTPS 提供服务，而不少机场官网仍是 HTTP。浏览器禁止 HTTPS 页面
 * 通过脚本请求 HTTP 资源（混合内容），这类请求连网络层都没走到就被拦截，
 * 属于「测不了」，而不是「连不上」。
 */
function isScriptBlockedByPage(origin) {
    return typeof location !== 'undefined'
        && location.protocol === 'https:'
        && /^http:/i.test(origin);
}

/**
 * 本机网络基线探测
 *
 * 先确认「这台设备现在能不能上网」，用的是本站自己的静态资源：
 *   - 能拿到任何 HTTP 响应（哪怕是 404）就说明本机网络通路正常；
 *   - 请求抛错则说明本机没网/网络异常。
 * 这条请求同样会经过浏览器/系统代理，因此顺带验证了代理是否对浏览器生效。
 *
 * 有了这一步，才能把「设备上不了网」和「某个站点连不上」分开 ——
 * 否则设备断网时，所有站点都会被误判成「连不上」。
 */
async function probeNetworkBaseline() {
    const checkedAt = new Date().toISOString();

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return { ok: false, error: 'DEVICE_OFFLINE', checkedAt };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT);

    try {
        await fetch(`${STATUS_URL}?_baseline=${Date.now()}`, {
            cache: 'no-store',
            signal: controller.signal
        });
        return { ok: true, checkedAt };
    } catch (err) {
        return {
            ok: false,
            error: err && err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
            checkedAt
        };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * 单次探测：no-cors 下读不到状态码，但只要 fetch 没抛错就说明
 * TCP/TLS 握手成功、服务器给了响应；抛错则是 DNS 失败、连接被拒或超时。
 */
async function probeOnce(targetUrl) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT);

    try {
        await fetch(targetUrl, {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store',
            credentials: 'omit',
            redirect: 'follow',
            signal: controller.signal
        });
        return { ok: true };
    } catch (err) {
        return { ok: false, name: err && err.name };
    } finally {
        clearTimeout(timer);
    }
}

/**
 * 浏览器端探测单个站点，返回本地侧的结论
 *
 * 返回值 status 只表示「本地探测视角」：
 *   online       本地能连通
 *   offline      本地连不上（网络层失败/超时）
 *   undetectable 浏览器策略拦截，压根没测成（如 HTTPS→HTTP 混合内容）
 */
async function probeFromBrowser(origin) {
    const checkedAt = new Date().toISOString();
    if (!origin) return { status: 'unknown', source: 'browser', checkedAt };

    // 混合内容：测不了就别瞎判，交给用户手动确认
    if (isScriptBlockedByPage(origin)) {
        return { status: 'undetectable', error: 'MIXED_CONTENT', source: 'browser', checkedAt };
    }

    let lastError = 'NETWORK_ERROR';
    let lastLatency = null;

    for (let attempt = 0; attempt <= PROBE_RETRY; attempt++) {
        const started = performance.now();
        const result = await probeOnce(`${origin}/?_uptime=${Date.now()}`);
        lastLatency = Math.round(performance.now() - started);

        if (result.ok) {
            return {
                status: 'online',
                latency: lastLatency,
                source: 'browser',
                checkedAt
            };
        }

        lastError = result.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';

        // 只有超时才值得重试：DNS 解析不了、连接被拒、被策略拦截都是确定性结果，
        // 隔一秒再来一次基本还是失败，白白多等一轮
        if (lastError !== 'TIMEOUT') break;
        if (attempt < PROBE_RETRY) await sleep(RETRY_GAP_MS);
    }

    return {
        status: 'offline',
        error: lastError,
        latency: lastLatency,
        source: 'browser',
        checkedAt
    };
}

/* ============================ 状态判定 ============================ */

/**
 * 最终展示给访客的状态
 *
 * 两个探测点各有各的局限：服务端看得到状态码，但网络环境和访客不同；
 * 访客本地反映的是真实体验，但 no-cors 探测拿不到状态码。
 * 两者合起来才能区分「站点死了」「你访问不到」「根本测不了」这三件不同的事。
 */
function effectiveStatus(entry) {
    if (!entry) return 'unknown';

    const local = entry.local;
    // 还没有本地结果时，先给服务端的结论
    if (!local || local.status === 'unknown') return entry.status;

    // 本地能连通，对访客来说就是能打开
    if (local.status === 'online') return 'online';

    // 浏览器策略拦住了（混合内容等），没有可用结论：
    // 服务端有说法就听服务端，服务端也没说法就如实标「无法探测」，绝不冒充离线
    if (local.status === 'undetectable') {
        return (entry.status === 'offline' || entry.status === 'unknown')
            ? 'undetectable'
            : entry.status;
    }

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
        if (local.status === 'online') {
            parts.push('本地探测可连通');
        } else if (local.status === 'undetectable') {
            parts.push(`本地无法探测：${LOCAL_ERROR_TEXT[local.error] || '浏览器限制'}`);
        } else {
            const why = LOCAL_ERROR_TEXT[local.error];
            parts.push(`本地探测无法连通${why ? `（${why}）` : ''}`);
        }
    }

    // 用户声明了在用代理，却仍连不上：把「该查什么」直接说出来
    if (netEnv === 'proxy' && (shown === 'blocked' || shown === 'undetectable')) {
        parts.push('已标记使用代理；若仍打不开，请确认代理已对浏览器生效');
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
 * 切换用户声明的网络环境（自动 → 已用代理 → 直连）
 *
 * 网页读不到系统代理，所以只能让用户自己告诉我们是哪种环境。
 * 切换后旧结论作废，重新按新环境探测一遍。
 */
function cycleNetEnv() {
    const order = ['auto', 'proxy', 'direct'];
    netEnv = order[(order.indexOf(netEnv) + 1) % order.length];
    saveNetEnv(netEnv);

    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (err) {
        // 忽略存储异常
    }

    calibrated = false;
    calibratedFromCache = false;
    renderSectionMeta();

    if (ENABLE_LOCAL_CALIBRATION && !calibrating) calibrate();
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
        const { done, total } = calibrationProgress;
        text = total
            ? `正在按你的网络校准站点状态… ${done}/${total}`
            : '正在按你的网络校准站点状态…';
    } else if (calibrated) {
        let tail;
        if (networkDown) {
            // 本机整体没网：所有站点都会「连不上」，别让访客误以为是站点的问题
            tail = '本机当前无法联网，暂以服务端结果为准';
        } else if (allUnreachable) {
            tail = netEnv === 'proxy'
                ? '所有站点都连不上；你已标记「使用代理」，请确认代理已对浏览器生效（建议用系统/全局代理模式）'
                : '所有被测站点都连不上，多半是本机代理/VPN 没覆盖到浏览器，请检查网络或代理设置';
        } else if (blockedCount > 0) {
            tail = `${blockedCount} 个站点在当前网络下无法连通`;
        } else {
            tail = '所列站点均可正常访问';
        }
        const suffix = calibratedFromCache ? '（近 30 分钟内的结果）' : '';
        text = `状态已结合当前网络校准 · ${tail}${suffix}`;
    } else if (metaSource === 'server') {
        text = `站点状态由服务端每 6 小时自动检测 · 更新于${formatRelative(metaUpdatedAt) || '刚刚'}`;
    } else if (metaSource === 'browser') {
        text = '站点状态由当前浏览器实时检测';
    } else {
        meta.textContent = '';
        return;
    }

    meta.innerHTML = '<span class="uptime-meta-dot"></span>'
        + `<span class="uptime-meta-text">${text}</span>`;

    // 网页无法自动读取系统代理设置，只能让用户显式声明，用来校准文案
    if (calibrated) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'uptime-netenv';
        btn.textContent = NET_ENV_LABEL[netEnv] || NET_ENV_LABEL.auto;
        btn.title = '网页读不到系统代理设置；手动选择你的网络环境，可让状态提示更准确';
        btn.addEventListener('click', cycleNetEnv);
        meta.appendChild(btn);
    }
}

/**
 * 等页面空闲后再跑本地探测
 */
function scheduleCalibration() {
    const run = () => { calibrate(); };
    if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS });
    } else {
        setTimeout(run, CALIBRATION_DELAY);
    }
}

/**
 * 把某个站点的本地结果合并进检测结果，并立刻刷新它的徽章
 *
 * 逐站刷新（而不是等全部跑完再一起刷）是体感上的关键：一轮校准里快站 1 秒内就有
 * 结论，慢站可能要 9 秒；一次性的批量刷新会让用户在前几秒什么都看不到。
 */
function mergeLocalResult(name, local) {
    const base = uptimeMap.get(name) || { name, status: 'unknown' };
    const merged = { ...base, local };
    uptimeMap.set(name, merged);
    setStatus(name, merged);
}

/**
 * 重算分区说明用到的计数
 */
function refreshCalibrationSummary() {
    const all = Array.from(uptimeMap.values());

    // 「站点可能仍在运行、只是当前网络访问不了」的站点数
    blockedCount = all.filter(e => effectiveStatus(e) === 'blocked').length;

    // 真正测出去的结果里一个都没连通 —— 多半是本机代理/VPN 的问题
    const probed = all.filter(e => e.local
        && (e.local.status === 'online' || e.local.status === 'offline'));
    const reachable = probed.filter(e => e.local.status === 'online').length;
    allUnreachable = !networkDown && probed.length > 0 && reachable === 0;
}

/**
 * 批量套用一组本地结果（读取 30 分钟缓存时使用）
 * @param {Object} results name -> 本地探测结果
 */
function applyLocalResults(results) {
    badgeMap.forEach((_, name) => {
        if (results[name]) mergeLocalResult(name, results[name]);
    });

    refreshCalibrationSummary();
    calibrated = true;
    renderSectionMeta();
}

/**
 * 判断某个站点要不要做本地探测
 *
 * 只有拿不到可用链接时才跳过（没法构造请求）。robots.txt 禁止自动访问的服务端站点
 * 默认仍然探测：那是访客自己浏览器的请求，不是爬虫，让用户看到状态更有意义。
 */
function localProbeTarget(name) {
    const base = uptimeMap.get(name);
    if (!PROBE_ROBOTS_BLOCKED_SITES && base && base.error === 'ROBOTS_DISALLOWED') {
        return { skip: true };
    }

    const item = airportData.find(a => a.name === name);
    const origin = item ? getOrigin(item.link) : null;
    if (!origin) return { skip: true };

    return { skip: false, origin };
}

/**
 * 用访客自己的网络重测所有机场，结果逐站刷新到对应卡片上
 */
async function calibrate() {
    if (calibrating) return;
    calibrating = true;
    calibrated = false;

    const names = Array.from(badgeMap.keys());
    const results = {};

    // 先亮出进度，比「转圈几十秒后一起变」好得多
    calibrationProgress = { done: 0, total: names.length };
    renderSectionMeta();

    // 先确认本机能不能上网，再逐站探测：
    // 否则设备断网时，所有站点都会被误判成「连不上」
    const baseline = await probeNetworkBaseline();
    networkDown = !baseline.ok;

    if (networkDown) {
        names.forEach(name => {
            const local = {
                status: 'undetectable',
                error: baseline.error === 'DEVICE_OFFLINE' ? 'DEVICE_OFFLINE' : 'DEVICE_NETWORK',
                source: 'browser',
                checkedAt: baseline.checkedAt
            };
            results[name] = local;
            mergeLocalResult(name, local);
        });
        calibrationProgress = { done: names.length, total: names.length };
    } else {
        let cursor = 0;
        const runners = Array.from({ length: Math.min(CONCURRENCY, names.length) }, async () => {
            while (cursor < names.length) {
                const name = names[cursor++];
                const target = localProbeTarget(name);

                if (!target.skip) {
                    await sleep(PROBE_GAP_MS);
                    const local = await probeFromBrowser(target.origin);
                    results[name] = local;
                    // 每站一完成就刷新，状态一个个亮起来
                    mergeLocalResult(name, local);
                }

                calibrationProgress.done++;
                refreshCalibrationSummary();
                renderSectionMeta();
            }
        });

        await Promise.all(runners);
    }

    saveLocalCache(results);
    calibrating = false;
    calibrated = true;
    refreshCalibrationSummary();
    renderSectionMeta();
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
    networkDown = false;
    allUnreachable = false;
    calibrationProgress = { done: 0, total: 0 };
    netEnv = loadNetEnv();

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
