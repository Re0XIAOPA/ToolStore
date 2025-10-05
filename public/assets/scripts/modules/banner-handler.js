// Banner处理模块
// 处理banner的关闭功能和其他交互

// 初始化banner处理
export function initBannerHandler() {
    // 页面加载完成后绑定事件
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindBannerEvents);
    } else {
        bindBannerEvents();
    }
}

// 绑定banner相关事件
function bindBannerEvents() {
    // 获取关闭按钮
    const closeBtn = document.getElementById('bannerCloseBtn');
    const banner = document.querySelector('.banner-notice');
    
    // 如果存在关闭按钮和banner，则绑定点击事件
    if (closeBtn && banner) {
        closeBtn.addEventListener('click', function() {
            closeBanner(banner);
        });
    }
    
    // 不再检查本地存储状态，每次页面加载都显示banner
}

// 关闭banner函数
function closeBanner(bannerElement) {
    // 添加关闭动画
    bannerElement.style.opacity = '0';
    bannerElement.style.transform = 'translateY(-20px)';
    bannerElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // 延迟移除元素
    setTimeout(() => {
        bannerElement.style.display = 'none';
        
        // 不再保存关闭状态到本地存储
        // localStorage.setItem('bannerClosed', 'true');
        
        // 通知其他模块调整布局
        window.dispatchEvent(new CustomEvent('bannerClosed'));
    }, 300);
}

// 检查banner关闭状态
function checkBannerClosedState() {
    // 移除此函数的内容，不再检查本地存储状态
    // 每次页面加载都应该显示banner
}

// 重置banner关闭状态（可用于开发或测试）
export function resetBannerState() {
    // 不再需要此函数
}

// 显示banner（可用于重新显示已关闭的banner）
export function showBanner() {
    const banner = document.querySelector('.banner-notice');
    if (banner) {
        banner.style.display = 'block';
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
        // 添加过渡效果确保显示时也平滑
        banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        // 不再需要清除本地存储
        // localStorage.removeItem('bannerClosed');
        
        // 通知其他模块调整布局
        window.dispatchEvent(new CustomEvent('bannerOpened'));
    }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBannerHandler);
} else {
    initBannerHandler();
}