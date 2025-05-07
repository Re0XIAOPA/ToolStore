# 🛠️ ToolStore

<div align="center">
  <h3>📖 简介</h3>
  <p>一个简洁的代理工具导航网站，提供各类工具、软件和机场服务的下载链接与介绍。</p>
</div>

## ✨ 特性

- 🚀 自动从 GitHub 获取最新版本和下载链接
- 📱 支持多平台（Windows、macOS、Linux、iOS、Android）
- 🔄 每日自动更新
- 🎨 美观的现代化界面
- 📦 支持手动配置下载链接
- 🌐 自动部署到 GitHub Pages

## 🛠️ 快速开始

### 1. 添加工具

在 `public/assets/scripts/configs/card-data.js` 中添加：

```javascript
{
    name: "工具名称",
    description: "工具描述",
    icon: "图标URL",
    link: "GitHub仓库链接",
    category: "分类"
}
```

### 2. 手动配置

在 `scripts/manual-config.js` 中添加：

```javascript
const manualConfig = {
    downloadLinks: {
        "app-name": {
            windows: "https://example.com/windows-download",
            macos: "https://example.com/macos-download",
            ios: "https://example.com/ios-download",
            android: "https://example.com/android-download"
        }
    }
};
```

### 3. 更新配置

```bash
npm install
npm run update-downloads
```

## 📂 项目结构

```
ToolStore/
├── public/                    # 静态资源目录
│   ├── assets/               # 资源文件
│   │   ├── css/             # 样式文件
│   │   │   ├── style.css    # 主样式
│   │   │   └── ...
│   │   ├── images/          # 图片资源
│   │   │   ├── tools/       # 工具图标
│   │   │   ├── software/    # 软件图标
│   │   │   └── airports/    # 机场图标
│   │   └── scripts/         # 脚本文件
│   │       ├── configs/     # 配置文件
│   │       │   ├── card-data.js        # 卡片数据
│   │       │   ├── download-config.js  # 下载配置
│   │       │   ├── airport-config.js   # 机场配置
│   │       │   └── recommend-config.js # 推荐配置
│   │       └── modules/     # 功能模块
│   │           ├── api.js              # API模拟
│   │           ├── card-renderer.js    # 卡片渲染
│   │           ├── download-modal.js   # 下载弹窗
│   │           ├── airport-modal.js    # 机场详情
│   │           ├── recommend.js        # 推荐系统
│   │           ├── feedback-modal.js   # 反馈表单
│   │           └── back-to-top.js      # 返回顶部
│   ├── index.html           # 主页面
│   └── CNAME               # 自定义域名配置
│
├── scripts/                 # 脚本目录
│   ├── update-downloads.js  # 更新下载链接脚本
│   └── manual-config.js    # 手动配置文件
│
├── .github/                # GitHub配置
│   └── workflows/          # 工作流配置
│       └── deploy.yml      # 部署配置
│
├── package.json            # 项目配置
├── package-lock.json       # 依赖锁定
└── README.md              # 项目说明
```

## 📝 配置说明

### 1. 源文件配置

在 `public/assets/scripts/configs/` 目录下：

- `card-data.js`: 工具卡片数据
  ```javascript
  export const toolsData = [
    {
      name: "工具名称",
      description: "工具描述",
      icon: "图标URL",
      link: "GitHub仓库链接",
      category: "分类"
    }
  ];
  ```

- `download-config.js`: 下载链接配置（自动生成）
  ```javascript
  export const downloadLinks = {
    "工具名称": {
      version: "v1.0.0",
      windows: "下载链接",
      macos: "下载链接",
      ios: "下载链接",
      android: "下载链接"
    }
  };
  ```

### 2. 自动更新配置

在 `scripts/update-downloads.js` 中：

```javascript
const CONFIG = {
  // 需要排除的仓库
  excludeRepos: ['shadowrocket', 'quantumultx'],
  
  // 仓库名称映射
  repoNameMapping: {
    'clash-verge-rev': 'clash verge'
  },
  
  // iOS应用商店链接
  iosAppStoreLinks: {
    'shadowrocket': 'https://apps.apple.com/us/app/shadowrocket/id932747118'
  }
};
```

### 3. 工作流配置

在 `.github/workflows/deploy.yml` 中：

```yaml
name: Update and Deploy
on:
  push:
    branches: [ master ]
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点更新
```

## 📝 注意事项

1. **优先级**：手动配置 > iOS 应用商店链接 > GitHub 仓库
2. **版本号**：
   - GitHub 仓库：自动获取最新 release 版本
   - 手动配置：可自定义版本号
   - iOS 应用：显示 "N/A"

> [!IMPORTANT]
> 本项目仅供学习参考
