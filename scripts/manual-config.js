// 手动配置的仓库和下载链接
const manualConfig = {
    // 手动配置的仓库信息
    repositories: {
        // 示例格式：
        // "app-name": {
        //   owner: "owner-name",   // 仓库所有者
        //   repo: "repo-name",     // 仓库名称
        //   name: "display-name",  // 显示名称
        //   version: "vX.Y.Z",     // 版本号（可选）
        //   links: {               // 平台链接（可选）
        //     windows: "https://...",
        //     mac: "https://...",
        //     linux: "https://...",
        //     android: "https://...",
        //     ios: "https://..."
        //   },
        //   forceManual: false     // 是否强制使用手动配置（不获取自动链接）
        // }
        "v2box": {
            "owner": "v2box",
            "repo": "v2box",
            "name": "v2box",
            "version": "N/A",
            "links": {
                "version": "N/A",
                "android": "https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box",
                "ios": "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690",
            },
            "forceManual": true
        },
        "hiddify": {
            "owner": "hiddify",
            "repo": "hiddify",
            "name": "hiddify",
            "links": {
                "ios": "https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
            },
            "forceManual": false
        }
    },

    // 手动配置的下载链接
    downloadLinks: {
        // 示例格式：
        // "app-name": {
        //   version: "vX.Y.Z",     // 手动指定版本号
        //   windows: "https://...", // Windows下载链接
        //   mac: "https://...",     // macOS下载链接
        //   linux: "https://...",   // Linux下载链接
        //   android: "https://...", // Android下载链接
        //   ios: "https://...",     // iOS下载链接
        //   keepAutoLinks: true     // 是否保留自动获取的其他平台链接
        // }
        "v2box": {
            "version": "N/A",
            "android": "https://play.google.com/store/apps/details?id=dev.hexasoftware.v2box",
            "ios": "https://apps.apple.com/us/app/v2box-v2ray-client/id6446814690",
            "keepAutoLinks": false   // 不使用自动获取的链接
        },
        "hiddify": {
            "ios": "https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532",
            "keepAutoLinks": true    // 保留自动获取的其他平台链接
        },
        // 示例：只覆盖特定平台链接，保留其他自动获取的链接
        "gui.for.singbox": {
            // "mac": "",  // 空字符串表示使用自动获取的链接
            "keepAutoLinks": true
        },
        // 示例：完全禁用特定平台链接
        "nekobox": {
            // "windows": null,  // null表示禁用此平台链接
            // "mac": null,
            // "linux": null,
            "keepAutoLinks": true  // 保留android平台的自动链接
        },
        // 为v2rayN添加手动配置
        "v2rayn": {
            "windows": "",  // 空字符串表示使用自动获取的链接
            "keepAutoLinks": true  // 保留自动获取的其他平台链接 
        }
    },
    
    // 版本号覆盖 - 新增配置
    // 可以为特定工具手动指定版本号，而不影响下载链接
    versionOverrides: {
        // "app-name": "vX.Y.Z"
        // "v2rayu": "v4.2.5-stable"
    },
    
    // 平台替换规则 - 新增配置
    // 定义跨平台替代关系，当某平台没有链接时，可以使用另一平台的链接
    platformFallbacks: {
        // 示例：如果Windows平台没有链接，尝试使用Linux平台的链接
        // "windows": ["linux", "mac"],
        // "mac": ["linux", "windows"]
    }
};

module.exports = manualConfig; 