// 导入贡献者数据
import { sponsors } from './configs/sponsor-config.js';

// 加载贡献者卡片
function loadSponsors() {
    const container = document.createElement('div');
    container.className = 'sponsors-container';

    // 添加贡献者标题
    const title = document.createElement('h2');
    title.className = 'sponsors-title';
    title.textContent = '项目贡献者';
    container.appendChild(title);

    // 先加载主要贡献者
    const primarySponsors = sponsors.filter(s => s.type === 'primary');
    if(primarySponsors.length > 0) {
        const primaryContainer = document.createElement('div');
        primaryContainer.className = 'primary-sponsors-container';
        
        primarySponsors.forEach(sponsor => {
            const card = document.createElement('div');
            card.className = 'sponsor-card primary';

            const avatar = document.createElement('img');
            avatar.className = 'sponsor-avatar';
            avatar.src = sponsor.avatar;
            avatar.alt = sponsor.name;
            avatar.onclick = () => window.open(sponsor.url, '_blank');

            const name = document.createElement('span');
            name.className = 'sponsor-name';
            name.textContent = sponsor.name;

            card.appendChild(avatar);
            card.appendChild(name);
            primaryContainer.appendChild(card);
        });
        container.appendChild(primaryContainer);
    }

    // 再加载其他贡献者
    const secondarySponsors = sponsors.filter(s => s.type === 'secondary');
    if(secondarySponsors.length > 0) {
        const secondaryContainer = document.createElement('div');
        secondaryContainer.className = 'secondary-sponsors-container';
        
        secondarySponsors.forEach(sponsor => {
            const card = document.createElement('div');
            card.className = 'sponsor-card secondary';

            const avatar = document.createElement('img');
            avatar.className = 'sponsor-avatar';
            avatar.src = sponsor.avatar;
            avatar.alt = sponsor.name;
            avatar.onclick = () => window.open(sponsor.url, '_blank');

            const name = document.createElement('span');
            name.className = 'sponsor-name';
            name.textContent = sponsor.name;

            card.appendChild(avatar);
            card.appendChild(name);
            secondaryContainer.appendChild(card);
        });
        container.appendChild(secondaryContainer);
    }

    return container;
}

// 初始化贡献者区域
document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.parentNode.insertBefore(loadSponsors(), footer);
    }
});
