// 回到顶部按钮功能
// 添加回到顶部按钮的内联样式
document.head.insertAdjacentHTML('beforeend', `
    <style>
        /* 回到顶部按钮基础样式 */
        .back-to-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #7c8aff, #6470cc);
            color: white;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(124, 138, 255, 0.4);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 9999;
            overflow: hidden;
            transform: translateY(20px);
        }
        
        /* 可见状态 */
        .back-to-top-btn.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        /* 悬停效果 */
        .back-to-top-btn:hover {
            background: linear-gradient(135deg, #8a96ff, #7c8aff);
            box-shadow: 0 6px 20px rgba(124, 138, 255, 0.6);
            transform: translateY(-5px);
        }
        
        /* 点击效果 */
        .back-to-top-btn:active {
            transform: translateY(-2px);
            box-shadow: 0 3px 10px rgba(124, 138, 255, 0.3);
            transition: all 0.1s;
        }
        
        /* 按钮内部的图标 */
        .back-to-top-btn svg {
            width: 24px;
            height: 24px;
            stroke: white;
            stroke-width: 2.5;
            transition: all 0.3s;
        }
        
        /* 悬停时图标效果 */
        .back-to-top-btn:hover svg {
            transform: translateY(-3px);
        }
        
        /* 点击时图标效果 */
        .back-to-top-btn:active svg {
            transform: translateY(0);
        }
        
        /* 波纹效果 */
        .back-to-top-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.7);
            opacity: 0;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        /* 点击激活波纹 */
        .back-to-top-btn.ripple::after {
            animation: ripple 0.6s ease-out;
        }
        
        /* 波纹动画 */
        @keyframes ripple {
            0% {
                width: 0;
                height: 0;
                opacity: 0.5;
            }
            100% {
                width: 300%;
                height: 300%;
                opacity: 0;
            }
        }
        
        /* 悬停时添加发光效果 */
        .back-to-top-btn:hover::before {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border-radius: 50%;
            background: transparent;
            border: 2px solid rgba(124, 138, 255, 0.3);
            animation: pulse 1.5s infinite;
        }
        
        /* 脉冲动画 */
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 0.8;
            }
            70% {
                transform: scale(1.1);
                opacity: 0.4;
            }
            100% {
                transform: scale(1);
                opacity: 0.8;
            }
        }
        
        /* 滚动进度指示器 */
        .back-to-top-btn .scroll-indicator {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            pointer-events: none;
        }
        
        .back-to-top-btn .scroll-indicator::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.2);
            transition: height 0.3s;
        }
        
        /* 移动设备适配 */
        @media (max-width: 768px) {
            .back-to-top-btn {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
            
            .back-to-top-btn svg {
                width: 20px;
                height: 20px;
            }
        }
    </style>
`);

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 查找按钮元素
    const backToTopButton = document.getElementById('backToTop');
    
    // 确保按钮存在
    if (!backToTopButton) {
        console.error('未找到回到顶部按钮元素');
        return;
    }
    
    // 创建滚动进度指示器
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    backToTopButton.appendChild(scrollIndicator);
    
    // 当页面滚动时检查是否显示按钮并更新滚动进度
    window.addEventListener('scroll', function() {
        // 计算页面滚动百分比
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollTop / scrollHeight;
        
        // 更新滚动进度指示器
        if (scrollIndicator.firstElementChild) {
            scrollIndicator.firstElementChild.style.height = `${scrollPercentage * 100}%`;
        }
        
        // 显示/隐藏按钮
        if (scrollTop > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // 添加点击波纹效果
    backToTopButton.addEventListener('click', function(e) {
        // 添加波纹类
        this.classList.add('ripple');
        
        // 点击动画效果
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // 滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 移除波纹类以便下次再次触发
        setTimeout(() => {
            this.classList.remove('ripple');
        }, 1000);
    });
    
    // 更换为更现代的SVG图标
    backToTopButton.innerHTML = `
        <div class="scroll-indicator"></div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20V7M12 7L6 13M12 7L18 13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    // 手动触发一次滚动事件以设置初始状态
    window.dispatchEvent(new Event('scroll'));
});