/**
 * 主题切换功能
 */
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initThemeListeners();
});

// 立即设置默认主题为暗黑模式，避免刷新闪烁
(function() {
    const savedTheme = localStorage.getItem('theme');
    // 如果没有保存的主题或者是第一次访问，默认使用暗色主题
    if (!savedTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
})();

/**
 * 初始化主题切换功能
 */
function initThemeToggle() {
    const toggleSwitch = document.getElementById('themeToggle');
    if (!toggleSwitch) return;
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    
    // 如果有保存的主题设置，使用它
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        toggleSwitch.checked = savedTheme === 'dark';
    } else {
        // 如果没有保存的设置，使用暗色主题
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleSwitch.checked = true;
    }
    
    // 立即应用主题样式
    applyThemeStyles(document.documentElement.getAttribute('data-theme'));
    
    // 监听切换事件
    toggleSwitch.addEventListener('change', function(e) {
        const newTheme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 播放切换动画
        playThemeSwitchAnimation(newTheme);
        
        // 应用主题样式
        applyThemeStyles(newTheme);
    });
}

/**
 * 应用主题相关样式
 * @param {string} theme - 'dark' 或 'light'
 */
function applyThemeStyles(theme) {
    // 确保页面上所有需要主题的元素都能正确适应主题变化
    const body = document.body;
    const isDark = theme === 'dark';
    
    // 移除任何可能存在的临时主题类
    body.classList.remove('theme-transition');
    
    // 添加过渡效果类，然后延迟移除以允许平滑过渡
    body.classList.add('theme-transition');
    setTimeout(() => {
        body.classList.remove('theme-transition');
    }, 1000);
    
    // 设置页面的meta主题色，这影响移动设备上的浏览器UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#1a1d24' : '#7c8aff');
    }
    
    // 更新图标颜色 - 如果有SVG图标
    updateSvgIconColors(isDark);
    
    // 确保主内容区域的背景色和文字颜色正确设置
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        // 使用CSS变量，而不是直接设置样式，这样可以利用CSS中定义的过渡效果
        mainContent.style.backgroundColor = isDark ? 'var(--card-bg)' : 'var(--card-bg)';
        mainContent.style.color = isDark ? 'var(--text-color)' : 'var(--text-color)';
    }
    
    // 确保step元素在暗色模式下正确显示
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.style.backgroundColor = isDark ? 'var(--step-bg)' : 'var(--step-bg)';
        step.style.color = isDark ? 'var(--text-color)' : 'var(--text-color)';
    });
    
    // 确保链接颜色正确设置
    const links = document.querySelectorAll('a:not(header a):not(.nav-links a):not(.toc-item a)');
    links.forEach(link => {
        if (!link.classList.contains('btn-view')) { // 不修改按钮链接
            link.style.color = isDark ? 'var(--primary-color)' : 'var(--primary-color)';
        }
    });
    
    // 确保工具卡片和标签正确显示
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.style.backgroundColor = isDark ? 'var(--card-bg)' : 'var(--card-bg)';
        card.style.borderColor = isDark ? 'var(--border-color)' : 'var(--border-color)';
    });
    
    const toolIcons = document.querySelectorAll('.tool-icon');
    toolIcons.forEach(icon => {
        icon.style.backgroundColor = isDark ? 'var(--tool-icon-bg)' : 'var(--tool-icon-bg)';
    });
    
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.style.backgroundColor = isDark ? 'var(--tag-bg)' : 'var(--tag-bg)';
        tag.style.color = isDark ? 'var(--primary-color)' : 'var(--primary-color)';
    });
    
    // 触发自定义事件，以便其他可能需要响应主题变化的脚本可以监听
    const themeChangeEvent = new CustomEvent('themeChanged', { detail: { theme } });
    document.dispatchEvent(themeChangeEvent);
}

/**
 * 播放主题切换动画
 * @param {string} theme - 'dark' 或 'light'
 */
function playThemeSwitchAnimation(theme) {
    // 创建一个短暂的全屏过渡效果
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${theme === 'dark' ? '#1a1d24' : '#ffffff'};
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    
    // 触发重绘以应用初始样式
    void overlay.offsetWidth;
    
    // 淡入
    overlay.style.opacity = '0.1';
    
    // 淡出并移除
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }, 200);
}

/**
 * 更新SVG图标颜色
 * @param {boolean} isDark - 是否为暗色主题
 */
function updateSvgIconColors(isDark) {
    // 更新header中的SVG图标颜色
    const headerSvgs = document.querySelectorAll('header svg path');
    if (headerSvgs.length > 0) {
        const iconColor = isDark ? '#95a4ff' : '#7c8aff';
        headerSvgs.forEach(path => {
            if (path.getAttribute('stroke')) {
                path.setAttribute('stroke', iconColor);
            }
        });
    }
}

/**
 * 初始化与主题相关的其他监听器
 */
function initThemeListeners() {
    // 系统主题偏好变化时自动适应
    if (window.matchMedia) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // 检查是否有用户自定义设置，如果没有则跟随系统
        prefersDarkScheme.addEventListener('change', (e) => {
            // 只有当用户未明确选择主题时才跟随系统
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                
                // 同步切换开关状态
                const toggleSwitch = document.getElementById('themeToggle');
                if (toggleSwitch) {
                    toggleSwitch.checked = e.matches;
                }
                
                // 应用主题样式
                applyThemeStyles(newTheme);
            }
        });
    }
}