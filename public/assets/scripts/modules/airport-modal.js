// 导入机场配置
import { airportData } from '../configs/airports-data.js';
import { allCardData } from '../configs/card-data.js';

// 创建机场详情弹窗
function createAirportModal(airportName) {
    // 从 airportData 中查找机场信息
    const details = airportData.find(airport => airport.name === airportName);
    if (!details) return;

    const existingModal = document.querySelector('.airport-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 创建背景遮罩
    createBackdrop();

    // 检查是否有任何套餐包含速率信息
    const hasSpeedInfo = details.packages && details.packages.some(pkg => pkg.speed);

    // 检查是否存在packages或moreContent
    const hasPackages = details.packages && details.packages.length > 0;
    const hasMoreContent = details.moreContent && (details.moreContent.text || details.moreContent.images);

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

                ${hasPackages ? `
                <div class="packages-section">
                    <div class="packages-content">
                        ${createPriceTags(details.packages)}
                    </div>
                </div>` : ''}
                
                ${hasMoreContent ? `
                <div class="packages-more">
                    ${createMoreContent(details.moreContent)}
                </div>` : ''}
                
                ${hasSpeedInfo ? `
                    <div class="speed-info">
                        <div class="speed-info-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="#7c8aff" d="M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z" />
                            </svg>
                        </div>
                        <div class="speed-info-text">
                            此机场提供<strong>不同速率限制</strong>的套餐选择，请注意各套餐对应的<strong>网络速率</strong>，选择适合您需求的套餐。
                        </div>
                    </div>
                    ` : ''}
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
                    ${details.warning ? `
                    <div class="warning-section">
                        <div class="warning-icon">
                            <svg viewBox="0 0 24 24">
                                <path fill="#ff8a50" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>
                        </div>
                        <div class="warning-text">${details.warning}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="airport-actions">
                <button class="action-button visit-button">
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>
                    </svg>
                    ${allCardData.proxy.linkText}
                </button>
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

    // 直接返回套餐卡片，不再使用额外的包装div
    return packages.map(pkg => `
        <div class="package-row">
            <div class="package-name">${pkg.name}</div>
            <div class="package-price">
                <span class="price-currency">¥</span>
                <span class="price-amount">${pkg.price}</span>
                <span class="price-period">/${pkg.period}</span>
            </div>
            <div class="package-traffic">${pkg.traffic}</div>
            ${pkg.speed ? `
            <div class="package-speed">
                <svg class="speed-icon" viewBox="0 0 24 24">
                    <path fill="#96a1ff" d="M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z" />
                </svg>
                ${pkg.speed}
            </div>` : ''}
        </div>
    `).join('');
}

// 新增创建更多内容区域的函数
function createMoreContent(moreContent) {
    if (!moreContent) return '';
    
    let contentHtml = '<div class="more-content-section">';
    
    // 如果有文本内容
    if (moreContent.text) {
        contentHtml += `<div class="more-content-text">${moreContent.text}</div>`;
    }
    
    // 如果有图片内容
    if (moreContent.images && moreContent.images.length > 0) {
        contentHtml += '<div class="more-content-images">';
        moreContent.images.forEach(img => {
            if (img.url) {
                contentHtml += `<img src="${img.url}" alt="${img.alt || ''}" class="more-content-image"${img.width ? ` width="${img.width}"` : ''}${img.height ? ` height="${img.height}"` : ''}>`;
            }
        });
        contentHtml += '</div>';
    }
    
    contentHtml += '</div>';
    
    return contentHtml;
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