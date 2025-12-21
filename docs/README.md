# ToolStore 文档系统

本项目使用 Docusaurus 构建文档系统,静态文件会自动生成到 `public/newDocs` 目录。

## 🚀 快速开始

### 本地开发

在项目根目录运行:

```bash
# 启动开发服务器
npm run docs:start

# 或者进入 docs 目录
cd docs
npm start
```

开发服务器会在 `http://localhost:3000` 启动。

### 构建文档

在项目根目录运行:

```bash
# 构建静态文件到 public/newDocs
npm run docs:build

# 或者进入 docs 目录
cd docs
npm run build
```

### 本地预览构建结果

```bash
# 在根目录
npm run docs:serve

# 或者进入 docs 目录
cd docs
npm run serve
```

## 📁 目录结构

```
docs/
├── blog/                  # 博客文章
├── docs/                  # 文档内容
│   ├── intro.md          # 文档首页
│   └── tutorial-basics/   # 教程示例
├── src/
│   ├── components/       # 自定义 React 组件
│   ├── css/             # 自定义样式
│   └── pages/           # 自定义页面
├── static/              # 静态资源
│   └── img/            # 图片资源
├── docusaurus.config.ts # Docusaurus 配置
├── sidebars.ts         # 侧边栏配置
└── package.json        # 项目依赖
```

## 📝 编写文档

### 创建新文档

1. 在 `docs/` 目录下创建新的 `.md` 或 `.mdx` 文件
2. 添加 Front Matter:

```md
---
sidebar_position: 1
title: 我的文档
---

# 文档标题

文档内容...
```

### 创建博客文章

在 `blog/` 目录下创建新的 `.md` 文件:

```md
---
slug: my-blog-post
title: 我的博客标题
authors: [yourname]
tags: [docusaurus, blog]
---

博客内容...
```

### 添加图片

将图片放在 `static/img/` 目录下,然后在文档中引用:

```md
![alt text](/img/image.png)
```

## 🔧 配置说明

### 修改网站信息

编辑 `docusaurus.config.ts`:

```typescript
const config: Config = {
  title: '你的网站标题',
  tagline: '网站标语',
  url: 'https://your-domain.com',
  baseUrl: '/newDocs/',
  // ... 其他配置
};
```

### 修改侧边栏

编辑 `sidebars.ts` 来自定义侧边栏结构。

### 自定义主题

在 `src/css/custom.css` 中修改颜色和样式变量。

## 🚢 部署

### GitHub Actions 自动部署

项目已配置 GitHub Actions,当你推送到主分支时:

1. 自动检测 `docs/` 目录的变更
2. 构建文档到 `public/newDocs`
3. 自动提交构建结果到仓库

### 手动触发构建

在 GitHub 仓库的 Actions 标签页,选择 "Build Docusaurus Documentation" 工作流,点击 "Run workflow" 手动触发。

### 访问文档

构建完成后,文档将在以下地址可访问:

- 如果使用 GitHub Pages: `https://your-username.github.io/your-repo/newDocs/`
- 如果有自定义域名: `https://your-domain.com/newDocs/`

## 📚 学习资源

- [Docusaurus 官方文档](https://docusaurus.io/)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [MDX 语法](https://mdxjs.com/)

## 🛠️ 常用命令

```bash
# 根目录命令
npm run docs:start   # 启动开发服务器
npm run docs:build   # 构建文档
npm run docs:serve   # 预览构建结果

# docs 目录命令
cd docs
npm start           # 启动开发服务器
npm run build       # 构建文档
npm run serve       # 预览构建结果
npm run clear       # 清除缓存
npm run typecheck   # TypeScript 类型检查
```

## ⚠️ 注意事项

1. **构建输出目录**: 文档构建到 `public/newDocs`,该目录会被提交到 Git 以便 GitHub Pages 访问
2. **Base URL**: 配置为 `/newDocs/`,与输出目录匹配
3. **缓存清理**: 如果遇到构建问题,运行 `npm run clear` 清除缓存
4. **Node 版本**: 需要 Node.js >= 20.0

## 🤝 贡献

欢迎提交文档改进和新增内容!

1. Fork 本仓库
2. 创建特性分支
3. 提交文档修改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

GPL-3.0 License
