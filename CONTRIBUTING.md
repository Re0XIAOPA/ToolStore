# 贡献指南

感谢你有兴趣为 ToolStore 项目做贡献！本指南将帮助你快速了解如何参与项目开发。

## 目录

- [贡献方式](#贡献方式)
- [开发环境设置](#开发环境设置)
- [机场配置贡献](#机场配置贡献)
- [代码贡献指南](#代码贡献指南)
- [提交 Pull Request](#提交-pull-request)
- [报告问题](#报告问题)

## 贡献方式

你可以通过以下方式为项目做贡献：

### 1. 添加或更新机场信息 ⭐ (最简单)

这是最直接的贡献方式，不需要任何编程知识。

### 2. 添加工具、软件或友链

在相应的数据配置文件中添加新条目。

### 3. 改进代码

修复 bug、优化性能、改进代码结构等。

### 4. 改进文档

完善 README、修正错误、添加使用示例等。

## 开发环境设置

### 前置要求

- 了解基本的 Git 操作
- 了解 JavaScript ES6+ 和 JSON 格式
- 有 GitHub 账号

### 本地开发

1. **Fork 项目**

   点击 GitHub 上的 "Fork" 按钮，将项目复制到你的账号下。

2. **克隆到本地**

   ```bash
   git clone https://github.com/你的用户名/ToolStore.git
   cd ToolStore
   ```

3. **创建开发分支**

   ```bash
   git checkout -b feature/你的功能名
   # 或修复bug
   git checkout -b fix/bug名称
   ```

4. **本地运行**

   项目是静态网站，推荐使用编辑器插件运行：

   **方式一：VS Code Live Server 插件（推荐）**

   1. 在 VS Code 中打开项目
   2. 安装 "Live Server" 插件（搜索 `Live Server`）
   3. 右键点击 `public/index.html`
   4. 选择 "Open with Live Server"
   5. 浏览器自动打开并监听文件变化

   **方式二：其他编辑器的 Live Server**

   - **WebStorm/PhpStorm**: 右键 → "Run 'index.html'"
   - **Sublime Text**: 使用 "LiveReload" 插件
   - **VIM/Neovim**: 使用 `:LiveServer` 或自行启动 HTTP 服务器

## 机场配置贡献

这是最常见和最简单的贡献方式。

### 添加付费机场

编辑 `public/assets/scripts/configs/airports/paid-airports.js`：

```javascript
{
    name: '机场名称',
    image: 'assets/images/airports/icon-name.png',  // 需要上传对应的图片
    category: 'paid',
    tier: 'first-tier',  // 或 'second-tier', 'third-tier', 'admin-pick'
    description: '机场的详细描述，可包含 HTML 标签如 <br>',
    moreContent: {
        images: [
            { url: 'assets/images/airports-imgs/img1.png' },
            { url: 'assets/images/airports-imgs/img2.png' }
        ]
    },
    link: 'https://机场官网/register?code=你的邀请码',
    tags: ['稳定', '高速', '性价比']  // 标签，可自由组合
}
```

### 添加免费机场

编辑 `public/assets/scripts/configs/airports/free-airports.js`，结构相同。

### 添加其他分类机场

编辑 `public/assets/scripts/configs/airports/other-airports.js`，结构相同。

### 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `name` | 机场名称 | `'顶级机场'` |
| `image` | 卡片图标 (1:1 最佳) | `'assets/images/airports/topairport.png'` |
| `category` | 分类 | `'paid'` \| `'free'` \| `'other'` |
| `tier` | 等级 | `'first-tier'` \| `'second-tier'` \| `'third-tier'` \| `'admin-pick'` |
| `description` | 描述信息 | 支持 HTML 标签 |
| `link` | 官网链接 | 必须是可访问的链接 |
| `tags` | 标签数组 | `['稳定', '高速']` |
| `moreContent` | 详情图片 (可选) | 弹窗中显示的额外图片 |

### 图片上传

1. 机场卡片图标：上传到 `public/assets/images/airports/`
2. 详情弹窗图片：上传到 `public/assets/images/airports-imgs/`
3. 建议尺寸：
   - 卡片图标：128×128px
   - 详情图片：800×600px 或以上

## 代码贡献指南

### 编码规范

1. **命名规范**
   - 文件名：使用 kebab-case（如 `airport-config.js`）
   - 变量/函数：使用 camelCase（如 `airportData`, `createModal()`)
   - 常量：使用 UPPER_CASE（如 `MAX_ITEMS = 50`）

2. **代码风格**
   - 使用 2 空格缩进
   - 使用分号结尾
   - 使用单引号（除非需要包含单引号）
   - 为复杂逻辑添加注释

3. **模块化**
   - 使用 ES6 Modules (`import`/`export`)
   - 保持文件职责单一
   - 避免全局变量污染

### 修改现有功能

#### 修改机场分组逻辑

编辑 `public/assets/scripts/modules/card-renderer.js` 中的 `renderAirportGroupedCards()` 函数。

#### 修改推荐系统

编辑 `public/assets/scripts/modules/recommend.js` 和 `public/assets/scripts/configs/recommend-config.js`。

#### 修改样式

编辑 `public/assets/css/style.css`，确保：
- 保持响应式设计
- 遵守现有的颜色主题（主色：#7c8aff）
- 测试不同屏幕尺寸

### 添加新功能

新增功能应该：

1. **保持项目的静态特性** - 不能依赖后端 API 或 Node.js 服务
2. **不增加外部依赖** - 除非必要且已在 `package.json` 中声明
3. **编写模块化代码** - 易于维护和测试
4. **更新相关文档** - 包括 README.md

## 提交 Pull Request

### 提交前检查清单

- [ ] 代码已在本地测试
- [ ] 遵守了编码规范
- [ ] 添加或更新了相关注释
- [ ] 更新了 README.md（如有必要）
- [ ] 没有引入新的 bug 或警告信息

### 提交步骤

1. **提交更改**

   ```bash
   git add .
   git commit -m "类型: 简洁的描述"
   # 类型可以是: feat(新功能), fix(bug修复), docs(文档), style(样式), refactor(重构)
   ```

   示例：
   ```bash
   git commit -m "feat: 添加新的付费机场配置"
   git commit -m "fix: 修复机场卡片在移动端的显示问题"
   git commit -m "docs: 更新README中的机场配置说明"
   ```

2. **推送到你的 Fork**

   ```bash
   git push origin feature/你的功能名
   ```

3. **提交 Pull Request**

   - 在 GitHub 上打开你的 Fork
   - 点击 "New Pull Request"
   - 选择基分支为主项目的 `main`（或 `master`）
   - 填写详细的 PR 描述：
     - 你做了什么
     - 为什么这样做
     - 如何测试

### PR 描述模板

```markdown
## 描述

简要描述你的更改。

## 关联问题

关闭 #(issue 编号)

## 更改类型

- [ ] 添加机场信息
- [ ] 修复 bug
- [ ] 新增功能
- [ ] 改进文档
- [ ] 其他

## 测试情况

- [ ] 本地已测试
- [ ] 不同浏览器已测试
- [ ] 移动端已测试

## 截图（如有）

添加相关截图以展示你的更改。
```

## 报告问题

### 发现 Bug

如果你发现了 bug，请通过以下方式报告：

1. 在 GitHub 上打开 Issue
2. 使用清晰的标题描述问题
3. 提供以下信息：
   - bug 的具体描述
   - 重现步骤
   - 预期行为
   - 实际行为
   - 你的浏览器和操作系统版本

### 建议功能

如果你有功能建议：

1. 在 GitHub 上打开 Issue，标记为 `enhancement`
2. 详细描述功能的需求
3. 解释为什么需要这个功能
4. 如果可能，提供参考或示例

## 行为准则

所有贡献者都应该遵守以下准则：

- ✅ 尊重他人的想法和反馈
- ✅ 友好、建设性地交流
- ✅ 接受批评并改进
- ❌ 禁止骚扰、歧视或不尊重的言论
- ❌ 禁止发布不当内容

## 常见问题

### Q: 我需要测试我的更改吗？

**A:** 是的！请：
- 在不同浏览器中测试（Chrome, Firefox, Safari, Edge）
- 在移动设备上测试
- 检查控制台是否有错误信息

### Q: 我的 PR 被拒绝了怎么办？

**A:** 这很正常！请：
- 仔细阅读反馈
- 询问是否不理解
- 进行必要的修改
- 重新提交

### Q: 我不确定我的想法是否符合项目方向？

**A:** 没关系！你可以：
- 先打开一个 Issue 讨论
- 等待项目维护者的反馈
- 确认后再开始编码

### Q: 多久会收到 PR 审查反馈？

**A:** 通常在 3-7 天内，取决于项目维护者的时间安排。

## 许可证

通过提交贡献，你同意将你的代码贡献在项目的许可证（MIT）下发布。

## 感谢

感谢每一位贡献者！你们的努力让 ToolStore 变得更好。❤️

---

**还有疑问？**

- 查看 [README.md](README.md) 了解项目结构
- 在 GitHub Issues 中提问
- 通过 GitHub Discussions 讨论

**现在就开始贡献吧！** 🚀
