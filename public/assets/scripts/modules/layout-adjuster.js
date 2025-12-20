// 布局调整模块
// 自动根据banner高度调整页面布局

let resizeObserver;
let mutationObserver;

// 初始化布局调整
export function initLayoutAdjuster() {
    // 页面加载完成后调整布局
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', adjustLayout);
    } else {
        adjustLayout();
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', debounce(adjustLayout, 250));
    
    // 监听banner内容变化
    const bannerNotice = document.querySelector('.banner-notice');
    if (bannerNotice) {
        // 使用ResizeObserver监听元素大小变化
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(debounce(adjustLayout, 100));
            resizeObserver.observe(bannerNotice);
        }
        
        // 使用MutationObserver监听内容变化
        if (window.MutationObserver) {
            mutationObserver = new MutationObserver(debounce(adjustLayout, 100));
            mutationObserver.observe(bannerNotice, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
        }
    }
    
    // 监听banner关闭事件
    window.addEventListener('bannerClosed', adjustLayoutAfterBannerClosed);
    
    // 监听banner打开事件
    window.addEventListener('bannerOpened', adjustLayout);
    
    // 定期检查布局（作为后备方案）
    setInterval(adjustLayout, 1000);
}

// 调整布局函数
export function adjustLayout() {
    try {
        const bannerNotice = document.querySelector('.banner-notice');
        if (!bannerNotice) return;
        
        // 检查banner是否被隐藏（仅检查当前显示状态，不检查本地存储）
        if (bannerNotice.style.display === 'none') {
            adjustLayoutAfterBannerClosed();
            return;
        }
        
        // 获取header的高度（已包含banner高度）
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : (window.innerWidth <= 956 ? 60 : 80);
        
        // 调整main区域的padding-top
        const main = document.querySelector('main');
        if (main) {
            // 确保main区域有足够的顶部padding来避免与header重叠
            const requiredPadding = headerHeight + 20; // headerHeight已包含banner高度，只需加20px间距
            main.style.paddingTop = requiredPadding + 'px';
        }
        
        // 调整tools-section的margin-top
        const toolsSections = document.querySelectorAll('.tools-section');
        toolsSections.forEach((section, index) => {
            // 根据屏幕尺寸设置不同的间距
            let marginTop = 20; // 减少默认间距
            if (window.innerWidth <= 480) {
                marginTop = 15;
            } else if (window.innerWidth <= 767) {
                marginTop = 15;
            } else if (window.innerWidth <= 956) {
                marginTop = 15;
            }
            
            // 第一个section需要额外的顶部间距，但不需要包含整个banner高度
            // banner已经通过main的padding-top占据了空间，所以这里只需要基础间距
            section.style.marginTop = marginTop + 'px';
        });
        
        // 调整锚点滚动偏移量
        const scrollTargets = document.querySelectorAll('#tools, #software, #proxy');
        scrollTargets.forEach(target => {
            target.style.scrollMarginTop = (headerHeight + 15) + 'px';
        });
        
        // 调整footer中的法律声明（如果存在）
        const legalNotice = document.querySelector('footer .legal-notice');
        if (legalNotice) {
            legalNotice.style.marginTop = '20px'; // 固定间距
        }
        
    } catch (error) {
        console.warn('布局调整出错:', error);
    }
}

// Banner关闭后的布局调整
function adjustLayoutAfterBannerClosed() {
    try {
        // 调整main区域的padding-top
        const main = document.querySelector('main');
        if (main) {
            // Banner关闭后减少顶部padding
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : (window.innerWidth <= 956 ? 60 : 80);
            main.style.paddingTop = (headerHeight + 20) + 'px'; // 减少间距
        }
        
        // 调整tools-section的margin-top
        const toolsSections = document.querySelectorAll('.tools-section');
        toolsSections.forEach((section, index) => {
            // 根据屏幕尺寸设置不同的间距
            let marginTop = 20; // 减少默认间距
            if (window.innerWidth <= 480) {
                marginTop = 15;
            } else if (window.innerWidth <= 767) {
                marginTop = 15;
            } else if (window.innerWidth <= 956) {
                marginTop = 15;
            }
            
            // 所有section使用相同的顶部间距
            section.style.marginTop = marginTop + 'px';
        });
        
        // 调整锚点滚动偏移量
        const scrollTargets = document.querySelectorAll('#tools, #software, #proxy');
        scrollTargets.forEach(target => {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : (window.innerWidth <= 956 ? 60 : 80);
            target.style.scrollMarginTop = (headerHeight + 15) + 'px';
        });
        
        // 调整footer中的法律声明（如果存在）
        const legalNotice = document.querySelector('footer .legal-notice');
        if (legalNotice) {
            legalNotice.style.marginTop = '20px'; // 固定间距
        }
        
    } catch (error) {
        console.warn('Banner关闭后布局调整出错:', error);
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 清理函数
export function destroyLayoutAdjuster() {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
    if (mutationObserver) {
        mutationObserver.disconnect();
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayoutAdjuster);
} else {
    initLayoutAdjuster();
}