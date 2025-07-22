// 下载链接配置  全是小写
// 最后更新时间: 7/22/2025, 3:41:25 AM

const downloadLinks = {
    "v2box": {
        "version": "N/A",
        "android": "https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box",
        "ios": "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690"
    },
    "hiddify": {
        "version": "v2.0.5",
        "windows": "https://github.com/hiddify/hiddify-app/releases/download/v2.0.5/Hiddify-Windows-Setup-x64.exe",
        "mac": "https://github.com/hiddify/hiddify-app/releases/download/v2.0.5/Hiddify-MacOS-Installer.pkg",
        "linux": "https://github.com/hiddify/hiddify-app/releases/download/v2.0.5/Hiddify-Debian-x64.deb",
        "android": "https://github.com/hiddify/hiddify-app/releases/download/v2.0.5/Hiddify-Android-universal.apk",
        "ios": "https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532",
        "github": "https://github.com/hiddify/hiddify-app"
    },
    "gui.for.singbox": {},
    "nekobox": {
        "version": "v1.3.9",
        "android": "https://github.com/MatsuriDayo/NekoBoxForAndroid/releases/download/1.3.9/NekoBox-1.3.9-arm64-v8a.apk",
        "github": "https://github.com/MatsuriDayo/NekoBoxForAndroid"
    },
    "v2rayn": {
        "windows": ""
    },
    "flclash": {
        "version": "v0.8.86",
        "windows": "https://github.com/chen08209/FlClash/releases/download/v0.8.86/FlClash-0.8.86-windows-amd64-setup.exe",
        "mac": "https://github.com/chen08209/FlClash/releases/download/v0.8.86/FlClash-0.8.86-macos-arm64.dmg",
        "linux": "https://github.com/chen08209/FlClash/releases/download/v0.8.86/FlClash-0.8.86-linux-amd64.deb",
        "android": "https://github.com/chen08209/FlClash/releases/download/v0.8.86/FlClash-0.8.86-android-arm64-v8a.apk",
        "github": "https://github.com/chen08209/FlClash"
    },
    "v2rayu": {
        "version": "v4.2.6",
        "mac": "https://github.com/yanue/V2rayU/releases/download/v4.2.6/V2rayU-arm64.dmg",
        "github": "https://github.com/yanue/V2rayU"
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