# 贡献指南 (Developers Manual)

欢迎来到 ToolStore 的核心配置手册。这里记录了每一个配置文件的作用、结构和修改方式。

## 配置文件全览 (Configuration Dictionary)

所有的前端配置都位于 **`public/assets/scripts/configs/`**。请根据你要修改的内容查找对应的文件。

| 大类         | 配置文件                     | 作用与说明                                                                 |
| :----------- | :--------------------------- | :------------------------------------------------------------------------- |
| **整合入口** | `config.js`                  | **[不要动]** 仅仅是导出其他配置的入口。                                    |
|              | `card-data.js`               | **[不要动]** 汇总所有类别数据（Tools, Software, Proxy, Links）的聚合文件。 |
| **核心数据** | `tools-data.js`              | **[高频]** 代理工具列表（Clash, V2Ray等）。添加新工具改这里。              |
|              | `software-data.js`           | 精选软件列表（Netflix, YouTube等）。                                       |
|              | `links-data.js`              | 友情链接数据。                                                             |
| **推荐系统** | `recommend-config.js`        | **[首页]** 定义首页顶部的 "推荐卡片" 内容和排序 (`hot`, `supr`)。          |
| **机场配置** | `airport-config.js`          | **[聚合]** 聚合下方三个机场文件的入口。                                    |
|              | `airports-data.js`           | **[逻辑]** 将分层的机场数据扁平化为一维数组，供渲染使用。                  |
|              | `airports/paid-airports.js`  | **[高频]** 付费机场数据（分一线、二线、站长推荐等）。                      |
|              | `airports/free-airports.js`  | 免费机场数据。                                                             |
|              | `airports/other-airports.js` | 其他/未分类机场。                                                          |
| **其他**     | `badge-config.js`            | 徽章样式定义（颜色、背景、文字）。                                         |
|              | `sponsor-config.js`          | 贡献者/赞助者列表。                                                        |

---

## 详细修改指南

### 1. 添加代理工具 (`tools-data.js`)

这是最常见的操作。

```javascript
// public/assets/scripts/configs/tools-data.js
{
  name: "工具名称",
  image: "assets/images/tools/Icon.png", // 图标路径
  link: "https://下载链接...",          // 跳转链接
  badges: ["opensource", "recommended"] // 关联 badge-config.js
}
```

### 2. 管理机场 (`airports/*.js`)

机场文件 (`paid/free/other`) 结构完全一致，按等级分类。

```javascript
// public/assets/scripts/configs/airports/paid-airports.js
'adminRecommend': [ // 分类: adminRecommend, firstTier, etc.
    {
        name: '机场名称',
        image: 'assets/images/airports/Logo.png', // 或直接写 '✈️'
        description: '描述文本',
        link: 'https://注册链接...',
        tags: ['稳定', '高速'], // 显示的标签
        moreContent: { // [可选] 详情弹窗中的图片
             images: [{ url: 'assets/images/airports-imgs/详情图.png' }]
        }
    }
]
```

### 3. 设置首页推荐 (`recommend-config.js`)

决定首页顶部显示哪些内容。

```javascript
// public/assets/scripts/configs/recommend-config.js
tools: [
    { name: 'Clash Verge', hot: 1, supr: true }, // hot: 排序权重(1最前), supr: 至尊推荐图标
    { name: 'Hiddify', hot: 2 }
],
software: [ ... ],
proxy: [ ... ]
```

### 4. 添加精选软件 (`software-data.js`)

```javascript
// public/assets/scripts/configs/software-data.js
{
    name: "Netflix",
    image: "assets/images/software/Netflix.png",
    link: "https://www.netflix.com/"
}
```

### 5. 添加贡献者 (`sponsor-config.js`)

```javascript
// public/assets/scripts/configs/sponsor-config.js
{
    name: '你的名字',
    avatar: 'GitHub头像链接',
    url: 'GitHub主页',
    type: 'secondary' // primary(主要) 或 secondary(次要)
}
```

---

## 进阶：后端自动更新 (`scripts/`)

根目录下的 `scripts/` 为 Node.js 后端脚本，用于抓取数据生成 `download-config.js`。

- **`update-downloads.js`**: 自动抓取 GitHub Releases 的核心脚本。
- **`manual-config.js`**: 手动覆盖或补充自动抓取不到的链接。

**一般情况下，你只需要修改 `tools-data.js`，脚本会自动处理剩下的事情。**

---

## 文档编写

文档位于 `docs/` 目录。

1. 在 `docs/docs/` 下创建 Markdown 文件。
2. 头部添加 Front Matter：
   ```yaml
   ---
   id: my-doc
   title: 我的文档
   ---
   ```
3. 预览：`cd docs && npm run start`

---

这份指南涵盖了项目中的每一个配置文件。找到你需要改动的地方，直接编辑即可！🚀
