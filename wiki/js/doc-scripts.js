/**
 * 文档站功能脚本
 */
document.addEventListener('DOMContentLoaded', function() {
    // 侧边栏功能
    initSidebar();
    
    // 目录导航
    initTableOfContents();
    
    // 图片预览
    initImagePreview();
    
    // 返回顶部按钮
    initBackToTop();
    
    // 滚动监听，高亮当前阅读的部分
    initScrollSpy();
    
    // 移动端菜单处理
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileFeedbackModal = document.getElementById('mobile-feedback-modal');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
        
        // 点击页面其他区域关闭菜单
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
    
    // 移动端邮箱反馈功能
    if (mobileFeedbackModal) {
        mobileFeedbackModal.addEventListener('click', function() {
            window.location.href = 'mailto:support@toolstore.com?subject=ToolStore%20反馈';
            mobileMenu.classList.remove('active');
        });
    }
});

/**
 * 侧边栏功能初始化
 */
function initSidebar() {
    // 侧边栏切换
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        // 检查是否已经绑定过事件，避免重复绑定
        if (!sidebarToggle.hasAttribute('data-initialized')) {
            sidebarToggle.addEventListener('click', function(e) {
                e.preventDefault(); // 防止事件冒泡
                e.stopPropagation(); // 阻止事件传播
                sidebar.classList.toggle('active');
                this.classList.toggle('active');
                
                // 添加动画效果
                if (sidebar.classList.contains('active')) {
                    sidebar.style.transition = 'left 0.3s ease';
                }
            });
            // 标记为已初始化
            sidebarToggle.setAttribute('data-initialized', 'true');
        }
    }
    
    // 点击空白处关闭侧边栏（仅限移动设备）
    if (!document.body.hasAttribute('data-sidebar-click-initialized')) {
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                sidebar && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                sidebarToggle && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                if (sidebarToggle) sidebarToggle.classList.remove('active');
            }
        });
        // 标记为已初始化
        document.body.setAttribute('data-sidebar-click-initialized', 'true');
    }
    
    // 分类折叠功能
    const categoryTitles = document.querySelectorAll('.category-title');
    
    categoryTitles.forEach(title => {
        // 检查是否已经绑定过事件，避免重复绑定
        if (!title.hasAttribute('data-initialized')) {
            title.addEventListener('click', function(e) {
                // 阻止事件冒泡，避免点击分类标题时触发其他事件
                e.stopPropagation();
                
                this.classList.toggle('collapsed');
                const navItems = this.nextElementSibling;
                if (navItems) {
                    navItems.classList.toggle('collapsed');
                    
                    // 给分类标题添加点击反馈效果
                    const ripple = document.createElement('span');
                    ripple.classList.add('ripple-effect');
                    this.appendChild(ripple);
                    
                    // 延迟移除效果
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                }
            });
            // 标记为已初始化
            title.setAttribute('data-initialized', 'true');
        }
    });
    
    // 标记当前页面对应的导航项为活跃状态
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item a');
    
    // 保存当前活跃的导航项
    let activeNavItem = null;
    
    // 获取当前路径，包括SPA模式下的路径
    const currentUrl = window.location.href;
    const spaPath = currentUrl.split('#')[0]; // 移除哈希部分，获取基本路径
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        
        // 为每个链接添加SPA处理
        if (!item.hasAttribute('data-spa-initialized')) {
            item.addEventListener('click', function(e) {
                // 如果不是外部链接，使用SPA加载
                if (!itemHref.startsWith('http') && typeof loadContent === 'function') {
                    e.preventDefault();
                    // 加载内容
                    loadContent(itemHref, true);
                    // 更新URL，不刷新页面
                    history.pushState({ path: itemHref }, '', itemHref);
                }
            });
            item.setAttribute('data-spa-initialized', 'true');
        }
        
        // 精确匹配当前路径或者当前路径以链接地址结尾
        if (itemHref === currentPath || 
            currentPath.endsWith(itemHref) ||
            spaPath.endsWith(itemHref)) {
            
            // 移除所有活跃状态
            navItems.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            
            // 保存当前项为活跃项
            activeNavItem = item.parentElement;
            
            // 添加活跃类
            activeNavItem.classList.add('active');
            
            // 确保包含当前项的分类是展开的
            const parentCategory = activeNavItem.closest('.nav-items');
            if (parentCategory && parentCategory.previousElementSibling) {
                parentCategory.classList.remove('collapsed');
                parentCategory.previousElementSibling.classList.remove('collapsed');
            }
            
            // 滚动到当前活跃项，确保它在视野中
            setTimeout(() => {
                if (sidebar && activeNavItem) {
                    sidebar.scrollTop = activeNavItem.offsetTop - 100;
                }
            }, 300);
        }
    });
}

