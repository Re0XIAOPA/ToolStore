// 卡片数据配置文件
// 这个文件集中管理所有卡片数据的导入和导出
// 具体数据分别存储在独立的文件中，便于维护

import { toolsData } from './tools-data.js';
import { softwareData } from './software-data.js';
import { airportData } from './airports-data.js';
import { linksData } from './links-data.js';

// 导出所有卡片数据的集合
export const allCardData = {
    tools: {
        id: "tools",
        title: "代理工具",
        description: "实用工具软件集合，支持多平台使用",
        data: toolsData,
        linkText: "下载"
    },
    software: {
        id: "software",
        title: "精选推荐",
        description: "精选优质软件推荐，邮箱激活即可使用",
        data: softwareData,
        linkText: "官网链接"
    },
    proxy: {
        id: "proxy",
        title: "机场推荐",
        description: "稳定高速的网络代理服务，一键连接全球",
        data: airportData,
        linkText: "访问官网"
    },
    links: {
        id: "links",
        title: "更多网址",
        description: "更多有趣的知名或不知名网址",
        data: linksData,
        linkText: "访问"
    }
};
