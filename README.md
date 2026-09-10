<div align="center">
  <h3>简介</h3>
  <p>一个简洁的代理工具导航网站，提供各类工具、软件和机场服务的下载链接与介绍。</p>
</div>

## 项目结构

```
ToolStore/
├── docs/                                   # Docusaurus 文档系统 📚
│   ├── blog/                              # 博客文章
│   ├── docs/                              # 文档内容
│   ├── src/                               # 自定义组件和页面
│   └── docusaurus.config.ts              # 文档配置
├── public/
│   ├── newDocs/                           # 构建后的文档静态文件 🚀
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css                    # 全局样式
│   │   ├── images/
│   │   │   ├── airports/                    # 机场卡片图标
│   │   │   ├── airports-imgs/               # 机场详情弹窗图片
│   │   │   └── default/                     # 默认占位符
│   │   └── scripts/
│   │       ├── modules/
│   │       │   ├── card-renderer.js         # 卡片渲染核心逻辑
│   │       │   ├── airport-modal.js         # 机场详情弹窗
│   │       │   ├── download-modal.js        # 工具下载弹窗
│   │       │   ├── recommend.js             # 推荐系统
│   │       │   ├── api.js                   # API 接口
│   │       │   └── platform-icons.js        # 平台图标
│   │       └── configs/
│   │           ├── airport-config.js        # 机场配置聚合文件 ⭐
│   │           ├── airports/
│   │           │   ├── paid-airports.js     # 付费机场配置 ⭐
│   │           │   ├── free-airports.js     # 免费机场配置 ⭐
│   │           │   └── other-airports.js    # 其他机场配置 ⭐
│   │           ├── airports-data.js         # 机场数据聚合导出
│   │           ├── card-data.js             # 卡片数据聚合
│   │           ├── tools-data.js            # 工具数据
│   │           ├── software-data.js         # 软件数据
│   │           ├── links-data.js            # 友链数据
│   │           ├── download-config.js       # 下载链接配置
│   │           ├── recommend-config.js      # 推荐系统配置
│   │           └── sponsor-config.js        # 赞助商配置
│   ├── index.html                           # 主页
│   └── favicon.ico
└── README.md                                # 本文件
```

## 机场配置维护指南

### 新的配置结构

机场配置按以下三维度分类：

```
airports/
├── paid-airports.js       (付费机场)
├── free-airports.js       (免费机场)
└── other-airports.js      (其他机场)

每个分类内部再细分为四个等级：
- firstTier      (一线)
- secondTier     (二线)
- thirdTier      (三线)
- adminPick      (站长自用 - 经站长使用后推荐)
```

### 如何添加新机场

#### 1. **付费机场 - 一线（顶级）**

编辑 `configs/airports/paid-airports.js`：

```javascript
export const paidAirports = {
  firstTier: [
    // ... 现有机场
    {
      name: "新机场名称",
      image: "assets/images/airports/image-name.png",
      category: "paid",
      tier: "first-tier",
      description: "机场描述文本，支持 HTML 标签如 <br>",
      moreContent: {
        images: [
          { url: "assets/images/airports-imgs/img1.png" },
          { url: "assets/images/airports-imgs/img2.png" },
        ],
      },
      link: "https://example.com/register?code=xxx",
      tags: ["稳定", "高速", "性价比"],
    },
  ],
};
```

#### 2. **付费机场 - 二线**

编辑同一文件的 `secondTier` 数组：

```javascript
'secondTier': [
    // ... 现有机场
    {
        name: '经济机场',
        image: 'assets/images/airports/economy.png',
        category: 'paid',
        tier: 'second-tier',
        description: '便宜推荐的备选机场',
        // ... 其他字段
    }
]
```

#### 3. **付费机场 - 三线**

编辑同一文件的 `thirdTier` 数组：

```javascript
'thirdTier': [
    {
        name: '廉价机场',
        image: 'assets/images/airports/cheap.png',
        category: 'paid',
        tier: 'third-tier',
        description: '最便宜的选项',
        // ... 其他字段
    }
]
```

#### 4. **站长自用推荐**

编辑同一文件的 `adminPick` 数组（会自动显示 "站长经使用之后推荐" 的标签）：

```javascript
'adminPick': [
    {
        name: '我用过的最好机场',
        image: 'assets/images/airports/best.png',
        category: 'paid',
        tier: 'admin-pick',
        description: '我经过长期使用，真心推荐的机场',
        // ... 其他字段
    }
]
```

