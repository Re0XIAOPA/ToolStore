const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');
const manualConfig = require('./manual-config');

// 导入配置（如果存在）
let config = {};
try {
    config = require('./config');
} catch (err) {
    console.log('未找到config.js文件，将使用默认配置');
}

// 格式化版本号，确保以 v 开头
function formatVersion(version) {
    if (!version) return 'N/A';

    // 移除可能存在的 v 前缀
    version = version.replace(/^v/i, '');

    // 移除常见的前缀词（如 mobile-、release- 等）
    version = version.replace(/^(mobile-|release-|v-|version-)/i, '');

    // 提取版本号部分（匹配 x.y.z 格式）
    const versionMatch = version.match(/\d+\.\d+(\.\d+)?/);
    if (versionMatch) {
        version = versionMatch[0];
    }

    // 添加 v 前缀
    return `v${version}`;
}

// 配置项
const CONFIG = {
    // 需要排除的仓库（比如一些特殊的应用商店链接）
    excludeRepos: [
        'shadowrocket',
        'quantumultx',
        'surge5',
        'oneclick',
        'v2box',
        'streisand',
        'npvtunnel'
    ],
    // 仓库名称映射（将GitHub仓库名映射到我们想要的名称）
    repoNameMapping: {
        'clash-verge-rev': 'clash verge',
        'mihomo-party': 'mihomo party',
        'ClashMetaForAndroid': 'clashmeta',
        'surfboard': 'surfboard',
        'v2rayN': 'v2rayn',
        'v2rayNG': 'v2rayng',
        'sing-box': 'singbox',
        'GUI.for.SingBox': 'gui.for.singbox',
        'FlClash': 'flclash',
        'hiddify-app': 'hiddify',
        'NekoBoxForAndroid': 'nekobox',
        'V2rayU': 'v2rayu'
    },
    // iOS应用商店链接配置
    iosAppStoreLinks: {
        'shadowrocket': 'https://apps.apple.com/us/app/shadowrocket/id932747118',
        'quantumultx': 'https://apps.apple.com/us/app/quantumult-x/id1443988620',
        'surge5': 'https://apps.apple.com/us/app/surge-5/id1442620678',
        'oneclick': 'https://apps.apple.com/us/app/oneclick-safe-easy-fast/id1545555197',
        'v2box': 'https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690',
        'singbox': 'https://apps.apple.com/us/app/sing-box-vt/id6673731168',
        'hiddify': 'https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532',
        'streisand': 'https://apps.apple.com/us/app/streisand/id6450534064',
        'npvtunnel': 'https://apps.apple.com/us/app/npv-tunnel/id1629465476'
    },
    // 平台特定的文件匹配模式 - 扩展更多关键词和扩展名
    platformPatterns: {
        windows: /\.exe$|\.msi$|windows-amd64|\.zip$|\.msix$|\.appx$|windows|win|win32|win64|win-|win\.|x64-win|x86-win|amd64-windows|installer|setup|portable|release-win/i,
        mac: /\.dmg$|\.pkg$|\.app$|\.zip$|macos|mac|darwin|osx|apple|darwin-amd64|darwin-arm64/i,
        linux: /\.deb$|\.rpm$|\.AppImage$|\.tar\.gz$|\.snap$|linux|ubuntu|debian|fedora|arch|x11/i,
        android: /\universal|.apk$|android|arm64-v8a|armeabi|mobile/i,
        ios: /\.ipa$|ios|iphone|ipad|apple/i
    },
    // 平台排序顺序
    platformOrder: ['windows', 'mac', 'linux', 'android', 'ios', 'github'],
    // 文件类型优先级 - 新增配置
    fileTypePriority: {
        windows: ['.exe', '.msi', '.msix', '.appx', '.zip'],
        mac: ['.dmg', '.pkg', '.app', '.zip'],
        linux: ['.AppImage', '.deb', '.rpm', '.snap', '.tar.gz'],
        android: ['.apk'],
        ios: ['.ipa']
    },
    // 平台冲突词 - 新增配置
    platformConflicts: {
        windows: ['linux', 'macos', 'mac', 'darwin', 'android', 'ios', 'iphone', 'ipad'],
        mac: ['windows', 'win', 'linux', 'android'],
        linux: ['windows', 'win', 'macos', 'mac', 'darwin', 'android', 'ios'],
        android: ['windows', 'win', 'macos', 'mac', 'darwin', 'linux', 'ios', 'iphone', 'ipad'],
        ios: ['windows', 'win', 'linux', 'android']
    },
    // 架构优先级 - 新增配置
    architecturePriority: {
        windows: ['x64', 'amd64', 'x86_64', 'win64', '64bit', 'arm64', 'x86', 'win32', '32bit'],
        mac: ['universal', 'arm64', 'apple-silicon', 'm1', 'm2', 'silicon', 'x64', 'amd64', 'intel'],
        linux: ['amd64', 'x86_64', 'x64', 'arm64', 'aarch64'],
        android: ['arm64-v8a', 'arm64', 'armv8', 'universal', 'armeabi-v7a', 'x86_64', 'x86'],
        ios: ['arm64', 'universal']
    },
    // 过滤的文件类型 - 新增配置（除了校验文件外，还包括文档、图片等）
    excludedFileTypes: [
        '.sha256', '.md5', '.asc', '.sig',
        '.txt', '.md', '.log', '.json', '.yml', '.yaml',
        '.png', '.jpg', '.jpeg', '.gif', '.svg',
        'readme', 'changelog', 'license', 'note'
    ],
    // 稳定版关键词 - 新增配置
    stableKeywords: ['stable', 'release', 'official', 'production'],
    // 非稳定版关键词 - 新增配置  
    unstableKeywords: ['beta', 'alpha', 'nightly', 'dev', 'preview', 'test', 'rc', 'snapshot'],
    // 仓库特殊平台映射 - 新增配置
    // 为特定仓库指定平台文件的识别规则，覆盖默认规则
    repoSpecificMappings: {
        "GUI.for.SingBox": {
            "windows": /windows.*\.zip$/i,
            "mac": /macos.*\.zip$/i,
            "linux": /linux.*\.zip$/i
        },
        "v2rayN": {
            "windows": /windows.*desktop\.zip$|windows-64-desktop\.zip$|windows-64\.zip$/i
        }
    },
};

