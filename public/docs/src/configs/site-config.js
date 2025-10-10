// 站点配置文件 - 只包含配置，不包含逻辑
import { mainConfig } from './main-config.js';
import { navbarConfig } from './navbar-config.js';
import { sidebarConfig } from './sidebar-config.js';

// 导出聚合配置
export const config = {
    // 主配置
    ...mainConfig,
    
    // 导航栏配置
    navbar: navbarConfig,
    
    // 侧边栏配置（将在运行时生成）
    sidebar: {}
};

// 导出各个独立的配置
export { mainConfig, navbarConfig, sidebarConfig };
