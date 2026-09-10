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

### 三种结果

判定刻意区分「站点死了」和「你访问不到」这两件不同的事：

| 徽章 | 含义 | 判定依据 |
| --- | --- | --- |
| 在线（绿色脉冲） | 当前网络可正常访问 | 本地或服务端任一检测点能连通 |
| 异常（橙色） | 站点有响应但返回错误 | HTTP 5xx |
| 无法访问（蓝色） | 当前网络环境连不上，**不代表站点离线** | 本地连不上，但另一个检测点仍能连通（或该站点未检测） |
| 无法探测（灰色虚线） | 受浏览器策略限制，没测成，**既非在线也非离线** | HTTPS 页面无法用脚本请求 HTTP 站点（混合内容），或本机整体无网 |
| 离线（红色） | 站点可能已停止服务 | 各检测点均无法连通 |
| 未检测（灰色） | 暂无数据 | 站点 robots.txt 禁止自动访问，或缺少可用数据 |

「无法访问」与「离线」分开是必要的：很多站点只是需要代理才能打开，本身仍在运行，不该被判定为离线。这类卡片不会置灰，提示文案也会明确说明这一点。「无法探测」则是浏览器压根没把请求发出去，同样不能算离线。

徽章悬浮提示按「结论 · 本地探测结果 · 服务端检测结果 · 检测时间」的格式列出全部依据，**标签与文案始终一致**——不会出现标着「离线」却解释成「站点可能还活着」的情况。详情弹窗顶部会显示同色的状态条。

### 数据来源

采用**构建时探测 + 浏览器本地校准**两级方案：

1. **构建时（首屏）**：`deploy.yml` 在发布前运行 `npm run check-airports`，用 Node 真实请求每个机场的根域名，生成 `public/assets/data/airport-status.json`。页面加载后先读它，徽章立刻就有结果，不用等。
   该产物已在 `.gitignore` 中排除，**不进源码分支**，只随本次构建发布到部署分支 —— 重新构建后自动同步，不需要手工维护部署分支。
2. **浏览器（校准）**：构建环境的网络与访客不同，同一站点两边的连通性经常不一致（实测 18 个站点里有 6 个结论不同）。所以首屏渲染完、页面空闲时，`public/assets/scripts/modules/uptime-checker.js` 会用**访客自己的网络**再测一遍（`fetch(no-cors)`，只能判断能否连通，拿不到状态码）。

两个探测点各有局限：服务端看得到状态码但网络环境不同，本地反映真实体验但拿不到状态码。合起来才能区分上面三种结果。

想关掉本地校准，把 `uptime-checker.js` 里的 `ENABLE_LOCAL_CALIBRATION` 改成 `false`。

### 手动运行

```bash
npm run check-airports
```

脚本会打印每个机场的判定结果、HTTP 状态码与响应耗时，并覆盖写入 `public/assets/data/airport-status.json`。该文件不进版本库；正常情况无需手动执行，构建流程会自动生成，本地预览时手动跑一次即可。

### 代理与网络环境

本地探测用的是浏览器原生请求，这里有一条容易被误解的事实：**浏览器的请求本来就会自动走浏览器/操作系统的代理设置**，网页 JS 既没有开关去绕过代理，也没有能力指定或切换代理。用户开了系统级代理或全局模式 VPN，探测请求会自动跟着走；没开就是直连。所以「检测走不走代理」由浏览器决定，本模块不需要也无法干预。

网页也**读不到**系统代理配置，检测不了 VPN 是否开启 —— Web 平台没有这种 API，只有浏览器扩展才有 `chrome.proxy` 一类的能力。因此本模块不追求「自动识别代理」，而是把误判从根上消除：

1. **本机基线探测**：校准前先用本站静态资源确认本机能否上网。本机没网时所有站点都会被标成「无法探测（本机未联网）」，并提示以服务端结果为准，而不是逐个判成「连不上」。
2. **混合内容单独归类**：本站是 HTTPS，部分机场官网是 HTTP。浏览器禁止 HTTPS 页面用脚本请求 HTTP 站点，这类请求标为「无法探测」并提示手动打开确认，绝不判成离线。
3. **超时 4 秒 + 仅超时重试**：健康站点通常 1 秒内就有响应，4 秒足够；只有超时才隔 1.2 秒重试一次（慢站累计仍有约 9 秒耐心）。DNS 解析失败、连接被拒这类**确定性失败不重试**——隔一秒再来一次基本还是失败，只是白等。
4. **整体不可达提示**：若基线正常、但所有被测站点都连不上，说明多半是本机代理/VPN 没有覆盖浏览器（如 PAC 规则只代理了部分域名，或代理只在别的应用里生效），分区标题会直接给出这个提示。
5. **显式网络环境声明**：网页检测不了代理，只能由用户告知。分区标题右侧有一个「网络环境：自动 / 已用代理 / 直连」的切换，选择后会重新校准并按该环境调整提示文案。

