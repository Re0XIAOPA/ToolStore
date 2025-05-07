// 导入机场配置
import { airportDetails } from '../configs/airport-config.js';

// 创建机场详情弹窗
function createAirportModal(airportName) {
    const details = airportDetails[airportName];
    if (!details) return;

    const existingModal = document.querySelector('.airport-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 创建背景遮罩
    createBackdrop();

    const modal = document.createElement('div');
    modal.className = 'airport-modal';

    const content = `
        <div class="airport-content modal-content-enter">
            <button class="close-modal" aria-label="关闭">×</button>
            <div class="airport-header">
                <h3>${airportName}</h3>
                <div class="airport-tags">
                    ${details.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>

                <div class="packages-section">
                    <div class="packages-content">
                        ${createPriceTags(details.packages)}
                    </div>
                </div>
            </div>
            <div class="airport-body">
                <div class="features-section">
                    <div class="section-title">
                        <svg viewBox="0 0 24 24">
                            <path fill="#7c8aff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        详细说明
                    </div>
                    <div class="description-section">
                        <div class="airport-description">${details.description}</div>
                    </div>
                </div>
            </div>
            <div class="airport-actions">
                <button class="action-button visit-button">
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>
                    </svg>
                    访问官网
                </button>
                <button class="action-button cancel-button">取消</button>
            </div>
        </div>
    `;

    modal.innerHTML = content;
    document.body.appendChild(modal);

    // 禁用背景滚动
    document.body.classList.add('modal-open');
    document.body.classList.remove('modal-closed');

    setTimeout(() => modal.classList.add('active'), 10);

    // 事件处理
    const closeModal = () => {
        const contentElement = modal.querySelector('.airport-content');
        
        // 添加退场动画
        if (contentElement) {
            contentElement.classList.remove('modal-content-enter');
            contentElement.classList.add('modal-content-exit');
        }
        
        // 延迟移除模态框
        setTimeout(() => {
            modal.classList.remove('active');
            
            // 再次延迟，等待淡出动画完成
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    modal.remove();
                }
                
                // 移除背景遮罩
                removeBackdrop();
                
                // 恢复背景滚动
                document.body.classList.remove('modal-open');
                document.body.classList.add('modal-closed');
            }, 0);
        }, 0);
    };

    // 关闭按钮事件
    modal.querySelector('.close-modal').addEventListener('click', closeModal);

    // 点击外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 访问官网按钮事件
    modal.querySelector('.visit-button').addEventListener('click', () => {
        window.open(details.link, '_blank');
    });

    // 取消按钮事件
    modal.querySelector('.cancel-button').addEventListener('click', closeModal);
}

// 创建背景遮罩层
function createBackdrop() {
    // 检查是否已存在遮罩层
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        document.body.appendChild(backdrop);
    }
    
    // 显示遮罩层
    backdrop.style.display = 'block';
    
    // 禁用页面滚动
    document.body.classList.add('modal-open');
    document.body.classList.remove('modal-closed');
    
    // 强制回流后添加显示类
    setTimeout(() => {
        backdrop.classList.add('show');
    }, 10);
    
    return backdrop;
}

// 移除背景遮罩层
function removeBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        // 移除显示类，触发淡出效果
        backdrop.classList.remove('show');
        
        // 完全移除元素
        setTimeout(() => {
            if (document.body.contains(backdrop)) {
                document.body.removeChild(backdrop);
            }
            
            // 确保页面可以滚动
            document.body.classList.remove('modal-open');
            document.body.classList.add('modal-closed');
        }, 300);
    }
}

// 添加机场卡片点击事件处理
function initAirportCards() {
    const proxySection = document.querySelector('#proxy');
    if (!proxySection) return;

    const cards = proxySection.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const airportName = card.querySelector('.card-title').textContent;
            createAirportModal(airportName);
        });
    });
}

// 修改价格标签渲染函数
function createPriceTags(packages) {
    if (!packages || !packages.length) return '';

    return `
        <div class="packages-content">
            ${packages.map(pkg => `
                <div class="package-row">
                    <div class="package-name">${pkg.name}</div>
                    <div class="package-price">
                        <span class="price-currency">¥</span>
                        <span class="price-amount">${pkg.price}</span>
                        <span class="price-period">/${pkg.period}</span>
                    </div>
                    <div class="package-traffic">${pkg.traffic}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 解析价格文本的辅助函数
function parsePriceText(text) {
    // 示例: "¥15.60/年 200G/月"
    const match = text.match(/¥(\d+\.?\d*)\/(年|月)\s*(\d+G\/月)/);
    if (match) {
        return [match[1], match[2], match[3]];
    }
    return [text, '', ''];
}

// 导出函数
export { initAirportCards, createAirportModal };