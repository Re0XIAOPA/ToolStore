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
        
        // 确保在所有卡片渲染完成后再初始化推荐系统
        setTimeout(() => {
            initRecommendSystem();
        }, 100);
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
        // 判断 image 是路径还是 emoji/字符串
        const isEmojiOrString = !item.image.includes('/') && !item.image.includes('\\');
        
        if (isEmojiOrString) {
            // 如果是 emoji，不创建 img 标签
            tdName.innerHTML = `<span class="tool-name">${item.name}</span>`;
        } else {
            // 如果是路径，正常创建 img 标签
            tdName.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="display:none">
                <span class="tool-name">${item.name}</span>
            `;
        }
        
        const tdLink = document.createElement('td');
        tdLink.innerHTML = `<a href="${item.link}">${sectionData.linkText}</a>`;
        
        tr.appendChild(tdName);
        tr.appendChild(tdLink);
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    content.appendChild(table);
    
    // 如果是机场分类（支持分组），使用分组渲染
    if (sectionData.id === 'proxy') {
        renderAirportGroupedCards(content, sectionData);
    } else {
        // 其他分类使用普通网格渲染
        renderSimpleCards(content, sectionData);
    }
    
    section.appendChild(content);
    
    return section;
}

// 机场卡片分组渲染
function renderAirportGroupedCards(content, sectionData) {
    // 按category和tier分组
    const groupedData = {};
    
    sectionData.data.forEach(item => {
        // 从機垠對象本身中獲取category和tier信息
        const category = item.category || 'other';
        const tier = item.tier || 'default';
        
        if (!groupedData[category]) {
            groupedData[category] = {};
        }
        if (!groupedData[category][tier]) {
            groupedData[category][tier] = [];
        }
        groupedData[category][tier].push(item);
    });
    
    // 定义分类名称和排序
    const categoryNames = {
        'paid': '付费机场',
        'free': '免费机场',
        'other': '其他'
    };
    
    const tierNames = {
        'first-tier': '一线',
        'second-tier': '二线',
        'third-tier': '三线',
        'admin-pick': '站长自用',
        'admin-recommend': '推荐',
        'default': '其他'
    };
    
    const categoryOrder = ['paid', 'free', 'other'];
    const tierOrder = ['first-tier', 'second-tier', 'third-tier', 'admin-pick', 'admin-recommend', 'default'];
    
    // 按顺序渲染分组
    categoryOrder.forEach(category => {
        if (!groupedData[category]) return;
        
        // 创建分类容器
        const categoryContainer = document.createElement('div');
        categoryContainer.className = `airport-category-group ${category}`;
        
        // 创建分类标题
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'airport-category-title';
        categoryTitle.textContent = categoryNames[category];
        categoryContainer.appendChild(categoryTitle);
        
        // 按tier渲染
        tierOrder.forEach(tier => {
            if (!groupedData[category][tier]) return;
            
            // 创建tier容器
            const tierContainer = document.createElement('div');
            tierContainer.className = `airport-tier-group ${tier}`;
            
            // 创建tier标题（仅在tier不是default时显示）
            if (tier !== 'default') {
                const tierTitle = document.createElement('h4');
                tierTitle.className = 'airport-tier-title';
                tierTitle.textContent = tierNames[tier];
                
                // 为admin-pick增加详细说明
                if (tier === 'admin-pick') {
                    const tierDescription = document.createElement('p');
                    tierDescription.className = 'airport-tier-description';
                    tierDescription.textContent = '站长经使用之后推荐';
                    tierTitle.appendChild(tierDescription);
                }
                
                // 为admin-recommend增加详细说明
                if (tier === 'admin-recommend') {
                    const tierDescription = document.createElement('p');
                    tierDescription.className = 'airport-tier-description';
                    tierDescription.textContent = '站长高度推荐';
                    tierTitle.appendChild(tierDescription);
                }
                
                tierContainer.appendChild(tierTitle);
            }
            
            // 创建卡片网格
            const gridContainer = document.createElement('div');
            gridContainer.className = 'grid-container';
            
            // 为每个项目创建卡片
            groupedData[category][tier].forEach(item => {
                const card = createCard(item, sectionData);
                gridContainer.appendChild(card);
            });
            
            tierContainer.appendChild(gridContainer);
            categoryContainer.appendChild(tierContainer);
        });
        
        content.appendChild(categoryContainer);
    });
}

// 普通卡片渲染（用于工具和软件）
function renderSimpleCards(content, sectionData) {
    // 创建卡片容器
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    
    // 为每个项目创建卡片
    sectionData.data.forEach(item => {
        const card = createCard(item, sectionData);
        gridContainer.appendChild(card);
    });
    
    content.appendChild(gridContainer);
}

// 创建随机背景色的辅助函数
function generateRandomColor() {
    // 七个色系：红、橙、黄、绿、青、蓝、紫
    const colorPalettes = [
        // 红色系
        ['#FF6B6B', '#FF8A80', '#FF6B6B', '#E74C3C', '#C0392B'],
        // 橙色系
        ['#FFA500', '#FF9F43', '#FF8C42', '#FF7F50', '#FF6B35'],
        // 黄色系
        ['#FFD700', '#FFC700', '#FFB700', '#FFA500', '#F0AD4E'],
        // 绿色系
        ['#52C41A', '#5CDBD3', '#1ABC9C', '#27AE60', '#2ECC71'],
        // 青色系
        ['#00BCD4', '#06C', '#0891B2', '#06B6D4', '#0DCAF0'],
        // 蓝色系
        ['#1E90FF', '#3498DB', '#2980B9', '#0066CC', '#1976D2'],
        // 紫色系
        ['#9C27B0', '#9370DB', '#B19CD9', '#DDA0DD', '#BA55D3']
    ];
    
    // 随机选择一个色系
    const paletteIndex = Math.floor(Math.random() * colorPalettes.length);
    const palette = colorPalettes[paletteIndex];
    
    // 在选中的色系中随机选择一个颜色
    const colorIndex = Math.floor(Math.random() * palette.length);
    return palette[colorIndex];
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
    if (sectionData.id === 'links') {
        cardClass += ' links-card';
    }
    
    const card = document.createElement('div');
    card.className = cardClass;
    card.setAttribute('data-link', item.link);
    card.setAttribute('data-name', item.name);
    
    // 创建图标元素
    const iconElement = document.createElement('div');
    iconElement.className = 'card-icon';
    
    // 判断 image 是路径、emoji、字符串还是空串
    const isEmptyImage = item.image === '' || item.image === null || item.image === undefined;
    const isEmojiOrString = !isEmptyImage && !item.image.includes('/') && !item.image.includes('\\');
    
    if (isEmptyImage) {
        // 如果是空串，使用名字作为头像
        const charElement = document.createElement('div');
        charElement.className = 'card-char-avatar';
        
        // 提取显示文字：中文1个字，英文2个字母
        let displayText = '';
        for (let i = 0; i < item.name.length; i++) {
            const char = item.name.charAt(i);
            // 检查是否是中文字符
            if (/[\u4e00-\u9fa5]/.test(char)) {
                displayText += char;
                if (displayText.length >= 1) break;
            } else if (/[a-zA-Z]/.test(char)) {
                displayText += char;
                if (displayText.length >= 2) break;
            }
        }
        // 如果没有收集到任何字符，使用第一个字符
        if (!displayText) {
            displayText = item.name.charAt(0);
        }
        charElement.textContent = displayText.toUpperCase();
        
        // 随机背景色
        const randomColor = generateRandomColor();
        charElement.style.backgroundColor = randomColor;
        charElement.style.color = '#fff';
        charElement.style.fontSize = '32px';
        charElement.style.fontWeight = 'bold';
        charElement.style.display = 'flex';
        charElement.style.alignItems = 'center';
        charElement.style.justifyContent = 'center';
        charElement.style.height = '100%';
        charElement.style.borderRadius = '16px';
        
        iconElement.appendChild(charElement);
    } else if (isEmojiOrString) {
        // 如果是 emoji 或字符串，直接显示
        const emojiElement = document.createElement('span');
        emojiElement.className = 'card-emoji';
        emojiElement.textContent = item.image;
        emojiElement.style.fontSize = '48px';
        emojiElement.style.display = 'flex';
        emojiElement.style.alignItems = 'center';
        emojiElement.style.justifyContent = 'center';
        emojiElement.style.height = '100%';
        iconElement.appendChild(emojiElement);
    } else {
        // 如果是路径，正常加载图片
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
    }

    card.appendChild(iconElement);
    
    // 创建标题和版本号容器
    const titleContainer = document.createElement('div');
    titleContainer.className = 'title-container';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'card-title';
    titleDiv.textContent = item.name;
    titleContainer.appendChild(titleDiv);
    
    // 如果是代理工具，添加版本号显示
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
    
    // 如果是代理工具区域，添加平台图标
    if (sectionData.id === 'tools') {
        addPlatformIcons(card, item.name);
    }
    
    // 如果是机场卡片，添加特殊描述
    if (sectionData.id === 'proxy') {
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
                // 代理工具使用下载弹窗
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
                } else if (newCard.closest('#links')) {
                    // 友链卡片直接打开链接
                    const link = newCard.getAttribute('data-link');
                    if (link) window.open(link, '_blank');
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
    renderAllCardSections();
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