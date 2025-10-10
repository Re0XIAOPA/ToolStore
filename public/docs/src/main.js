import { config } from './configs/site-config.js';
import { renderSidebar, renderNavbar } from './components/navigation.js';
import { loadMarkdownContent, parseMarkdown } from './utils/markdown-parser.js';
import { ConfigLoader } from './utils/config-loader.js';
import { AdvancedNavigation } from './components/advanced-navigation.js';
import { Router } from './utils/router.js';

// 初始化文档系统
document.addEventListener('DOMContentLoaded', async () => {
    // 渲染导航栏
    renderNavbar(config.navbar);
    
    // 渲染侧边栏
    renderSidebar(config.sidebar);
    
    // 初始化高级导航
    const advancedNav = AdvancedNavigation.init(config);
    
    // 初始化路由系统
    const router = new Router();
    router.addRoute('*', async (path) => {
        await loadDocument(path);
    });
    router.start();
    
    // 监听文档导航事件
    document.addEventListener('document:navigate', (e) => {
        router.navigateTo(e.detail.path);
    });
    
    // 监听路由变化事件
    document.addEventListener('route:change', (e) => {
        // 可以在这里添加路由变化时的额外逻辑
        console.log('路由变化:', e.detail.path);
    });
    
    // 设置侧边栏展开/收缩功能（桌面端和移动端）
    setupSidebarToggle();
    
    // 设置移动端菜单切换功能
    setupMobileMenuToggle();
    
    // 渲染移动端侧边栏
    renderMobileSidebar();
});

// 加载文档内容
async function loadDocument(docPath) {
    try {
        const content = await loadMarkdownContent(docPath);
        
        // 提取元数据
        const metadata = ConfigLoader.extractMetadata(content);
        
        // 更新页面标题
        if (metadata.title) {
            document.title = `${metadata.title} - ${config.title}`;
        }
        
        // 渲染内容（移除元数据部分）
        const contentWithoutMetadata = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
        const parsedContent = parseMarkdown(contentWithoutMetadata);
        document.getElementById('content').innerHTML = parsedContent;
        
        // 高亮当前选中的侧边栏项
        highlightActiveLink(docPath);
    } catch (error) {
        console.error('加载文档失败:', error);
        document.getElementById('content').innerHTML = '<h1>文档未找到</h1><p>抱歉，您请求的文档不存在。</p>';
    }
}

// 高亮当前选中的链接
function highlightActiveLink(docPath) {
    // 移除之前的所有高亮
    document.querySelectorAll('.sidebar-item a, .sider-container .sidebar-item a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 高亮当前链接（桌面端和移动端）
    const currentLink = document.querySelector(`.sidebar-item a[href="#${docPath}"]`);
    const mobileCurrentLink = document.querySelector(`.sider-container .sidebar-item a[href="#${docPath}"]`);
    
    if (currentLink) {
        currentLink.classList.add('active');
    }
    
    if (mobileCurrentLink) {
        mobileCurrentLink.classList.add('active');
    }
}

// 设置路由监听
function setupRouting() {
    // 路由监听现在由Router类处理
    // 这里可以保留一些额外的路由逻辑
}

// 设置侧边栏展开/收缩功能（桌面端和移动端）
function setupSidebarToggle() {
    // 为桌面端侧边栏添加展开/收缩功能
    const sidebarTitles = document.querySelectorAll('.sidebar .sidebar-group-title');
    sidebarTitles.forEach(title => {
        title.addEventListener('click', () => {
            const items = title.nextElementSibling;
            title.classList.toggle('collapsed');
            items.classList.toggle('collapsed');
        });
    });
    
    // 为移动端侧边栏添加展开/收缩功能
    const mobileSidebarTitles = document.querySelectorAll('.sider-container .sidebar-group-title');
    mobileSidebarTitles.forEach(title => {
        title.addEventListener('click', () => {
            const items = title.nextElementSibling;
            title.classList.toggle('collapsed');
            items.classList.toggle('collapsed');
        });
    });
}

// 设置移动端菜单切换功能
function setupMobileMenuToggle() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const siderContainer = document.getElementById('siderContainer');
    
    if (mobileMenuToggle && siderContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            siderContainer.classList.toggle('active');
        });
        
        // 点击侧边栏外部区域关闭侧边栏
        document.addEventListener('click', (event) => {
            if (siderContainer.classList.contains('active') && 
                !siderContainer.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)) {
                siderContainer.classList.remove('active');
            }
        });
    }
}

// 渲染移动端侧边栏
function renderMobileSidebar() {
    const mobileSidebarContent = document.getElementById('mobileSidebarContent');
    if (mobileSidebarContent) {
        // 渲染侧边栏内容到移动端容器
        renderSidebar(config.sidebar, mobileSidebarContent);
        
        // 重新设置移动端侧边栏的展开/收缩功能（因为重新渲染了内容）
        setTimeout(() => {
            setupSidebarToggle();
        }, 0);
    }
}