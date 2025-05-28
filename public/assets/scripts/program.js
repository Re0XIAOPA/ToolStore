import { NavScroll } from './modules/nav-scroll.js';

import { initNoticeHandler } from './modules/notice-handler.js';
import { initNavigation, initDisplayToggle } from './modules/nav-handler.js';
import { initAirportCards } from './modules/airport-modal.js';
import { initSoftwareCards } from './modules/software-cards.js';
import { initCardRenderer } from './modules/card-renderer.js';
import { initRippleEffect } from './modules/ripple-effect.js';

// 全局ESC键监听功能
function setupGlobalEscKeyListener() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            // 获取当前打开的弹窗
            // 排除公告弹窗
            const dailyNotice = document.getElementById('dailyNotice');
            const isNoticeVisible = dailyNotice && dailyNotice.style.display === 'flex';
            
            // 如果公告弹窗正在显示，不做任何操作
            if (isNoticeVisible) {
                return;
            }
            
            // 检查并关闭机场弹窗
            const airportModal = document.querySelector('.airport-modal.active');
            if (airportModal) {
                const closeButton = airportModal.querySelector('.close-modal');
                if (closeButton) {
                    closeButton.click();
                    return;
                }
            }
            
            // 检查并关闭下载弹窗
            const downloadModal = document.querySelector('.download-modal.active');
            if (downloadModal) {
                const closeButton = downloadModal.querySelector('.close-modal');
                if (closeButton) {
                    closeButton.click();
                    return;
                }
            }
            
            // 检查并关闭反馈弹窗相关元素
            const feedbackElement = document.querySelector('.feedback-modal');
            if (feedbackElement && feedbackElement.style.display === 'block') {
                // 触发反馈模块自身的关闭方法
                // 这里假设反馈模块已经有ESC键处理，如果没有可以手动关闭
                return;
            }
            
            // 检查并关闭任何具有modal-backdrop的元素
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                // 寻找对应的关闭按钮
                const modalWithBackdrop = document.querySelector('.modal-content-enter');
                if (modalWithBackdrop) {
                    const closeButton = modalWithBackdrop.querySelector('.close-modal');
                    if (closeButton) {
                        closeButton.click();
                        return;
                    }
                }
                
                // 如果找不到特定的关闭按钮，则移除背景遮罩
                document.body.removeChild(backdrop);
                document.body.classList.remove('modal-open');
                document.body.classList.add('modal-closed');
            }
        }
    });
}

// 使复制函数在全局可用

console.log('Hello World!');

// 主程序入口点 - 使用模块化方式初始化所有功能
// 所有模块已移至独立文件，这里只保留主程序逻辑
import { initMainContent } from './modules/main-content.js';

// 统一的DOMContentLoaded事件处理
document.addEventListener('DOMContentLoaded', function () {
    // 防止重复初始化
    if (window.appInitialized) {
        // console.log('应用已初始化，跳过重复初始化');
        return;
    }

    // 立即滚动到顶部
    window.scrollTo(0, 0);

    // 添加setTimeout确保滚动在所有布局计算完成后执行
    setTimeout(() => {
        window.scrollTo(0, 0);
        new NavScroll();
    }, 0);
    
    // 再次添加一个延迟更长的滚动，确保在所有资源加载后执行
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);

    // 确保页面刷新后也回到顶部
    window.addEventListener('beforeunload', () => {
        window.scrollTo(0, 0);
    });

    // 初始化各个模块
    initNavigation();
    initDisplayToggle();
    initNoticeHandler();

    // 初始化主内容区域（模块化处理）
    initMainContent();
    
    // 初始化卡片渲染器 - 动态生成卡片内容（新方式）
    // 所有卡片渲染、推荐系统初始化都在这里完成
    initCardRenderer();

    // 初始化机场卡片和软件卡片点击事件
    initAirportCards();
    initSoftwareCards();
    
    // 初始化波纹效果
    initRippleEffect();
    
    // 初始化ESC键全局监听功能
    setupGlobalEscKeyListener();
    
    // 标记应用已初始化
    window.appInitialized = true;
    // console.log('应用初始化完成');
});

// 取消按钮点击事件
const cancelButton = document.querySelector('.cancel');
if (cancelButton) {
    cancelButton.addEventListener('click', () => {
        let cancelCount = parseInt(localStorage.getItem('cancelCount') || '0');
        cancelCount++;
        localStorage.setItem('cancelCount', cancelCount.toString());

        const remainingTries = MAX_CANCEL_COUNT - cancelCount;

        if (cancelCount >= MAX_CANCEL_COUNT) {
            dailyNotice.style.display = 'none';
            canceledMessage.style.display = 'flex';
            mask.style.display = 'block';
            disableAllNavigation(true);
            disablePageInteraction(true);
            return;
        }

        // 立即更新并显示警告消息
        updateWarningMessage(remainingTries);
        setTimeout(() => {
            warningMessage.style.display = 'none';
        }, 2000);
    });
}

// 所有功能函数已移至独立模块文件


