// 导入机场配置
import { airportData } from '../configs/airports-data.js';
import { allCardData } from '../configs/card-data.js';

// 创建机场详情页
function createAirportModal(airportName) {
    const details = airportData.find(airport => airport.name === airportName);
    if (!details) return;

    const existingModal = document.querySelector('.airport-modal');
    if (existingModal) existingModal.remove();

    const hasSpeedInfo = details.packages && details.packages.some(pkg => pkg.speed);
    const hasPackages = details.packages && details.packages.length > 0;
    const hasMoreContent = details.moreContent && details.moreContent.text;

    // 收集轮播图片（含标题）
    const carouselSlides = [];
    if (details.image && details.image.includes('/')) {
        carouselSlides.push({ url: details.image, alt: airportName });
    }
    if (details.moreContent && details.moreContent.images) {
        details.moreContent.images.forEach(img => carouselSlides.push({ url: img.url, alt: img.alt || '' }));
    }

    const hasCarousel = carouselSlides.length > 0;

    const modal = document.createElement('div');
    modal.className = 'airport-modal';

    const carouselHTML = hasCarousel ? `
        <div class="carousel" id="airportCarousel">
            <div class="carousel-track" id="carouselTrack">
                ${carouselSlides.map(s => `
                    <div class="carousel-slide">
                        <img src="${s.url}" alt="${s.alt || airportName}" draggable="false" />
                        ${s.alt ? `<div class="carousel-caption">${s.alt}</div>` : ''}
                    </div>
                `).join('')}
            </div>
            <button class="carousel-btn carousel-prev" id="carouselPrev" aria-label="上一张">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button class="carousel-btn carousel-next" id="carouselNext" aria-label="下一张">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
            <div class="carousel-dots" id="carouselDots">
                ${carouselSlides.map((_, i) => `<button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`).join('')}
            </div>
        </div>
    ` : (details.image ? `<div class="airport-emoji">${details.image}</div>` : '');

    const content = `
        <div class="airport-content">
            <button class="close-modal" aria-label="关闭">×</button>
            <div class="airport-panel-left">
                ${carouselHTML}
            </div>
            <div class="airport-panel-right">
                <h3>${airportName}</h3>
                <div class="airport-tags">
                    ${details.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="panel-desc">${details.description}</div>

                ${hasPackages ? `
                <div class="panel-section">
                    <div class="section-title">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        套餐价格
                    </div>
                    <div class="packages-section">
                        <div class="packages-content">
                            ${createPriceTags(details.packages)}
                        </div>
                    </div>
                </div>` : ''}

                ${hasSpeedInfo ? `
                <div class="speed-info">
                    <div class="speed-info-icon">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z"/></svg>
                    </div>
                    <div class="speed-info-text">
                        此机场提供<strong>不同速率限制</strong>的套餐选择，请注意各套餐对应的<strong>网络速率</strong>，选择适合您需求的套餐。
                    </div>
                </div>` : ''}

                ${hasMoreContent ? `
                <div class="packages-more">
                    ${createMoreContent(details.moreContent)}
                </div>` : ''}

                ${details.warning ? `
                <div class="warning-section">
                    <div class="warning-icon">
                        <svg viewBox="0 0 24 24"><path fill="#ff8a50" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                    </div>
                    <div class="warning-text">${details.warning}</div>
                </div>` : ''}

                <div class="airport-actions">
                    <button class="action-button visit-button">
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/></svg>
                        ${allCardData.proxy.linkText}
                    </button>
                    <button class="action-button cancel-button">取消</button>
                </div>
            </div>
        </div>
    `;

    modal.innerHTML = content;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('active'), 10);

    // 初始化轮播
    if (hasCarousel) {
        initCarousel(modal, carouselSlides.length);
    }

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(modal)) modal.remove();
            document.body.style.overflow = '';
        }, 200);
    };

    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.visit-button').addEventListener('click', () => {
        window.open(details.link, '_blank');
        closeModal();
    });
    modal.querySelector('.cancel-button').addEventListener('click', closeModal);
}

// ===== 手动轮播 =====
function initCarousel(modal, total) {
    const track = modal.querySelector('#carouselTrack');
    const dots = modal.querySelectorAll('.carousel-dot');
    const prevBtn = modal.querySelector('#carouselPrev');
    const nextBtn = modal.querySelector('#carouselNext');
    let index = 0;

    function goTo(i) {
        index = (i + total) % total;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, n) => d.classList.toggle('active', n === index));
    }

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index - 1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index + 1); });
    dots.forEach(d => d.addEventListener('click', (e) => { e.stopPropagation(); goTo(Number(d.dataset.index)); }));

    // 键盘
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') goTo(index - 1);
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') goTo(index + 1);
    });

    // 拖拽 — 监听 document 确保不丢事件
    let startX = 0, dragged = false;
    track.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        dragged = false;
        track.style.cursor = 'grabbing';
        track.style.transition = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (track.style.cursor !== 'grabbing') return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 5) dragged = true;
        const pct = -index * 100 + (diff / track.offsetWidth) * 100;
        track.style.transform = `translateX(${pct}%)`;
    });
    document.addEventListener('mouseup', (e) => {
        if (track.style.cursor !== 'grabbing') return;
        track.style.cursor = '';
        track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)';
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? index - 1 : index + 1);
        else goTo(index);
    });

    // 触摸
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        track.style.transition = 'none';
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
        track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)';
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? index - 1 : index + 1);
    });
}

// 修改价格标签渲染函数
function createPriceTags(packages) {
    if (!packages || !packages.length) return '';
    return packages.map(pkg => `
        <div class="package-row">
            <div class="package-name">${pkg.name}</div>
            <div class="package-price">
                <span class="price-currency">${pkg.currency || '¥'}</span>
                <span class="price-amount">${pkg.price}</span>
                <span class="price-period">/${pkg.period || '月'}</span>
            </div>
            ${pkg.traffic ? `<div class="package-traffic">${pkg.traffic}</div>` : ''}
            ${pkg.speed ? `<div class="package-speed"><span class="speed-icon">📶</span>${pkg.speed}</div>` : ''}
        </div>
    `).join('');
}

function createMoreContent(moreContent) {
    if (!moreContent || !moreContent.text) return '';
    return `<div class="more-content-text">${moreContent.text}</div>`;
}

// 添加机场卡片点击事件
function initAirportCards() {
    const proxySection = document.querySelector('#proxy');
    if (!proxySection) return;
    proxySection.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.card-title').textContent;
            createAirportModal(name);
        });
    });
}

export { createAirportModal, initAirportCards };