#### 5. **免费或其他分类**

类似地编辑：

- `configs/airports/free-airports.js` - 免费机场
- `configs/airports/other-airports.js` - 其他机场

### 机场对象字段说明

| 字段                 | 类型   | 必需 | 说明                                                                  |
| -------------------- | ------ | ---- | --------------------------------------------------------------------- |
| `name`               | String | ✅   | 机场名称                                                              |
| `image`              | String | ✅   | 卡片图标路径 (`assets/images/airports/`)                              |
| `category`           | String | ✅   | 分类：`'paid'`、`'free'` 或 `'other'`                                 |
| `tier`               | String | ✅   | 等级：`'first-tier'`、`'second-tier'`、`'third-tier'`、`'admin-pick'` |
| `description`        | String | ✅   | 机场描述（支持 HTML 标签）                                            |
| `link`               | String | ✅   | 注册/访问链接                                                         |
| `tags`               | Array  | ✅   | 标签数组 `['稳定', '高速']`                                           |
| `moreContent`        | Object | ❌   | 详情弹窗额外内容                                                      |
| `moreContent.images` | Array  | ❌   | 图片数组 `[{url: '...', alt: '...'}]`                                 |

### 数据流向

```
机场配置文件
    ↓
┌─────────────────────────────────┐
│   paid-airports.js              │
│   free-airports.js              │
│   other-airports.js             │
└─────────────────────────────────┘
    ↓ (导入聚合)
┌─────────────────────────────────┐
│   airport-config.js             │
│   (聚合为 airportConfig 对象)    │
└─────────────────────────────────┘
    ↓ (扁平化导出)
┌─────────────────────────────────┐
│   airports-data.js              │
│   (导出为 airportData 数组)      │
└─────────────────────────────────┘
    ↓ (被使用)
┌─────────────────────────────────┐
│   card-renderer.js              │ (渲染卡片)
│   airport-modal.js              │ (显示详情)
│   recommend.js                  │ (推荐系统)
└─────────────────────────────────┘
```

## 其他数据维护

### 工具数据 (`tools-data.js`)

编辑 `configs/tools-data.js` 添加代理工具：

```javascript
{
    name: '工具名称',
    image: 'assets/images/tools/icon.png',
    link: 'https://download-link'
}
```

### 软件数据 (`software-data.js`)

编辑 `configs/software-data.js` 添加推荐软件：

```javascript
{
    name: '软件名称',
    image: 'assets/images/software/icon.png',
    link: 'https://website'
}
```

### 友链数据 (`links-data.js`)

编辑 `configs/links-data.js` 添加友情链接：

```javascript
{
    name: '网站名称',
    image: 'assets/images/links/icon.png',
    link: 'https://friend-website.com'
}
```

### 下载链接配置 (`download-config.js`)

管理工具的多平台下载链接。

## 机场在线状态检测

每张机场卡片右上角会显示一个状态徽章，标明该机场官网当前是否可访问。

### 状态含义

| 徽章 | 含义 | 判定依据 |
| --- | --- | --- |
| 在线（绿色脉冲） | 站点可访问 | 服务端拿到任意 HTTP 响应（含 403/404 等，说明服务器活着，可能只是限制了自动访问） |
| 异常（橙色） | 站点有响应但返回错误 | HTTP 5xx |
| 离线（红色） | 站点无法访问 | DNS 解析失败 / 连接超时 / 连接被拒绝 |
| 检测中（灰色闪烁） | 正在探测 | 首次渲染或重新检测 |

离线卡片会自动置灰并降低透明度，鼠标悬停时恢复，点击仍可查看详情；详情弹窗顶部会额外显示一条红色警示条。

### 数据来源

采用**服务端定时探测 + 浏览器本地校准**两级方案：

1. **服务端（首屏）**：`.github/workflows/check-airports.yml` 每 6 小时运行 `npm run check-airports`，用 Node 真实请求每个机场的根域名，把状态码、响应耗时写入 `public/assets/data/airport-status.json`。页面加载后先读它，徽章立刻就有结果，不用等。
2. **浏览器（校准）**：GitHub Actions 的机器在境外，网络环境和国内访客不一致。所以首屏渲染完、页面空闲时，`public/assets/scripts/modules/uptime-checker.js` 会用**访客自己的网络**再测一遍（`fetch(no-cors)`，只能判断能否连通，拿不到状态码），并用本地结果覆盖徽章。

