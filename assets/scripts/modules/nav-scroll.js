// 创建新文件处理导航滚动
export class NavScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        this.headerHeight = document.querySelector('header').offsetHeight;
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                // 计算目标位置，考虑header高度
                const targetPosition = targetElement.offsetTop - this.headerHeight - 20;

                // 平滑滚动
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 如果是移动端，点击后关闭菜单
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }
} 