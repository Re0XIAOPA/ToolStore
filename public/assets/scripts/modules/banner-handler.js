// Banner处理模块
// 处理banner的关闭功能
// Banner显示在header内部，通过flex-direction: column自然垂直排列

// 导入配置文件
import { bannerConfig } from '../../config/banner-config.js';

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
    const closeWrapper = document.querySelector('.banner-close-wrapper');
    const banner = document.querySelector('.banner-notice');
    
    // 根据配置控制关闭按钮显示
    if (closeBtn && closeWrapper) {
        if (bannerConfig.showCloseButton) {
            closeWrapper.style.display = 'block';
            // 如果存在关闭按钮和banner，则绑定点击事件
            if (banner) {
                closeBtn.addEventListener('click', function() {
                    closeBanner(banner);
                });
            }
        } else {
            closeWrapper.style.display = 'none';
        }
    }
    
    // 显示banner（默认情况下应该显示）
    showBanner();
}

// 关闭banner函数
function closeBanner(bannerElement) {
    // 添加关闭动画 - 淡出和高度收缩
    bannerElement.style.opacity = '0';
    bannerElement.style.maxHeight = '0';
    bannerElement.classList.remove('banner-visible');
    
    // 延迟完全隐藏
    setTimeout(() => {
        bannerElement.style.display = 'none';
        
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
    const legalNotice = document.querySelector('.legal-notice');
    
    if (banner) {
        // 先设置display，然后添加visible类触发动画
        banner.style.display = 'block';
        
        // 使用setTimeout确保display生效后再添加动画类
        setTimeout(() => {
            banner.classList.add('banner-visible');
        }, 10);
    }
    
    if (legalNotice) {
        legalNotice.style.display = 'block';
    }
    
    // 通知其他模块调整布局
    window.dispatchEvent(new CustomEvent('bannerOpened'));
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBannerHandler);
} else {
    initBannerHandler();
}
