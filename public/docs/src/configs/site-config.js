// 站点配置文件
import { ConfigLoader } from '../utils/config-loader.js';

// 解析文档结构
const docsStructure = ConfigLoader.parseDocsStructure();

export const config = {
    // 站点标题
    title: 'ToolStore 文档',
    
    // 默认文档
    defaultDocument: 'index.md',
    
    // 导航栏配置
    navbar: [
        { text: '首页', link: '../../index.html' },
        { text: '文档', link: './index.html' },
        { text: 'GitHub', link: 'https://github.com/Re0XIAOPA/ToolStore' }
    ],
    
    // 侧边栏配置
    sidebar: ConfigLoader.generateSidebarConfig(docsStructure),
    
    // 页面元数据配置
    meta: {
        author: 're0xiaopa',
        description: 'ToolStore 工具文档中心',
        keywords: '代理工具,网络工具,教程,文档'
    }
};