校准过程是**逐站刷新**的：每测完一个站点就立刻更新它的徽章，分区标题同步显示「正在校准 x/y」进度，而不是等全部跑完再一次性刷新。这样做不会减少请求量，但前几秒就能看到结果，体感差别很大。另外，`robots.txt` 只约束爬虫，本地探测是访客自己浏览器发起的一次请求，因此**服务端 bot 会遵守 robots.txt 跳过不测，而浏览器端仍会照常探测**，让用户能看到真实状态。

如果要把「识别代理」做成真正自动的，只能跳出网页环境：要么由浏览器扩展读取/控制代理（`chrome.proxy`），要么由服务端返回访客出口 IP 并与本地信息比对来判断是否走了代理/VPN。纯静态前端做不到。

### 请求量有多小

| 项目 | 取值 |
| --- | --- |
| 检测频率 | 每次构建 1 轮（定时每天 1 次，另有推送触发） |
| 并发数 | 构建 3，浏览器 3 |
| 站点间隔 | 构建固定 0.8 秒，浏览器 0.2 秒 |
| 单站每轮请求 | 最多 2 个（robots.txt + HTTP） |

单个站点每天被请求的次数在个位数，且摊开在不同时刻、只打根路径 —— 这是正常的可达性监控量级，不是压测，不会触发对方的 CC 防护。

### 采取了哪些克制措施

- **亮明身份**：`Mozilla/5.0 (compatible; ToolStore-UptimeBot/1.0; +https://github.com/Re0XIAOPA/ToolStore)`。保留浏览器标识是为了不被 WAF 直接挡掉（那会造成大量误判），同时用 `compatible` 段说明是谁在访问，方便站长联系或封禁。
- **遵守 robots.txt**：服务端 bot 遇到站点明确写的 `Disallow: /` 就跳过不测，如实标记为「未检测」而不是硬闯。浏览器端不受此限——那是访客自己浏览器发出的请求，不属于爬虫行为，仍会照常探测。
- **只探根路径**：只请求 `/` 和 `/robots.txt`，不下抓页面内容、不跟随站内链接。
- **结果缓存**：浏览器端的探测结果缓存 30 分钟，刷新页面或开新标签页都不会重打一遍。
- **防叠加**：探测只在构建流程中跑一次，不存在多个定时任务叠加成并发请求的情况；本地校准也做了并发和间隔限制。

额度方面：一轮实测约 1～2 分钟，随构建执行，不会额外占用定时任务额度。

### 已知限制

- 徽章反映的是**访客自己的网络**能否打开官网（本地校准后的结果），不代表机场的节点、订阅服务或线路质量本身正常。
- 「无法访问」表示当前网络环境连不上，站点可能仍在运行；只有各检测点都连不上才会判为「离线」。
- 构建时那份 JSON 由 CI 机器探测，仅用于首屏快速显示；它与访客的实际体验可能不同，会被本地校准结果覆盖。
- 本地校准会给每个机场站点发一个 HEAD 请求（并发 3、单站超时 6 秒），在页面空闲时执行，不阻塞首屏。结果缓存在浏览器里 **30 分钟**，刷新页面或开新标签页都不会重复探测。站点特别多时可以调小 `CONCURRENCY` 或直接关掉校准。
- 浏览器端用 `no-cors` 探测，只要 fetch 没抛错就说明服务器回应了（405 之类也算），所以只发 HEAD、失败也不再退化成 GET。代价是拿不到状态码，状态码信息来自服务端那份 JSON。
- 探测的是官网根域名能否响应，不代表机场的节点或订阅服务本身正常。
- 部分机场站点本身不稳定，两次探测结果可能不同（实测中就遇到过同一个站一次 403、一次超时）。
- 新增机场后无需手动干预：推送配置会触发构建，构建过程中自动重新检测。
- 部署分支（gh-pages）由 CI 从源码分支自动发布，**不要手工编辑**；需要改什么就改源码分支，重新构建后自动同步。

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
