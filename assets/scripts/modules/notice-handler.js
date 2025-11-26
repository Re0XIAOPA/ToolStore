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
        // 允许公告弹窗内的滚动
        const isInNotice = e.target.closest && e.target.closest('#dailyNotice');
        if (isInNotice) {
            return; // 不阻止公告弹窗内的滚动
        }
        
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        window.scrollTo(0, scrollPosition);
    }

    // 禁用所有导航和链接
    function disableAllNavigation(disable = true) {
        // 禁用导航链接（排除公告区域内的链接）
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            // 检查链接是否在公告区域内
            const isInNotice = link.closest && (link.closest('#dailyNotice') || link.closest('.banner-notice'));
            
            // 只对不在公告区域内的链接应用透明度
            if (!isInNotice) {
                if (disable) {
                    link.style.opacity = '0.5';
                } else {
                    link.style.opacity = '';
                }
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

    // 页面切换函数
    function switchPage(pageNumber) {
        // 隐藏所有页面
        const pages = document.querySelectorAll('.notice-page');
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示指定页面
        const targetPage = document.getElementById(`page${pageNumber}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // 更新页面指示器
        const pageIndicator = document.querySelector('.page-indicator .page-number');
        if (pageIndicator) {
            pageIndicator.textContent = `${pageNumber}/2`;
        }
        
        // 如果是第二页，检查滚动位置以启用"我已知晓"按钮
        if (pageNumber === 2) {
            checkScrollPosition();
        }
    }
    
    // 检查免责声明页面的滚动位置
    function checkScrollPosition() {
        const disclaimerContent = document.querySelector('.disclaimer-content');
        const acknowledgeBtn = document.querySelector('.buttons .acknowledge');
        
        if (disclaimerContent && acknowledgeBtn) {
            const { scrollTop, scrollHeight, clientHeight } = disclaimerContent;
            const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 5;
            
            if (isScrolledToBottom) {
                acknowledgeBtn.disabled = false;
            } else {
                acknowledgeBtn.disabled = true;
            }
        }
    }
    
    // 绑定页面切换事件
    function bindPageSwitchEvents() {
        // 下一页按钮
        const nextButtons = document.querySelectorAll('.next-page');
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nextPage = button.dataset.next;
                if (nextPage) {
                    switchPage(nextPage);
                }
            });
        });
        
        // 上一页按钮
        const prevButtons = document.querySelectorAll('.prev-page');
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prevPage = button.dataset.prev;
                if (prevPage) {
                    switchPage(prevPage);
                }
            });
        });
        
        // 免责声明内容滚动事件
        const disclaimerContent = document.querySelector('.disclaimer-content');
        if (disclaimerContent) {
            disclaimerContent.addEventListener('scroll', checkScrollPosition);
        }
    }
    
    // 总是显示公告
    dailyNotice.style.display = 'flex';
    mask.style.display = 'block';
    disableAllNavigation(true);
    disablePageInteraction(true);
    
    // 显示第一页
    switchPage(1);
    
    // 绑定页面切换事件
    bindPageSwitchEvents();

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
    const cancelButtons = document.querySelectorAll('.cancel');
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            let cancelCount = parseInt(localStorage.getItem('cancelCount') || '0');
            cancelCount++;
            localStorage.setItem('cancelCount', cancelCount.toString());

            const remainingTries = MAX_CANCEL_COUNT - cancelCount - 1;

            // 如果剩余次数大于0，显示警告消息
            if (remainingTries > 0) {
                // 立即更新并显示警告消息
                updateWarningMessage(remainingTries);
                setTimeout(() => {
                    warningMessage.style.display = 'none';
                }, 2000);
            } else {
                // 剩余次数为0或小于0，直接显示取消消息
                dailyNotice.style.display = 'none';
                canceledMessage.style.display = 'flex';
                mask.style.display = 'block';
                disableAllNavigation(true);
                disablePageInteraction(true);
                
                // 添加重试按钮的点击事件
                setupRetryButton();
            }
        });
    });
    
    // 设置重试按钮点击事件
    function setupRetryButton() {
        const retryButton = document.getElementById('retryButton');
        if (retryButton && !retryButton.hasAttribute('data-listener-added')) {
            retryButton.addEventListener('click', () => {
                // 重置取消计数器
                localStorage.setItem('cancelCount', '0');
                // 刷新页面
                window.location.reload();
            });
            retryButton.setAttribute('data-listener-added', 'true');
        }
    }
    
    // 初始化时检查是否需要设置重试按钮
    setupRetryButton();
}