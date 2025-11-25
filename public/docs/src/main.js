import { config as defaultConfig } from './configs/site-config.js';
import { mainConfig, navbarConfig, sidebarConfig } from './configs/site-config.js';
import { renderSidebar, renderNavbar } from './components/navigation.js';
import { loadMarkdownContent, parseMarkdown } from './utils/markdown-parser.js';
import { ConfigLoader } from './utils/config-loader.js';
import { AdvancedNavigation } from './components/advanced-navigation.js';
import { Router } from './utils/router.js';

// 初始化文档系统
document.addEventListener('DOMContentLoaded', async () => {
    // 异步初始化配置
    const docsStructure = await ConfigLoader.parseDocsStructure();
    const config = {
        ...mainConfig,
        navbar: navbarConfig,
        sidebar: ConfigLoader.generateSidebarConfig(docsStructure)
    };
    
    // 渲染导航栏
    renderNavbar(config.navbar);
    
    // 渲染侧边栏
    renderSidebar(config.sidebar);
    
    // 初始化高级导航
    const advancedNav = AdvancedNavigation.init(config);
    
    // 初始化路由系统
    const router = new Router();
    router.addRoute('*', async (path) => {
        await loadDocument(path, config);
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
    renderMobileSidebar(config);
    
    // 检查并应用图片懒加载降级处理
    checkAndApplyLazyLoadFallback();
});

// 加载文档内容
async function loadDocument(docPath, config) {
    try {
        // 处理简化路径格式
        const normalizedPath = normalizeDocPath(docPath);
        const content = await loadMarkdownContent(normalizedPath);
        
        // 提取元数据
        const metadata = ConfigLoader.extractMetadata(content);
        
        // 检查是否隐藏文档
        if (metadata.hidden) {
            document.getElementById('content').innerHTML = '<h1>文档未找到</h1><p>该文档已被隐藏。</p>';
            return;
        }
        
        // 更新页面标题
        if (metadata.title) {
            document.title = `${metadata.title} - ${config.title}`;
        }
        
        // 渲染内容（移除元数据部分）
        const contentWithoutMetadata = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
        const parsedContent = parseMarkdown(contentWithoutMetadata, normalizedPath);
        document.getElementById('content').innerHTML = parsedContent;
        
        // 高亮当前选中的侧边栏项
        highlightActiveLink(normalizedPath);
        
        // 应用图片懒加载降级处理（如果需要）
        checkAndApplyLazyLoadFallback();
    } catch (error) {
        console.error('加载文档失败:', error);
        document.getElementById('content').innerHTML = '<h1>文档未找到</h1><p>抱歉，您请求的文档不存在。</p>';
    }
}

// 规范化文档路径
function normalizeDocPath(path) {
    // 如果路径为空或根路径，返回默认文档
    if (!path || path === '/' || path === '') { 
        return 'index.md';
    }
    
    // 如果路径已经以.md结尾，直接返回
    if (path.endsWith('.md')) {
        return path;
    }
    
    // 如果路径不以.md结尾，添加.md后缀
    return `${path}.md`;
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
function renderMobileSidebar(config) {
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

// 检查并应用图片懒加载降级处理
function checkAndApplyLazyLoadFallback() {
    // 检测浏览器是否支持loading属性
    if (!('loading' in HTMLImageElement.prototype)) {
        // 降级处理：使用Intersection Observer
        lazyLoadImages();
    }
}

// 降级处理：使用Intersection Observer实现懒加载
function lazyLoadImages() {
    if (!('IntersectionObserver' in window)) {
        // 如果不支持Intersection Observer，则立即加载所有图片
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (!img.src && img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // 如果图片有data-src属性，使用它作为src
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        // 如果图片还没有src，则使用data-src存储真实URL
        if (!img.src || img.src === window.location.href || img.src.startsWith('data:image')) {
            img.dataset.src = img.getAttribute('src');
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3C/svg%3E'; // 占位符
        }
        imageObserver.observe(img);
    });
}