/**
 * 目录导航初始化
 */
function initTableOfContents() {
    const mainContent = document.querySelector('.main-content');
    const tocContainer = document.querySelector('.table-of-contents .toc-list');
    
    if (!mainContent || !tocContainer) return;
    
    // 获取所有标题
    const headings = mainContent.querySelectorAll('h2, h3');
    
    // 如果没有标题，隐藏目录
    if (headings.length === 0) {
        const tocElement = document.querySelector('.table-of-contents');
        if (tocElement) {
            tocElement.style.display = 'none';
        }
        return;
    }
    
    // 清空现有目录
    tocContainer.innerHTML = '';
    
    // 为每个标题添加ID
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 创建目录项
        const tocItem = document.createElement('li');
        tocItem.className = `toc-item${heading.tagName === 'H3' ? ' sub-item' : ''}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        
        tocItem.appendChild(link);
        tocContainer.appendChild(tocItem);
    });
}

/**
 * 滚动监听功能
 */
function initScrollSpy() {
    const headings = document.querySelectorAll('.main-content h2, .main-content h3');
    const tocItems = document.querySelectorAll('.toc-item a');
    
    if (headings.length === 0 || tocItems.length === 0) return;
    
    // 使用 IntersectionObserver 监听标题进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                
                // 高亮对应的目录项
                tocItems.forEach(item => {
                    const href = item.getAttribute('href').substring(1);
                    
                    if (href === currentId) {
                        item.parentElement.classList.add('active');
                    } else {
                        item.parentElement.classList.remove('active');
                    }
                });
            }
        });
    }, { 
        rootMargin: '-80px 0px -80% 0px', // 顶部偏移，确保标题到达顶部才触发
        threshold: 0 
    });
    
    // 观察所有标题
    headings.forEach(heading => {
        observer.observe(heading);
    });
    
    // 点击目录项滚动到对应位置
    tocItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 更新URL，方便分享特定章节
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

/**
 * 图片预览功能初始化
 */
function initImagePreview() {
    // 获取模态框元素
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalContainer = modal ? modal.querySelector('.modal-container') : null;
    const captionText = document.getElementById('caption');
    const closeBtn = document.getElementById('closeModal');
    
    if (!modal || !modalImg) return;
    
    // 添加缩放控制
    let zoomControls = document.querySelector('.zoom-controls');
    if (!zoomControls) {
        zoomControls = document.createElement('div');
        zoomControls.className = 'zoom-controls';
        zoomControls.innerHTML = `
            <button id="zoomIn" title="放大"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
            <button id="zoomOut" title="缩小"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M19 13H5v-2h14v2z"/></svg></button>
            <button id="zoomReset" title="原始大小"><svg width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M3 5v14h18V5H3zm16 12H5V7h14v10z"/></svg></button>
        `;
        if (modalContainer) {
            modalContainer.appendChild(zoomControls);
        } else {
            modal.appendChild(zoomControls);
        }
    }
    
    // 创建图片容器，用于拖动
    let imageContainer = document.querySelector('.image-drag-container');
    if (!imageContainer && modalContainer) {
        imageContainer = document.createElement('div');
        imageContainer.className = 'image-drag-container';
        // 确保图片在容器内
        if (modalImg.parentNode !== imageContainer && modalImg.parentNode === modalContainer) {
            imageContainer.appendChild(modalImg);
            modalContainer.insertBefore(imageContainer, modalContainer.firstChild);
        }
    }
    
    // 当前缩放级别
    let currentZoom = 1;
    // 图片拖动相关变量
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    // 清除旧的事件监听器（避免重复绑定）
    const contentSectionImages = document.querySelectorAll('.content-section img');
    contentSectionImages.forEach(img => {
        const newImg = img.cloneNode(true);
        if (img.parentNode) {
            img.parentNode.replaceChild(newImg, img);
        }
    });
    
    // 修复图片路径，确保本地图片能够正确加载
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    document.querySelectorAll('.content-section img').forEach(img => {
        const src = img.getAttribute('src');
        // 如果是相对路径且以images/开头，尝试修复
        if (src && src.includes('images/') && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('./') && !src.startsWith('../')) {
            img.src = basePath + src;
        }
    });
    
    // 为所有内容区域的图片添加点击事件
    document.querySelectorAll('.content-section img').forEach(img => {
        if (!img.classList.contains('no-preview')) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                modal.style.display = 'block';
                modalImg.src = this.src;
                if (captionText) captionText.innerHTML = this.alt || '';
                document.body.style.overflow = 'hidden';
                
                // 确保预览不在最顶层
                modal.style.zIndex = '99999';
                
                // 重置缩放级别和位置
                currentZoom = 1;
                translateX = 0;
                translateY = 0;
                updateImageTransform();
                
                // 设置可拖动样式
                modalImg.style.cursor = 'grab';
                
                // 添加淡入动画
                modalImg.style.opacity = '0';
                setTimeout(() => {
                    modalImg.style.opacity = '1';
                }, 50);
            });
        }
    });
    
    // 更新图片变换的辅助函数
    function updateImageTransform() {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    }
    
    // 缩放功能
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const zoomResetBtn = document.getElementById('zoomReset');
    
    if (zoomInBtn) {
        // 使用onclick而不是addEventListener，避免多次绑定
        zoomInBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            currentZoom += 0.2;
            if (currentZoom > 3) currentZoom = 3; // 限制最大缩放倍数
            updateImageTransform();
        };
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            currentZoom -= 0.2;
            if (currentZoom < 0.5) currentZoom = 0.5; // 限制最小缩放倍数
            updateImageTransform();
        };
    }
    
    if (zoomResetBtn) {
        zoomResetBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
        };
    }
    
    // 鼠标滚轮控制缩放
    modalImg.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            // 向上滚动，放大
            currentZoom += 0.1;
            if (currentZoom > 3) currentZoom = 3;
        } else {
            // 向下滚动，缩小
            currentZoom -= 0.1;
            if (currentZoom < 0.5) currentZoom = 0.5;
        }
        updateImageTransform();
    });
    
    // 图片拖动功能 - 不需要放大也能拖动
    modalImg.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImg.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
    });
    
    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = 'grab';
        }
    });
    
    // 触摸设备支持
    modalImg.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateImageTransform();
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    // 关闭模态框
    function closeModal() {
        // 添加淡出动画
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = '1';
            document.body.style.overflow = '';
            // 重置缩放和位置
            currentZoom = 1;
            translateX = 0;
            translateY = 0;
            updateImageTransform();
            isDragging = false;
        }, 300);
    }
    
    // 点击关闭按钮
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeModal();
        });
    }
    
    // 关键：点击模态框背景关闭预览（直接绑定在modal上）
    modal.addEventListener('click', function(e) {
        // 仅当点击的是模态框自身，而不是其中的内容时关闭
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 添加导致模态框不关闭的元素
    if (modalContainer) {
        modalContainer.addEventListener('click', function(e) {
            // 阻止事件冒泡
            e.stopPropagation();
        });
    }
    
    // ESC 键关闭
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
    // 如果已存在按钮，则不重复创建
    if (document.querySelector('.back-to-top')) return;
    
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M8 4.5l6 6H2z"/></svg>';
    document.body.appendChild(backToTopBtn);
    
    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}