// 导航处理模块

// 初始化导航处理
export function initNavigation() {
    // 确保页面加载时滚动到顶部
    window.scrollTo(0, 0);
    
    // 监听页面加载完成事件，确保滚动到顶部
    if (document.readyState === 'complete') {
        window.scrollTo(0, 0);
    } else {
        window.addEventListener('load', () => {
            window.scrollTo(0, 0);
        });
    }
    const toggleButton = document.getElementById('toggleButton');
    const navLinks = document.getElementById('navLinks');
    const bannerNotice = document.querySelector('.banner-notice');

    // 切换菜单示/隐藏
    toggleButton.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // 调整banner位置
        adjustBannerPosition();
    });

    // 点击导航链接时关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleButton.classList.remove('active');
            navLinks.classList.remove('active');
            // 调整banner位置
            adjustBannerPosition();
        });
    });

    // 点击页面其他地方时关闭菜单
    document.addEventListener('click', (event) => {
        if (!toggleButton.contains(event.target) && !navLinks.contains(event.target)) {
            toggleButton.classList.remove('active');
            navLinks.classList.remove('active');
            // 调整banner位置
            adjustBannerPosition();
        }
    });

    // 移动端处理
    if (window.innerWidth <= 768) {
        navLinks.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                toggleButton.classList.remove('active');
                navLinks.classList.remove('active');
                // 调整banner位置
                adjustBannerPosition();
            }
        });
    }

    // 滚动时收起菜单
    window.addEventListener('scroll', () => {
        if (navLinks.classList.contains('active')) {
            toggleButton.classList.remove('active');
            navLinks.classList.remove('active');
            // 调整banner位置
            adjustBannerPosition();
        }
    });

    // 窗口大小改变时调整banner位置
    window.addEventListener('resize', () => {
        adjustBannerPosition();
    });

    // 修改导航链接点击事件
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            
            // 关闭移动端菜单
            toggleButton.classList.remove('active');
            navLinks.classList.remove('active');
            
            // 检查是否为外部链接或特殊链接
            if (target.startsWith('http') || target.startsWith('https') || target.startsWith('javascript:')) {
                // 对于外部链接，保持默认行为
                return true;
            }
            
            // 处理内部锚点链接
            if (target && target.startsWith('#')) {
                e.preventDefault(); // 只对内部锚点阻止默认行为
                const targetElement = document.querySelector(target);
                
                if (targetElement) {
                    // 获取header的高度
                    const headerHeight = document.querySelector('header').offsetHeight;
                    // 计算目标位置，考虑header高度
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    // 执行平滑滚动
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 初始化时调整banner位置
    adjustBannerPosition();
}

// 调整banner位置的函数
function adjustBannerPosition() {
    const bannerNotice = document.querySelector('.banner-notice');
    if (!bannerNotice) return;
    
    // 检查是否在移动端
    if (window.innerWidth <= 956) {
        const navLinks = document.getElementById('navLinks');
        const header = document.querySelector('header');
        
        if (navLinks && navLinks.classList.contains('active')) {
            // 当导航菜单展开时，banner应该在导航菜单下方
            const headerHeight = header ? header.offsetHeight : 60;
            const navLinksHeight = navLinks.offsetHeight;
            bannerNotice.style.top = (headerHeight + navLinksHeight) + 'px';
        } else {
            // 当导航菜单收起时，banner紧贴在header下方
            const headerHeight = header ? header.offsetHeight : 60;
            bannerNotice.style.top = headerHeight + 'px';
        }
    } else {
        // 在桌面端，banner始终在header下方
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 80;
        bannerNotice.style.top = headerHeight + 'px';
    }
}

// 初始化显示切换
export function initDisplayToggle() {
    function handleDisplayToggle() {
        const isMobile = window.innerWidth <= 930;
        document.querySelectorAll('table').forEach(table => {
            table.style.display = isMobile ? 'none' : 'table';
        });
        document.querySelectorAll('.mobile-grid').forEach(grid => {
            grid.style.display = isMobile ? 'grid' : 'none';
        });
    }

    // 初始化显示
    handleDisplayToggle();

    // 监听窗口大小变化
    window.addEventListener('resize', handleDisplayToggle);
}