# ToolStore 文档系统

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

### 主配置 (main-config.js)

```javascript
export const mainConfig = {
    title: 'ToolStore 文档',           // 站点标题
    defaultDocument: 'index.md',       // 默认文档
    meta: {                           // 页面元数据
        author: 're0xiaopa',
        description: 'ToolStore 工具文档中心',
        keywords: '代理工具,网络工具,教程,文档'
    }
};
```

### 导航栏配置 (navbar-config.js)

```javascript
export const navbarConfig = [
    { text: '首页', link: '../../index.html' },
    { text: '文档', link: './index.html' },
    { text: 'GitHub', link: 'https://github.com/Re0XIAOPA/ToolStore' }
];
```

### 侧边栏配置 (sidebar-config.js)

```javascript
export const sidebarConfig = [
    {
        title: '入门指南',    // 组标题
        dir: '.',            // 对应docs目录下的子目录
        order: 1            // 组排序
    },
    {
        title: '工具使用',
        dir: 'tools',
        order: 2
    },
    {
        title: '开发指南',
        dir: 'development',
        order: 3
    }
];
```

### Markdown 文件元数据

在 Markdown 文件顶部使用 YAML front matter 添加元数据：

```markdown
---
title: 页面标题        # 显示在侧边栏的标题
order: 1              # 在侧边栏中的排序
hidden: true          # 是否在侧边栏中隐藏（可选）
---

# 文档内容
```

## 如何贡献

1. Fork 项目仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 添加新文档

1. 在 `docs/` 目录下相应的子目录中创建新的 Markdown 文件
2. 在文件顶部添加元数据（标题、排序等）
3. 编写文档内容

### 修改配置

1. 修改 `configs/` 目录下的相应配置文件
2. 侧边栏组结构在 `sidebar-config.js` 中定义
3. 导航栏项在 `navbar-config.js` 中定义
4. 站点基本信息在 `main-config.js` 中定义