两边结论不一致时，徽章以**访客本地网络为准**（毕竟能不能打开只有访客说了算），同时把差异写进悬浮提示：

- 服务端在线、本地连不上 → `你的网络连不上（境外服务端检测为在线）`
- 服务端离线、本地能打开 → `你的网络可以打开（境外服务端检测为离线）`

分区标题下会显示本次校准的差异数量。想关掉本地校准，把 `uptime-checker.js` 里的 `ENABLE_LOCAL_CALIBRATION` 改成 `false`。

### 手动运行

```bash
npm run check-airports
```

脚本会打印每个机场的判定结果、HTTP 状态码与响应耗时，并覆盖写入 `public/assets/data/airport-status.json`。

### 请求量有多小

| 项目 | 取值 |
| --- | --- |
| 检测频率 | 每 12 小时一轮，每天 2 轮 |
| 并发数 | 服务端 2，浏览器 3 |
| 站点间隔 | 服务端固定 1.5 秒，浏览器 0.2 秒 |
| 单站每轮请求 | 最多 2 个（robots.txt + HTTP） |

单个站点每天最多被请求约 6 次，且摊开在不同时刻、只打根路径 —— 这是正常的可达性监控量级，不是压测，不会触发对方的 CC 防护。

### 采取了哪些克制措施

- **亮明身份**：`Mozilla/5.0 (compatible; ToolStore-UptimeBot/1.0; +https://github.com/Re0XIAOPA/ToolStore)`。保留浏览器标识是为了不被 WAF 直接挡掉（那会造成大量误判），同时用 `compatible` 段说明是谁在访问，方便站长联系或封禁。
- **遵守 robots.txt**：站点明确写了 `Disallow: /` 就跳过不测，如实标记为「未检测」而不是硬闯。
- **只探根路径**：只请求 `/` 和 `/robots.txt`，不下抓页面内容、不跟随站内链接。
- **结果缓存**：浏览器端的探测结果缓存 30 分钟，刷新页面或开新标签页都不会重打一遍。
- **防叠加**：工作流加了 `concurrency` 组（同时只允许一个探测任务）和 15 分钟超时，避免多触发源叠加成并发请求，也不会因卡死白白消耗 Actions 额度。

额度方面：一轮实测约 2 分钟，每天 2 轮约合每月 120 分钟。公开仓库的 Actions 本身免费不限量；私有仓库 2000 分钟/月的额度也只占约 6%。

### 已知限制

- 徽章反映的是**访客自己的网络**能否打开官网（本地校准后的结果），不代表机场的节点、订阅服务或线路质量本身正常。
- 服务端那份 JSON 由境外机器探测，仅用于首屏快速显示和历史留档；它和国内访客的实际体验经常对不上，所以会被本地校准覆盖。
- 本地校准会给每个机场站点发一个 HEAD 请求（并发 6、单站超时 6 秒），在页面空闲时执行，不阻塞首屏。结果缓存在浏览器里 **30 分钟**，刷新页面或开新标签页都不会重复探测。站点特别多时可以调小 `CONCURRENCY` 或直接关掉校准。
- 浏览器端用 `no-cors` 探测，只要 fetch 没抛错就说明服务器回应了（405 之类也算），所以只发 HEAD、失败也不再退化成 GET。代价是拿不到状态码，状态码信息来自服务端那份 JSON。
- 探测的是官网根域名能否响应，不代表机场的节点或订阅服务本身正常。
- 部分机场站点本身不稳定，两次探测结果可能不同（实测中就遇到过同一个站一次 403、一次超时）。
- 新增机场后无需手动干预：推送配置会自动触发工作流重新检测。

## 注意事项

1. **优先级**：手动配置 > iOS 应用商店链接 > GitHub 仓库
2. **版本号**：
   - GitHub 仓库：自动获取最新 release 版本
   - 手动配置：可自定义版本号
   - iOS 应用：显示 "N/A"

## GitHub API 配置与自动更新

### 本地开发环境

如果在本地运行 `npm run update-downloads`，GitHub API 对未认证请求有速率限制（每小时 60 次），建议配置 Token 以提高至每小时 5000 次：

```bash
# 方法1: 通过环境变量（推荐）
export GITHUB_TOKEN=你的GitHub Token    # Linux/Mac
set GITHUB_TOKEN=你的GitHub Token      # Windows

# 方法2: 创建 scripts/config.js
# 仅用于本地开发，不要提交到版本库
module.exports = { githubToken: '你的Token' };
```

