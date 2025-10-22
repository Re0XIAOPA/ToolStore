// 下载链接配置  全是小写
// 最后更新时间: 10/22/2025, 3:16:10 AM

const downloadLinks = {
    "v2box": {
        "version": "N/A",
        "android": "https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box",
        "ios": "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690"
    },
    "hiddify": {
        "ios": "https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
    },
    "gui.for.singbox": {},
    "nekobox": {},
    "v2rayn": {
        "windows": ""
    },
    "shadowrocket": {
        "version": "N/A",
        "ios": "https://apps.apple.com/us/app/shadowrocket/id932747118"
    },
    "quantumultx": {
        "version": "N/A",
        "ios": "https://apps.apple.com/us/app/quantumult-x/id1443988620"
    },
    "surge5": {
        "version": "N/A",
        "ios": "https://apps.apple.com/us/app/surge-5/id1442620678"
    },
    "oneclick": {
        "version": "N/A",
        "ios": "https://apps.apple.com/us/app/oneclick-safe-easy-fast/id1545555197"
    },
    "singbox": {
        "version": "N/A",
        "ios": "https://apps.apple.com/us/app/sing-box-vt/id6673731168"
    },
    "streisand": {
        "version": "N/A",
        "ios": "https://apps.apple.com/us/app/streisand/id6450534064"
    },
    "npvtunnel": {
        "version": "N/A",
        "ios": "https://apps.apple.com/us/app/npv-tunnel/id1629465476"
    }
};

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
export { downloadLinks };