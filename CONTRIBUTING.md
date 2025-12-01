# 贡献指南

感谢你有兴趣为 ToolStore 项目做贡献！本指南将帮助你快速参与项目开发。

## 目录

- [贡献方式](#贡献方式)
- [本地开发](#本地开发)
- [贡献流程](#贡献流程)
- [报告问题](#报告问题)
- [行为准则](#行为准则)

---

## 贡献方式

### 🎯 **机场配置贡献**（最简单，无需编程）

直接编辑机场配置文件添加或更新机场信息：
- `public/assets/scripts/configs/airports/paid-airports.js` - 付费机场
- `public/assets/scripts/configs/airports/free-airports.js` - 免费机场
- `public/assets/scripts/configs/airports/other-airports.js` - 其他机场

### 💻 **代码贡献**

- 修复 bug
- 优化性能
- 改进功能
- 重构代码

### 📚 **文档贡献**

- 完善 README
- 修正错误
- 添加示例

---

## 本地开发

### 前置要求

- Git 基础操作
- JavaScript 和 JSON 基础
- GitHub 账号

### 快速开始

#### 1. Fork & Clone

```bash
# Fork 项目后克隆到本地
git clone https://github.com/你的用户名/ToolStore.git
cd ToolStore
```

#### 2. 创建功能分支

```bash
# 新功能
git checkout -b feature/功能名

# Bug 修复
git checkout -b fix/bug名称
```

#### 3. 本地运行

**推荐：VS Code Live Server 插件**
1. 安装 "Live Server" 插件
2. 右键 `public/index.html` → "Open with Live Server"
3. 浏览器自动打开并实时监听

**其他编辑器：**
- WebStorm/PhpStorm：右键 → "Run 'index.html'"
- Sublime Text：使用 LiveReload 插件
- VIM/Neovim：启动 HTTP 服务器

---

## 贡献流程

### 机场配置示例

编辑机场文件（如 `paid-airports.js`）：

```javascript
{
    name: '机场名称',
    image: 'assets/images/airports/icon.png',
    category: 'paid',
    tier: 'first-tier',  // first-tier | second-tier | third-tier | admin-pick | admin-recommend
    description: '机场描述（支持 HTML）',
    link: 'https://机场官网/register',
    tags: ['稳定', '高速'],
    moreContent: {
        images: [
            { url: 'assets/images/airports-imgs/img1.png' }
        ]
    }
}
```

**字段说明：**

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | ✅ | 机场名称 |
| `image` | ✅ | 图标路径（建议 128×128px） |
| `category` | ✅ | `'paid'` \| `'free'` \| `'other'` |
| `tier` | ✅ | 等级分类 |
| `description` | ✅ | 描述信息 |
| `link` | ✅ | 官网链接 |
| `tags` | ✅ | 标签数组 |
| `moreContent` | ❌ | 详情弹窗内容（可选） |

### 代码规范

**命名：**
- 文件：kebab-case (`airport-config.js`)
- 函数/变量：camelCase (`airportData`, `createModal()`)
- 常量：UPPER_CASE (`MAX_ITEMS`)

**风格：**
- 2 空格缩进
- 分号结尾
- 单引号
- ES6 Modules (`import`/`export`)

### 提交步骤

#### 1. 提交代码

```bash
git add .
git commit -m "类型: 简洁描述"
```

**类型示例：**
- `feat: 新功能`
- `fix: bug 修复`
- `docs: 文档更新`
- `refactor: 代码重构`

**示例：**
```bash
git commit -m "feat: 添加新的付费机场配置"
git commit -m "fix: 修复移动端显示问题"
```

#### 2. 推送分支

```bash
git push origin feature/功能名
```

#### 3. 提交 Pull Request

1. 在 GitHub 打开你的 Fork
2. 点击 "New Pull Request"
3. 基分支选择 `main`
4. 填写 PR 描述

**PR 检查清单：**
- [ ] 代码本地已测试
- [ ] 遵守编码规范
- [ ] 添加/更新注释
- [ ] 更新 README（如需要）
- [ ] 无新增错误或警告

**PR 描述模板：**
```markdown
## 描述
简要说明你的更改。

## 关联 Issue
关闭 #(issue 编号)

## 更改类型
- [ ] 机场配置
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新

## 测试
- [ ] 本地已测试
- [ ] 不同浏览器已测试
- [ ] 移动端已测试
```

---

## 报告问题

### 发现 Bug

在 GitHub Issues 中报告，包括：
1. 清晰的标题
2. Bug 的具体描述
3. 重现步骤
4. 预期行为 vs 实际行为
5. 浏览器和操作系统版本

### 功能建议

在 GitHub Issues 中提交（标记为 `enhancement`）：
1. 功能需求说明
2. 为什么需要这个功能
3. 参考或示例（如有）

---

## 行为准则

✅ **提倡：**
- 尊重他人的想法和反馈
- 友好、建设性地交流
- 接受批评并改进

❌ **禁止：**
- 骚扰、歧视或不尊重
- 发布不当内容

---

## 常见问题

**Q: 多久收到反馈？**
A: 通常 3-7 天，取决于维护者时间。

**Q: PR 被拒绝了？**
A: 正常情况。仔细阅读反馈，进行修改后重新提交。

**Q: 不确定想法是否符合项目？**
A: 先打开 Issue 讨论，等待维护者反馈后再开始编码。

**Q: 需要测试吗？**
A: 是的！在多个浏览器和移动设备上测试，检查控制台错误。

---

## 许可证

通过提交贡献，你同意在项目许可证 **GPL-3.0** 下发布你的代码。

---

## 感谢

感谢每一位贡献者！你们的努力让 ToolStore 变得更好。❤️

**有疑问？**
- 查看 [README.md](README.md) 了解项目结构
- 在 GitHub Issues 中提问
- 通过 GitHub Discussions 讨论

**现在就开始贡献吧！** 🚀