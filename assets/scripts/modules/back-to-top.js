// 返回顶部按钮功能模块
export class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.scrollThreshold = 300; // 滚动多少像素后显示按钮
        this.init();
    }

    init() {
        if (!this.button) return;

        // 监听滚动事件
        window.addEventListener('scroll', () => {
            this.toggleButtonVisibility();
        });

        // 点击事件处理
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });

        // 初始检查按钮是否应该可见
        this.toggleButtonVisibility();
    }

    // 控制按钮的可见性
    toggleButtonVisibility() {
        if (window.scrollY > this.scrollThreshold) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    // 滚动到顶部的动画
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
}); 