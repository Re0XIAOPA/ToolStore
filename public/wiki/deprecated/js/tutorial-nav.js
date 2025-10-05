/**
 * 教程导航栏功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏切换按钮
    const toggleButton = document.getElementById('toggleButton');
    const navLinks = document.getElementById('navLinks');
    
    // 移动端导航栏切换
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
    }
    
    // 平滑滚动功能
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 如果在移动端，点击后关闭导航菜单
                    if (window.innerWidth < 768 && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        toggleButton.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // 当前页面导航项高亮
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || 
            (currentPath.includes('/doc/') && link.textContent === '教程')) {
            link.classList.add('active');
        }
    });
}); 