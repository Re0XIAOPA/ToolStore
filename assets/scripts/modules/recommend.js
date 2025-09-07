import { recommendConfig } from '../configs/recommend-config.js';

export class RecommendManager {
    constructor() {
        this.config = recommendConfig;
    }

    init() {
        this.addRecommendBadges();
        this.sortRecommendedCards();
    }

    addRecommendBadges() {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title')?.textContent.trim();
            if (!cardTitle) return;

            const section = this.getCardSection(card);
            if (!section) return;

            if (this.isRecommended(cardTitle, section)) {
                this.addBadgeToCard(card);
                // 添加推荐标记
                card.dataset.recommended = 'true';
            }
        });
    }

    sortRecommendedCards() {
        // 获取所有区域
        const sections = ['tools', 'software', 'proxy'];

        sections.forEach(sectionId => {
            const container = document.querySelector(`#${sectionId} .grid-container`);
            if (!container) return;

            // 获取该区域的所有卡片
            const cards = Array.from(container.children);

            // 根据推荐状态和热度排序
            cards.sort((a, b) => {
                const aRecommended = a.dataset.recommended === 'true';
                const bRecommended = b.dataset.recommended === 'true';
                
                // 首先按推荐状态排序，推荐的在前
                if (aRecommended && !bRecommended) return -1;
                if (!aRecommended && bRecommended) return 1;
                
                // 如果都是推荐的，按 hot 值排序
                if (aRecommended && bRecommended) {
                    const aTitle = a.querySelector('.card-title')?.textContent.trim();
                    const bTitle = b.querySelector('.card-title')?.textContent.trim();
                    const aHot = this.getHotValue(aTitle, sectionId);
                    const bHot = this.getHotValue(bTitle, sectionId);
                    
                    // 如果都有 hot 值，按 hot 值升序排列（数字越小越靠前）
                    if (aHot !== null && bHot !== null) {
                        return aHot - bHot;
                    }
                    // 有 hot 值的排在没有 hot 值的前面
                    if (aHot !== null && bHot === null) return -1;
                    if (aHot === null && bHot !== null) return 1;
                    // 都没有 hot 值，保持原顺序
                    return 0;
                }
                
                // 都不是推荐的，保持原顺序
                return 0;
            });

            // 重新添加排序后的卡片
            cards.forEach(card => {
                container.appendChild(card);
            });

            // 添加过渡动画
            cards.forEach(card => {
                card.style.transition = 'all 0.3s ease';
            });
        });
    }

    getCardSection(card) {
        if (card.closest('#tools')) return 'tools';
        if (card.closest('#software')) return 'software';
        if (card.closest('#proxy')) return 'proxy';
        return null;
    }

    isRecommended(cardTitle, section) {
        return this.config[section]?.some(item => {
            const itemName = typeof item === 'string' ? item : item.name;
            return itemName.toLowerCase() === cardTitle.toLowerCase();
        });
    }

    getHotValue(cardTitle, section) {
        const item = this.config[section]?.find(item => {
            const itemName = typeof item === 'string' ? item : item.name;
            return itemName.toLowerCase() === cardTitle.toLowerCase();
        });
        
        if (!item) return null;
        if (typeof item === 'string') return null;
        return item.hot || null;
    }

    addBadgeToCard(card) {
        card.style.position = 'relative';

        const badge = document.createElement('div');
        badge.className = 'recommend-badge';

        card.appendChild(badge);

        // 添加动画效果
        requestAnimationFrame(() => {
            card.style.transform = 'scale(1.02)';
            card.style.transition = 'transform 0.3s ease';

            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 300);
        });
    }
} 