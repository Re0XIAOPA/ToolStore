# ToolStore 文档系统

这是一个类似于 VitePress 的静态文档系统，专为 ToolStore 项目设计。

## 特性

- **配置驱动**: 通过配置文件控制侧边栏和导航栏
- **Markdown 支持**: 使用 Markdown 编写文档内容
- **动态侧边栏**: 自动从 Markdown 文件中提取配置信息
- **搜索功能**: 内置文档搜索功能
- **响应式设计**: 适配各种设备屏幕
- **代码高亮**: 支持代码块语法高亮
- **目录生成**: 自动生成页面目录

## 目录结构

```
src/
├── components/          # 组件文件
├── configs/             # 配置文件
├── docs/                # Markdown 文档
│   ├── development/     # 开发指南
│   ├── guide/           # 使用指南
│   └── tools/           # 工具文档
├── styles/              # 样式文件
└── utils/               # 工具函数
```

## 配置文件

### site-config.js

站点配置文件，包含导航栏、侧边栏等配置：

```javascript
export const config = {
    title: 'ToolStore 文档',
    defaultDocument: 'index.md',
    navbar: [...],
    sidebar: {...}
};
```

### Markdown 文件元数据

在 Markdown 文件顶部使用 YAML front matter 添加元数据：

```markdown
---
title: 页面标题
order: 1
---

# 文档内容
```

## 开发指南

### 添加新文档

1. 在 `docs/` 目录下创建新的 Markdown 文件
2. 在相应的目录中添加文档内容
3. 更新侧边栏配置（如果需要）

### 自定义样式

1. 修改 `styles/docs.css` 文件来自定义样式
2. 添加新的样式文件并在 `index.html` 中引入

### 扩展功能

1. 在 `components/` 目录中添加新的组件
2. 在 `utils/` 目录中添加工具函数
3. 在 `main.js` 中初始化新功能

## 部署

将 `src/` 目录中的所有文件部署到 Web 服务器即可。

## 许可证

MIT