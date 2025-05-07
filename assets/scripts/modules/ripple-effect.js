// 波纹效果模块

/**
 * 初始化波纹效果
 * 为卡片添加点击波纹动画效果
 */
export function initRippleEffect() {
    // 获取所有工具卡片
    const cards = document.querySelectorAll('.card');
    
    // 为每个卡片添加点击事件监听器
    cards.forEach(card => {
        card.addEventListener('click', createRippleEffect);
    });
}

/**
 * 创建波纹效果
 * 在点击位置创建波纹动画
 * @param {Event} event - 点击事件对象
 */
function createRippleEffect(event) {
    // 检查是否已经有波纹元素
    const ripple = this.querySelector('.ripple');
    if (ripple) {
        // 如果已经有波纹，移除它
        ripple.remove();
    }
    
    // 创建一个新的波纹元素
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    this.appendChild(circle);
    
    // 获取卡片的尺寸和位置信息
    const rect = this.getBoundingClientRect();
    
    // 计算波纹的最大直径
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;
    
    // 设置波纹的尺寸
    circle.style.width = circle.style.height = `${diameter}px`;
    
    // 计算波纹的位置
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;
    
    // 设置波纹的位置
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    
    // 动画结束后移除波纹元素
    circle.addEventListener('animationend', function() {
        this.remove();
    });
}

// 导出模块
export default { initRippleEffect }; 