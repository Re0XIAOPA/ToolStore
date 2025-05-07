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

            // 根据是否推荐排序
            cards.sort((a, b) => {
                const aRecommended = a.dataset.recommended === 'true';
                const bRecommended = b.dataset.recommended === 'true';

                if (aRecommended && !bRecommended) return -1;
                if (!aRecommended && bRecommended) return 1;
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
        return this.config[section]?.some(item =>
            item.toLowerCase() === cardTitle.toLowerCase()
        );
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