// 创建axios实例
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false // 禁用SSL证书验证
    }),
    timeout: 10000, // 设置超时时间为10秒
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'ToolStore-Update-Script'
        // GitHub Token可以在这里添加:
        // 'Authorization': 'token ghp_xxxxxxxxxxxxxxxxxxxx'
    }
});

// 从环境变量或配置文件读取GitHub Token
if (process.env.GITHUB_TOKEN) {
    axiosInstance.defaults.headers.common['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    console.log('使用环境变量中的GitHub Token进行API请求认证');
} else if (config.githubToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `token ${config.githubToken}`;
    console.log('使用配置文件中的GitHub Token进行API请求认证');
}

// 从拆分后的数据文件中读取仓库信息
async function getRepositories() {
    const repos = [];
    
    // 读取三个数据文件
    const dataFiles = [
        'tools-data.js',
        'software-data.js',
        'airports-data.js'
    ];
    
    for (const dataFile of dataFiles) {
        const filePath = path.join(__dirname, `../public/assets/scripts/configs/${dataFile}`);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 使用正则表达式提取GitHub仓库链接
            // 匹配 link: "https://github.com/owner/repo/releases" 格式
            const repoRegex = /link:\s*["']https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/releases["']/g;
            let match;
            
            while ((match = repoRegex.exec(content)) !== null) {
                const [_, owner, repo] = match;
                const repoName = repo.toLowerCase();
                
                if (!CONFIG.excludeRepos.includes(repoName)) {
                    // 使用映射的名称，如果没有映射则使用原始名称
                    const mappedName = CONFIG.repoNameMapping[repo] || repoName;
                    repos.push({
                        owner,
                        repo,
                        name: mappedName.toLowerCase()
                    });
                }
            }
        } catch (err) {
            console.warn(`读取文件 ${dataFile} 失败:`, err.message);
        }
    }
    
    return repos;
}

// 获取仓库的最新发布版本
async function getLatestRelease(owner, repo, retryCount = 0) {
    try {
        // 获取最新的release
        const response = await axiosInstance.get(
            `https://api.github.com/repos/${owner}/${repo}/releases/latest`
        );

        if (!response.data) {
            console.error(`未找到 ${owner}/${repo} 的发布版本`);
            return null;
        }

        console.log(`成功获取 ${owner}/${repo} 的最新版本: ${response.data.tag_name}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            // 处理速率限制错误
            if (error.response.status === 403 && error.response.data &&
                error.response.data.message && error.response.data.message.includes('rate limit')) {

                // 最多重试3次
                if (retryCount < 3) {
                    const waitTime = Math.pow(2, retryCount) * 1000; // 指数退避
                    console.log(`遇到API速率限制，等待${waitTime / 1000}秒后重试(${retryCount + 1}/3)...`);

                    // 等待一段时间后重试
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return getLatestRelease(owner, repo, retryCount + 1);
                }
            }

            console.error(`获取 ${owner}/${repo} 的最新版本失败:`, error.response.status, error.response.data.message);
        } else if (error.code === 'ECONNABORTED') {
            console.error(`获取 ${owner}/${repo} 的最新版本超时`);
        } else {
            console.error(`获取 ${owner}/${repo} 的最新版本失败:`, error.message);
        }
        return null;
    }
}

// 根据平台匹配下载链接 - 完全重写的高级匹配算法
function matchPlatformAssets(assets, repoName = null) {
    const platformLinks = {};
    const platformScores = {};
    const debugInfo = {};  // 存储调试信息

    // 检查是否有特殊映射规则
    const hasSpecialMapping = repoName && CONFIG.repoSpecificMappings[repoName];

    // 第一步：过滤掉不需要的文件类型
    const filteredAssets = assets.filter(asset => {
        const name = asset.name.toLowerCase();
        return !CONFIG.excludedFileTypes.some(type => name.includes(type) || name.endsWith(type));
    });

    // 如果过滤后没有资源，直接返回空对象
    if (filteredAssets.length === 0) {
        console.warn('警告: 所有资源文件都被过滤掉了');
        return {};
    }

    // 第二步：为每个平台创建候选资源列表
    const platformCandidates = {};

    for (const platform of CONFIG.platformOrder.filter(p => p !== 'github')) {
        platformCandidates[platform] = [];
    }

    // 第三步：初步分类和打分
    for (const asset of filteredAssets) {
        const assetName = asset.name.toLowerCase();
        const assetUrl = asset.browser_download_url.toLowerCase();

        for (const platform of Object.keys(platformCandidates)) {
            // 使用特殊映射规则或默认规则
            let pattern = CONFIG.platformPatterns[platform];
            if (hasSpecialMapping && CONFIG.repoSpecificMappings[repoName][platform]) {
                pattern = CONFIG.repoSpecificMappings[repoName][platform];
            }

            // 检查资源是否匹配平台模式
            if (pattern.test(assetName) || pattern.test(assetUrl)) {
                // 检查跨平台冲突
                const conflicts = CONFIG.platformConflicts[platform] || [];
                const hasConflict = conflicts.some(conflict =>
                    assetName.includes(conflict) || assetUrl.includes(conflict)
                );

                // 如果存在明确的冲突，跳过此平台的匹配
                if (hasConflict) {
                    continue;
                }

                // 初始基础得分
                let score = 10;

                // 计算详细得分
                score = calculateAssetScore(platform, assetName, assetUrl, score);

                // 如果得分为正，将资源添加到该平台的候选列表
                if (score > 0) {
                    platformCandidates[platform].push({
                        asset,
                        score,
                        name: assetName,
                        url: asset.browser_download_url
                    });
                }
            }
        }
    }

    // 第四步：为每个平台选择最佳匹配
    for (const platform of Object.keys(platformCandidates)) {
        const candidates = platformCandidates[platform];

        // 按得分降序排序
        candidates.sort((a, b) => b.score - a.score);

        if (candidates.length > 0) {
            const bestMatch = candidates[0];
            platformLinks[platform] = bestMatch.url;
            platformScores[platform] = bestMatch.score;

            // 记录调试信息
            debugInfo[platform] = {
                selected: bestMatch.name,
                score: bestMatch.score,
                allCandidates: candidates.map(c => ({ name: c.name, score: c.score }))
            };

            console.log(`为 ${platform} 平台选择最佳匹配: ${bestMatch.name} (得分: ${bestMatch.score})`);
        }
    }

    // 第五步：验证结果，确保没有链接重叠
    validatePlatformLinks(platformLinks, platformScores);

    return platformLinks;
}

// 新增：计算资源的详细得分
function calculateAssetScore(platform, assetName, assetUrl, baseScore) {
    let score = baseScore;

    // 1. 平台关键词匹配度
    if (platform === 'windows' && (assetName.includes('windows') || assetName.includes('win'))) {
        score += 50;
        // Windows额外匹配逻辑
        if (/[\._-]win(dows)?[\._-]/i.test(assetName)) score += 5; // 专门为Windows构建的版本
        if (/win(dows)?[\._-](x64|amd64|64|x86)/i.test(assetName)) score += 5; // 包含架构信息的Windows版本
        if (/[\._-](x64|amd64|64|x86)[\._-]win(dows)?/i.test(assetName)) score += 5; // 另一种架构格式
        if (/\.exe$/i.test(assetName)) score += 10; // .exe文件额外加分
        
        // 特别处理windows-64-desktop格式
        if (/windows-64-desktop/i.test(assetName)) score += 20; // v2rayN特定格式大幅加分
        if (/v2ray.*windows/i.test(assetName)) score += 15; // v2ray系列Windows版本
    } else if (platform === 'mac' && (assetName.includes('macos') || assetName.includes('mac') || assetName.includes('darwin'))) {
        score += 50;
    } else if (platform === 'linux' && (assetName.includes('linux') || assetName.includes('ubuntu') || assetName.includes('debian'))) {
        score += 50;
    } else if (platform === 'android' && assetName.includes('android')) {
        score += 50;
    } else if (platform === 'ios' && (assetName.includes('ios') || assetName.includes('iphone') || assetName.includes('ipad'))) {
        score += 50;
    }

    // 2. 文件类型评分 - 使用优先级列表
    const fileExtensions = CONFIG.fileTypePriority[platform] || [];
    for (let i = 0; i < fileExtensions.length; i++) {
        const ext = fileExtensions[i];
        if (assetName.endsWith(ext)) {
            // 优先级越高，得分越高
            score += 30 - (i * 5);
            break;
        }
    }

    // 3. 架构评分 - 使用优先级列表
    const archPatterns = CONFIG.architecturePriority[platform] || [];
    for (let i = 0; i < archPatterns.length; i++) {
        const arch = archPatterns[i];
        const archRegex = new RegExp(`(^|[^a-z])${arch}([^a-z]|$)`, 'i');
        if (archRegex.test(assetName)) {
            // 优先级越高，得分越高
            score += 15 - (i * 1.5);
            break;
        }
    }

    // 4. 稳定版/非稳定版评分
    if (CONFIG.stableKeywords.some(keyword => assetName.includes(keyword))) {
        score += 5;
    }
    if (CONFIG.unstableKeywords.some(keyword => assetName.includes(keyword))) {
        score -= 10;
    }

    // 5. 通用版本/安装版优先
    if (assetName.includes('universal') || assetName.includes('all') || assetName.includes('multi')) {
        score += 8;
    }
    if (assetName.includes('setup') || assetName.includes('install') || assetName.includes('installer')) {
        score += 5;
    }
    if (assetName.includes('portable') || assetName.includes('noinstall')) {
        score -= 3;
    }

    return score;
}

// 新增：验证和修正平台链接
function validatePlatformLinks(platformLinks, platformScores) {
    // 检测平台之间的URL重复和冲突
    const urlToPlatform = {};
    const duplicates = {};

    // 检测重复URL
    for (const [platform, url] of Object.entries(platformLinks)) {
        if (url) {
            if (urlToPlatform[url]) {
                // 发现重复URL
                duplicates[url] = [...(duplicates[url] || []), platform];
            } else {
                urlToPlatform[url] = platform;
            }
        }
    }

    // 解决重复URL问题
    for (const [url, platforms] of Object.entries(duplicates)) {
        console.warn(`发现重复URL: ${url} 在以下平台: ${platforms.join(', ')}`);

        // 只保留得分最高的平台
        let bestPlatform = platforms[0];
        let bestScore = platformScores[platforms[0]] || 0;

        for (let i = 1; i < platforms.length; i++) {
            const platform = platforms[i];
            const score = platformScores[platform] || 0;

            if (score > bestScore) {
                // 移除之前最佳的平台
                delete platformLinks[bestPlatform];

                // 更新最佳平台
                bestPlatform = platform;
                bestScore = score;
            } else {
                // 移除当前平台
                delete platformLinks[platform];
            }
        }

        console.log(`保留 ${bestPlatform} 平台的链接 (得分: ${bestScore})`);
    }

    // 移除可能指向错误资源的链接
    for (const [platform, url] of Object.entries({ ...platformLinks })) {
        const urlLower = url.toLowerCase();

        // 跳过特定仓库的冲突检测 - 新增特例处理
        if (urlLower.includes('gui.for.singbox') || urlLower.includes('gui-for-cores')) {
            console.log(`跳过对 ${platform} 平台的冲突检测: ${url} (GUI.for.SingBox特例)`);
            continue;
        }

        // 对Windows平台做特殊处理，允许更宽松的匹配
        if (platform === 'windows') {
            // 对于Windows平台链接，只有当明确包含linux或macOS关键词时才排除
            if (/\b(linux|ubuntu|debian|fedora|arch)\b/i.test(urlLower) ||
                /\b(macos|darwin|osx)\b/i.test(urlLower)) {
                console.warn(`警告: Windows平台的链接可能指向其他平台: ${url}`);
                delete platformLinks[platform];
            }
            continue; // 跳过其他检查
        }

        // 检查链接是否指向不匹配的平台文件
        for (const [otherPlatform, pattern] of Object.entries(CONFIG.platformPatterns)) {
            if (otherPlatform !== platform && pattern.test(urlLower)) {
                // 如果URL包含其他平台的明确标识，且不是可能的通用名称
                if (!urlLower.includes('universal') && !urlLower.includes('all') &&
                    !urlLower.includes('multi') && !urlLower.includes('generic')) {
                    console.warn(`警告: ${platform} 平台的链接可能实际是 ${otherPlatform} 平台的文件: ${url}`);
                    delete platformLinks[platform];
                    break;
                }
            }
        }
    }
}

// 按照指定顺序排序对象属性
function sortObjectByOrder(obj, order) {
    const sortedObj = {};
    // 首先添加version字段
    if (obj.hasOwnProperty('version')) {
        sortedObj.version = obj.version;
    }
    // 然后按照指定顺序添加其他字段
    order.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            sortedObj[key] = obj[key];
        }
    });
    return sortedObj;
}

// 更新下载配置
async function updateDownloadConfig() {
    try {
        console.log('开始更新下载配置...');

        const configPath = path.join(__dirname, '../public/assets/scripts/configs/download-config.js');

        const repos = await getRepositories();
        console.log(`找到 ${repos.length} 个仓库需要更新`);

        const downloadLinks = {};

        // 获取所有自动下载链接
        const autoDownloadLinks = {};

        // 处理GitHub仓库自动获取链接
        for (const repo of repos) {
            console.log(`正在处理 ${repo.owner}/${repo.repo}...`);
            const release = await getLatestRelease(repo.owner, repo.repo);
            if (!release) continue;

            const platformLinks = matchPlatformAssets(release.assets, repo.repo);

            // 验证链接有效性
            if (Object.keys(platformLinks).length > 0) {
                const links = {
                    version: formatVersion(release.tag_name),
                    ...platformLinks,
                    github: `https://github.com/${repo.owner}/${repo.repo}`
                };
                autoDownloadLinks[repo.name] = sortObjectByOrder(links, CONFIG.platformOrder);
                console.log(`已获取 ${repo.name} 的自动下载链接，版本: ${release.tag_name}`);
            } else {
                console.error(`${repo.name} 没有获取到有效的下载链接，将跳过`);
            }
        }

        // 改进的合并逻辑：添加手动配置的下载链接，与自动获取的链接智能合并
        for (const [name, config] of Object.entries(manualConfig.downloadLinks)) {
            // 检查是否保留自动获取的链接（默认为false）
            const keepAutoLinks = config.keepAutoLinks === true;

            if (autoDownloadLinks[name] && keepAutoLinks) {
                // 如果同时存在自动和手动配置，执行智能合并
                const mergedLinks = { ...autoDownloadLinks[name] };

                // 对每个平台分别处理
                for (const platform of [...CONFIG.platformOrder, 'version']) {
                    // 如果手动配置了此平台
                    if (platform in config) {
                        const manualValue = config[platform];

                        // 1. 如果手动值是空字符串，保留自动获取的值
                        if (manualValue === '') {
                            // 保持自动获取的值不变
                            console.log(`${name}.${platform}: 使用自动获取的值`);
                        }
                        // 2. 如果手动值是非空的，使用手动值
                        else if (manualValue) {
                            mergedLinks[platform] = manualValue;
                            console.log(`${name}.${platform}: 使用手动配置的值`);
                        }
                        // 3. 如果手动值是null/undefined，且没有自动值，不添加此平台
                        else if (manualValue === null) {
                            delete mergedLinks[platform];
                            console.log(`${name}.${platform}: 手动禁用，已移除`);
                        }
                    }
                    // 如果没有手动配置此平台，保留自动获取的值
                }

                downloadLinks[name] = mergedLinks;
                console.log(`已智能合并 ${name} 的自动和手动配置下载链接`);
            } else if (autoDownloadLinks[name] && !keepAutoLinks) {
                // 如果不保留自动链接，只使用手动配置的链接
                const manualLinks = { ...config };
                delete manualLinks.keepAutoLinks;  // 移除特殊属性

                // 但要保留版本号
                if (!manualLinks.version && autoDownloadLinks[name].version) {
                    manualLinks.version = autoDownloadLinks[name].version;
                }

                // 确保至少有github链接
                if (!manualLinks.github && autoDownloadLinks[name].github) {
                    manualLinks.github = autoDownloadLinks[name].github;
                }

                downloadLinks[name] = sortObjectByOrder(manualLinks, CONFIG.platformOrder);
                console.log(`已使用手动配置替换 ${name} 的下载链接`);
            } else if (!autoDownloadLinks[name]) {
                // 如果只有手动配置，直接使用
                const manualLinks = { ...config };
                delete manualLinks.keepAutoLinks;  // 移除特殊属性

                downloadLinks[name] = sortObjectByOrder(manualLinks, CONFIG.platformOrder);
                console.log(`已添加 ${name} 的手动配置下载链接`);
            }
        }

        // 添加自动获取的但没有手动配置的链接
        for (const [name, links] of Object.entries(autoDownloadLinks)) {
            if (!downloadLinks[name]) {
                downloadLinks[name] = links;
                console.log(`已添加 ${name} 的自动获取下载链接`);
            }
        }

        // 然后添加iOS应用商店链接，与现有链接合并
        for (const [appName, appStoreLink] of Object.entries(CONFIG.iosAppStoreLinks)) {
            if (downloadLinks[appName]) {
                // 如果已有该应用的配置，则添加iOS链接
                if (!downloadLinks[appName].ios) {
                    downloadLinks[appName].ios = appStoreLink;
                    console.log(`已为 ${appName} 添加iOS应用商店链接`);
                }
            } else {
                // 如果还没有该应用的配置
                const links = {
                    version: 'N/A',
                    ios: appStoreLink
                };
                downloadLinks[appName] = sortObjectByOrder(links, CONFIG.platformOrder);
                console.log(`已添加 ${appName} 的iOS应用商店链接`);
            }
        }

        // 最后检查结果，确保每个工具至少有一个有效的下载链接
        for (const [name, links] of Object.entries(downloadLinks)) {
            let hasValidLink = false;
            for (const platform of CONFIG.platformOrder) {
                if (links[platform] && typeof links[platform] === 'string' && links[platform].startsWith('http')) {
                    hasValidLink = true;
                    break;
                }
            }

            if (!hasValidLink) {
                console.warn(`警告: ${name} 没有有效的下载链接，可能需要手动配置`);
            }
        }

        // 生成新的配置文件内容
        const configContent = `// 下载链接配置  全是小写
// 最后更新时间: ${new Date().toLocaleString()}

const downloadLinks = ${JSON.stringify(downloadLinks, null, 4)};

// 获取工具版本号
export function getToolVersion(toolName) {
    if (!toolName) return '';

    // 标准化名称：转小写并移除多余空格
    const normalizedName = toolName.toLowerCase().trim();

    // 直接检查是否存在匹配
    if (downloadLinks[normalizedName] && downloadLinks[normalizedName].version) {
        return downloadLinks[normalizedName].version;
    }

    // 如果找不到完全匹配，尝试部分匹配
    for (const key in downloadLinks) {
        // 检查工具名称是否包含在配置键中，或配置键是否包含在工具名称中
        if ((normalizedName.includes(key) || key.includes(normalizedName)) &&
            downloadLinks[key].version) {
            return downloadLinks[key].version;
        }
    }

    // 如果找不到任何匹配，返回空字符串
    return '';
}

// 导出配置
export { downloadLinks };`;

        // 写入配置文件
        fs.writeFileSync(configPath, configContent);
        console.log('下载配置已更新！');
    } catch (error) {
        console.error('更新下载配置失败:', error);
    }
}

// 执行更新
updateDownloadConfig(); 