### GitHub Actions 自动更新（推荐！）

**优势：无需配置，定时自动执行，完全无需担心 Token 泄露**

项目已配置 GitHub Actions，每日凌晨 2 点自动执行更新。工作流已中预配置，优先使用 **PAT_TOKEN**。

#### **配置选项**

| 配置                  | 推荐                | 总结                                           |
| --------------------- | ------------------- | ---------------------------------------------- |
| **加上 PAT_TOKEN**    | ⭐⭐⭐⭐⭐ 速度很快 | 流量 5000/小时，推荐用（来辅 2、不配置也可以） |
| **默认 GITHUB_TOKEN** | ⭐⭐⭐              | 流量上限不需要配置，每次自动提供               |

#### **方案 A：不配置（开箱即用）**

即上即用，不需要任何配置：

- GitHub 自动提供 GITHUB_TOKEN
- 每天执行更新，流量充足
- 适合日常更新

#### **方案 B：添加 PAT_TOKEN（可选，中提高流量）**

如果想有更高的 API 流量限制或本地开发测试，按以下步骤添加 PAT_TOKEN：

**1. 创建个人访问令牌 (PAT)**

- 打开 GitHub > **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
- 点击 **Generate new token (classic)**
- 填写：
  - Note: `ToolStore Auto Update`
  - Expiration: `90 days` 或 `No expiration`
  - Scopes: 仅勾选 `public_repo`
- 领取并复制 Token

**2. 在仓库 Secrets 中添加**

- 打开你的仓库 > **Settings** > **Secrets and variables** > **Actions**
- 点击 **New repository secret**
- 填写：
  - Name: `PAT_TOKEN`
  - Secret: 粘贴你的 Token
- 点击 **Add secret**

**3. 完成！**

- 工作流已配置、会自动检测并优先使用 PAT_TOKEN
- 仅需认证一次，无需修改工作流

#### **开箱流程**

工作流自动处理：

```
每天凌晨 2 点 (UTC)
    ↓
检测 Secrets 中是否有 PAT_TOKEN
    ↓
✅ 有 PAT_TOKEN → 优先使用
❌ 没有 → 自动降级到 GITHUB_TOKEN
    ↓
执行 npm run update-downloads
    ↓
自动提交并部署
```

#### **上传程序配置示例**

工作流文件 `.github/workflows/update-downloads.yml` 已预配置，具体配置：

```yaml
# 验证：优先使用 PAT_TOKEN（如果配置了）
# 验证：没有 PAT_TOKEN → 自动降级到 GITHUB_TOKEN

token: ${{ secrets.PAT_TOKEN || secrets.GITHUB_TOKEN }}
env:
  GITHUB_TOKEN: ${{ secrets.PAT_TOKEN || secrets.GITHUB_TOKEN }}
```

否则不需要修改工作流！

#### **方案对比**

| 数据           | 方案 A          | 方案 B             |
| -------------- | --------------- | ------------------ |
| **配置复杂度** | ✅ 极简         | ❌ 需要投一次      |
| **API 流量**   | ✅ 无需担心     | ✅✅ 至贵 5000/h   |
| **本地开发**   | ❌ 需要自己设置 | ✅ 一个 Token 搞定 |
| **常见应用**   | ✅ 特点         | ✅ 提高流量        |

#### **操作操流**

创建了 PAT_TOKEN 后，你也可以在本地开发中使用：

```bash
# Linux/Mac
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
npm run update-downloads

# Windows
set GITHUB_TOKEN=ghp_xxxxxxxxxxxx
npm run update-downloads
```

#### **故障排除**

| 问题                | 解决方案                                   |
| ------------------- | ------------------------------------------ |
| 常常触发了 API 上限 | 日常更新数据需求清低，不配置 ✅            |
| 需要更高流量        | 添加 PAT_TOKEN，提高到 5000/h ✅           |
| 工作流失败          | 查看 Actions 日志，检查 Token 是否配置正常 |
| 不能推送代码        | 检查 Secrets 中的 Token 是否有效           |

> [!TIP]
> 推荐直接使用默认，无需任何配置。也可选添加 PAT_TOKEN 来提升流量！

## 文档系统

本项目集成了 Docusaurus 文档系统，提供完整的文档和博客功能。

## 许可证

GPL-3.0 License

阅读 [LICENSE](./LICENSE) 文件了解详情。
