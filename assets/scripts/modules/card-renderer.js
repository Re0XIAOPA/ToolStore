// 卡片渲染模块
import { fetchAllCardData } from './api.js';
import { downloadLinks, getToolVersion } from '../configs/download-config.js';
import { createDownloadModal } from './download-modal.js';
import { RecommendManager } from './recommend.js';

// 预先加载平台图标模块
let platformIconsModule = null;
import('./platform-icons.js').then(module => {
    platformIconsModule = module;
}).catch(err => console.error('加载平台图标失败:', err));

// 渲染所有卡片部分
export async function renderAllCardSections() {
    try {
        // 显示加载指示器
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
        
        const allCardData = await fetchAllCardData();
        const main = document.querySelector('main');
        if (!main) return;
        
        // 清空main内容，准备重新渲染
        const existingSections = main.querySelectorAll('.tools-section');
        existingSections.forEach(section => section.remove());
        
        // 渲染所有部分
        for (const key in allCardData) {
            const sectionData = allCardData[key];
            const sectionElement = createSection(sectionData);
            main.appendChild(sectionElement);
        }
        
        // 隐藏加载指示器
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // 渲染完成后，初始化卡片
        initCardEvents();
    } catch (error) {
        console.error('渲染卡片时出错:', error);
        showErrorMessage('加载数据失败，请刷新页面重试。');
        
        // 出错时也隐藏加载指示器
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// 创建单个部分（工具/软件/机场）
function createSection(sectionData) {
    const section = document.createElement('div');
    section.className = 'tools-section';
    section.id = sectionData.id;
    
    // 创建头部
    const header = document.createElement('div');
    header.className = 'tools-header';
    header.innerHTML = `
        <h2>${sectionData.title}</h2>
        <p>${sectionData.description}</p>
    `;
    section.appendChild(header);
    
    // 创建内容区域
    const content = document.createElement('section');
    
    // 创建表格（用于兼容性，实际显示时会被卡片替代）
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    
    // 为每个项目创建表格行
    sectionData.data.forEach(item => {
        const tr = document.createElement('tr');
        
        const tdName = document.createElement('td');
        tdName.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="display:none">
            <span class="tool-name">${item.name}</span>
        `;
        
        const tdLink = document.createElement('td');
        tdLink.innerHTML = `<a href="${item.link}">${sectionData.linkText}</a>`;
        
        tr.appendChild(tdName);
        tr.appendChild(tdLink);
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    content.appendChild(table);
    
    // 创建卡片容器
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    
    // 为每个项目创建卡片
    sectionData.data.forEach(item => {
        const card = createCard(item, sectionData);
        gridContainer.appendChild(card);
    });
    
    content.appendChild(gridContainer);
    section.appendChild(content);
    
    return section;
}

// 创建单个卡片
function createCard(item, sectionData) {
    // 根据不同类型应用不同样式
    let cardClass = 'card clickable';
    if (sectionData.id === 'proxy') {
        cardClass += ' proxy-card';
    }
    if (sectionData.id === 'tools') {
        cardClass += ' tool-card';
    }
    
    const card = document.createElement('div');
    card.className = cardClass;
    card.setAttribute('data-link', item.link);
    card.setAttribute('data-name', item.name);
    
    // 创建图标元素
    const iconElement = document.createElement('div');
    iconElement.className = 'card-icon';
    
    const imgElement = document.createElement('img');
    imgElement.src = item.image;
    imgElement.alt = item.name;
    
    // 预加载图片以防闪烁
    const preloadImg = new Image();
    preloadImg.src = item.image;
    
    imgElement.onerror = () => {
        imgElement.src = 'assets/images/default/default.png';
    };
    
    // 确保图片显示
    imgElement.style.display = 'block';
    
    iconElement.appendChild(imgElement);
    card.appendChild(iconElement);
    
    // 创建标题和版本号容器
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    titleDiv.textContent = item.name;
    titleContainer.appendChild(titleDiv);
    
    // 如果是网络工具，添加版本号显示
    if (sectionData.id === 'tools') {
        const version = getToolVersion(item.name);
        if (version && version !== 'undefined') {
            const versionDiv = document.createElement('div');
            versionDiv.className = 'tool-version';
            versionDiv.textContent = version;
            titleContainer.appendChild(versionDiv);
        }
    }
    
    card.appendChild(titleContainer);
    
    // 如果是网络工具区域，添加平台图标
    if (sectionData.id === 'tools') {
        addPlatformIcons(card, item.name);
    }
    
    // 如果是机场卡片，添加特殊描述
    if (sectionData.id === 'proxy') {
        // 可以在这里添加机场卡片特有的元素，如价格等
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = 'card-description';
        descriptionDiv.textContent = '点击查看详情';
        card.appendChild(descriptionDiv);
    }
    
    return card;
}

// 添加平台图标
function addPlatformIcons(card, toolName) {
    // 检查是否有下载链接配置
    const normalizedName = toolName.toLowerCase().trim();
    const links = downloadLinks[normalizedName];
    if (!links) return;
    
    // 获取支持的平台
    const supportedPlatforms = Object.keys(links).filter(
        platform => platform !== 'github' && platform !== 'version'
    );
    
    if (supportedPlatforms.length === 0) return;
    
    // 创建平台图标容器
    const platformIconsDiv = document.createElement('div');
    platformIconsDiv.className = 'platform-icons';
    
    // 使用预加载的平台图标模块
    if (platformIconsModule) {
        const { platformIcons, getPlatformName } = platformIconsModule;
        
        // 添加平台图标
        supportedPlatforms.forEach(platform => {
            if (platformIcons[platform]) {
                const iconWrapper = document.createElement('div');
                iconWrapper.className = 'platform-icon-wrapper';
                iconWrapper.innerHTML = platformIcons[platform];
                iconWrapper.title = getPlatformName(platform);
                platformIconsDiv.appendChild(iconWrapper);
            }
        });
        
        card.appendChild(platformIconsDiv);
        card.dataset.platforms = supportedPlatforms.join(',');
    } else {
        // 如果模块尚未加载，稍后再尝试
        setTimeout(() => {
            if (platformIconsModule) {
                const { platformIcons, getPlatformName } = platformIconsModule;
                
                // 添加平台图标
                supportedPlatforms.forEach(platform => {
                    if (platformIcons[platform]) {
                        const iconWrapper = document.createElement('div');
                        iconWrapper.className = 'platform-icon-wrapper';
                        iconWrapper.innerHTML = platformIcons[platform];
                        iconWrapper.title = getPlatformName(platform);
                        platformIconsDiv.appendChild(iconWrapper);
                    }
                });
                
                card.appendChild(platformIconsDiv);
                card.dataset.platforms = supportedPlatforms.join(',');
            }
        }, 200);
    }
}

// 添加点击处理函数
export function initCardEvents() {
    // 点击卡片时的处理
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.classList.contains('clickable')) {
            const toolName = card.querySelector('.card-title').textContent;
            
            // 移除已存在的点击事件
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            newCard.addEventListener('click', () => {
                // 网络工具使用下载弹窗
                if (newCard.closest('#tools')) {
                    createDownloadModal(toolName);
                } else if (newCard.closest('#proxy')) {
                    // 机场卡片使用机场详情弹窗
                    import('./airport-modal.js').then(module => {
                        if (module.createAirportModal) {
                            module.createAirportModal(toolName);
                        } else {
                            console.error('createAirportModal函数未找到');
                            // 失败时回退到打开链接
                            const link = newCard.getAttribute('data-link');
                            if (link) window.open(link, '_blank');
                        }
                    }).catch(err => {
                        console.error('加载机场模态窗口失败:', err);
                        // 失败时回退到打开链接
                        const link = newCard.getAttribute('data-link');
                        if (link) window.open(link, '_blank');
                    });
                } else {
                    // 其他卡片直接跳转链接
                    const link = newCard.getAttribute('data-link');
                    if (link) window.open(link, '_blank');
                }
            });
        }
    });
}

// 显示错误消息
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const main = document.querySelector('main');
    if (main) {
        main.prepend(errorDiv);
        
        // 3秒后自动消失
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// 初始化函数 - 由程序主入口调用
export function initCardRenderer() {
    renderAllCardSections().then(() => {
        // 所有卡片渲染完成后初始化推荐系统
        // 使用较短的延时确保所有DOM元素都已完全加载
        setTimeout(() => {
            initRecommendSystem();
        }, 100);
    });
}

// 初始化推荐管理器
function initRecommendSystem() {
    try {
        const recommendManager = new RecommendManager();
        recommendManager.init();
    } catch (error) {
        console.error('初始化推荐系统时出错:', error);
    }
} 