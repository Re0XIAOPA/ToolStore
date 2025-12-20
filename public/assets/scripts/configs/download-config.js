// 下载链接配置  全是小写
<<<<<<< Updated upstream
// 最后更新时间: 12/20/2025, 3:19:55 AM
=======
// 最后更新时间: 12/20/2025, 11:47:46 AM
>>>>>>> Stashed changes

const downloadLinks = {
    "v2box": {
        "version": "N/A",
        "android": "https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box",
        "ios": "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690"
    },
    "hiddify": {
        "ios": "https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
    },
    "gui.for.singbox": {
        "version": "v1.16.0",
        "windows": "https://github.com/GUI-for-Cores/GUI.for.SingBox/releases/download/v1.16.0/GUI.for.SingBox-windows-amd64.zip",
        "linux": "https://github.com/GUI-for-Cores/GUI.for.SingBox/releases/download/v1.16.0/GUI.for.SingBox-linux-amd64.zip",
        "github": "https://github.com/GUI-for-Cores/GUI.for.SingBox"
    },
    "nekobox": {},
    "v2rayn": {
        "version": "v7.16.6",
        "windows": "https://github.com/2dust/v2rayN/releases/download/7.16.6/v2rayN-windows-64-desktop.zip",
        "mac": "https://github.com/2dust/v2rayN/releases/download/7.16.6/v2rayN-macos-arm64.dmg",
        "linux": "https://github.com/2dust/v2rayN/releases/download/7.16.6/v2rayN-linux-arm64.deb",
        "github": "https://github.com/2dust/v2rayN"
    },
    "clash verge": {
        "version": "v2.4.4",
        "windows": "https://github.com/clash-verge-rev/clash-verge-rev/releases/download/v2.4.4/Clash.Verge_2.4.4_x64-setup.exe",
        "mac": "https://github.com/clash-verge-rev/clash-verge-rev/releases/download/v2.4.4/Clash.Verge_2.4.4_x64.dmg",
        "linux": "https://github.com/clash-verge-rev/clash-verge-rev/releases/download/v2.4.4/Clash.Verge_2.4.4_amd64.deb",
        "github": "https://github.com/clash-verge-rev/clash-verge-rev"
    },
    "mihomo party": {
        "version": "v1.8.9",
        "windows": "https://github.com/mihomo-party-org/clash-party/releases/download/v1.8.9/clash-party-windows-1.8.9-x64-setup.exe",
        "mac": "https://github.com/mihomo-party-org/clash-party/releases/download/v1.8.9/clash-party-macos-1.8.9-arm64.pkg",
        "linux": "https://github.com/mihomo-party-org/clash-party/releases/download/v1.8.9/clash-party-linux-1.8.9-amd64.deb",
        "github": "https://github.com/mihomo-party-org/mihomo-party"
    },
    "clashmeta": {
        "version": "v2.11.20",
        "android": "https://github.com/MetaCubeX/ClashMetaForAndroid/releases/download/v2.11.20/cmfa-2.11.20-meta-universal-release.apk",
        "github": "https://github.com/MetaCubeX/ClashMetaForAndroid"
    },
    "surfboard": {
        "version": "v2.25.3",
        "android": "https://github.com/getsurfboard/surfboard/releases/download/mobile-2.25.3/mobile-universal-release.apk",
        "github": "https://github.com/getsurfboard/surfboard"
    },
    "v2rayng": {
        "version": "v1.10.31",
        "android": "https://github.com/2dust/v2rayNG/releases/download/1.10.31/v2rayNG_1.10.31_universal.apk",
        "github": "https://github.com/2dust/v2rayNG"
    },
    "singbox": {
        "version": "v1.12.13",
        "windows": "https://github.com/SagerNet/sing-box/releases/download/v1.12.13/sing-box-1.12.13-windows-amd64-legacy-windows-7.zip",
        "linux": "https://github.com/SagerNet/sing-box/releases/download/v1.12.13/sing-box_1.12.13_linux_amd64.deb",
        "github": "https://github.com/SagerNet/sing-box",
        "ios": "https://apps.apple.com/us/app/sing-box-vt/id6673731168"
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