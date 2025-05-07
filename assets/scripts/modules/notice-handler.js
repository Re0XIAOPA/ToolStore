// 通知处理模块

// 初始化通知处理
export function initNoticeHandler() {
    const dailyNotice = document.getElementById('dailyNotice');
    const canceledMessage = document.getElementById('canceledMessage');
    const warningMessage = document.getElementById('warningMessage');
    const mask = document.getElementById('mask');
    const navLinks = document.getElementById('navLinks');
    const logo = document.querySelector('h1 a');
    const MAX_CANCEL_COUNT = 5;
    
    // 保存滚动位置
    let scrollPosition = 0;
    
    // 阻止滚动函数
    function preventScroll(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        window.scrollTo(0, scrollPosition);
    }

    // 禁用所有导航和链接
    function disableAllNavigation(disable = true) {
        // 禁用导航链接
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (disable) {
                link.style.opacity = '0.5';
            } else {
                link.style.opacity = '';
            }
        });

        // 禁用卡片点击
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (disable) {
                card.style.opacity = '0.5';
            } else {
                card.style.opacity = '';
            }
        });

        // 禁用 logo 点击
        if (logo) {
            logo.style.opacity = disable ? '0.5' : '';
        }
    }

    // 更新警告消息
    function updateWarningMessage(remainingTries) {
        warningMessage.innerHTML = `警告：再取消 ${remainingTries} 次将无法访问！`;
        warningMessage.style.display = 'flex';
        warningMessage.style.animation = 'none';
        warningMessage.offsetHeight; // 触发重排
        warningMessage.style.animation = 'slideDown 0.3s ease-out';
    }
    
    // 禁用页面滚动和交互
    function disablePageInteraction(disable = true) {
        if (disable) {
            // 保存当前滚动位置
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            
            // 设置body样式
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
            document.body.classList.add('modal-open');
            document.body.classList.remove('modal-closed');
            
            // 监听滚动事件
            window.addEventListener('scroll', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            window.addEventListener('mousewheel', preventScroll, { passive: false });
            window.addEventListener('DOMMouseScroll', preventScroll, { passive: false });
            
            // 获取所有交互元素
            const allElements = document.querySelectorAll('a, input, select, textarea, .card, button');
            
            // 遍历处理每个元素
            allElements.forEach(el => {
                // 检查元素是否在公告弹窗内
                const isInNotice = el.closest('#dailyNotice') !== null;
                const isInCanceledMsg = el.closest('#canceledMessage') !== null;
                const isInWarningMsg = el.closest('#warningMessage') !== null;
                
                // 只禁用不在弹窗内的元素
                if (!isInNotice && !isInCanceledMsg && !isInWarningMsg) {
                    el.style.pointerEvents = 'none';
                }
            });
        } else {
            // 恢复滚动和交互
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.classList.remove('modal-open');
            document.body.classList.add('modal-closed');
            
            // 恢复滚动位置
            window.scrollTo(0, scrollPosition);
            
            // 移除事件监听
            window.removeEventListener('scroll', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
            window.removeEventListener('mousewheel', preventScroll);
            window.removeEventListener('DOMMouseScroll', preventScroll);
            
            // 恢复所有元素的交互能力
            const allElements = document.querySelectorAll('a, input, select, textarea, .card, button');
            allElements.forEach(el => {
                el.style.pointerEvents = '';
            });
        }
    }

    // 总是显示公告
    dailyNotice.style.display = 'flex';
    mask.style.display = 'block';
    disableAllNavigation(true);
    disablePageInteraction(true);

    // 同意按钮点击事件
    document.querySelector('.acknowledge').addEventListener('click', () => {
        localStorage.setItem('hasAgreedToTerms', 'true');
        localStorage.setItem('lastAgreedDate', new Date().toDateString());
        dailyNotice.style.display = 'none';
        mask.style.display = 'none';
        document.querySelector('header').style.opacity = '1';
        disableAllNavigation(false);
        disablePageInteraction(false);
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
                
                // 添加重试按钮的点击事件
                const retryButton = document.getElementById('retryButton');
                if (retryButton) {
                    retryButton.addEventListener('click', () => {
                        // 重置取消计数器
                        localStorage.setItem('cancelCount', '0');
                        // 刷新页面
                        window.location.reload();
                    });
                }
                
                return;
            }

            // 立即更新并显示警告消息
            updateWarningMessage(remainingTries);
            setTimeout(() => {
                warningMessage.style.display = 'none';
            }, 2000);
        });
    }
    
    // 检查是否已存在重试按钮并添加事件监听
    const retryButton = document.getElementById('retryButton');
    if (retryButton) {
        retryButton.addEventListener('click', () => {
            // 重置取消计数器
            localStorage.setItem('cancelCount', '0');
            // 刷新页面
            window.location.reload();
        });
    }
}