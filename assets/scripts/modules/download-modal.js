// 下载模态框模块
import { platformIcons, githubIcon, getPlatformName } from './platform-icons.js';
import { downloadLinks, getToolVersion } from '../configs/download-config.js';

// 创建下载模态框
export function createDownloadModal(toolName) {
    const existingModal = document.querySelector('.download-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 创建背景遮罩
    createBackdrop();

    const modal = document.createElement('div');
    modal.className = 'download-modal';

    // 获取工具的下载链接
    const normalizedName = toolName.toLowerCase().trim();
    const links = downloadLinks[normalizedName];
    if (!links) {
        removeBackdrop();
        return;
    }
    
    // 获取工具版本
    const version = getToolVersion(toolName);

    const platforms = ['windows', 'mac', 'linux', 'android', 'ios', 'github'];
    const content = `
        <div class="download-content modal-content-enter">
            <button class="close-modal">×</button>
            <div class="download-header">
                <h3>${toolName} ${version && version !== 'undefined' ? `<span class="tool-version">${version}</span>` : ''}</h3>
                <p>选择下载平台</p>
                <p>若下载失效 可使用免费节点 前往Github下载</p>
            </div>
            <div class="download-grid">
                ${platforms.map((platform, index) => `
                    <div class="download-item ${!links[platform] ? 'disabled' : ''}" 
                         data-platform="${platform}"
                         data-url="${links[platform] || ''}"
                         style="--item-index: ${index}">
                        <div class="download-icon">
                            ${platform === 'github' ? githubIcon : platformIcons[platform]}
                        </div>
                        <div class="download-name">${getPlatformName(platform)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    modal.innerHTML = content;
    document.body.appendChild(modal);

    // 禁用背景滚动
    document.body.classList.add('modal-open');
    document.body.classList.remove('modal-closed');

    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭按钮事件
    modal.querySelector('.close-modal').addEventListener('click', () => {
        closeDownloadModal(modal);
    });

    // 点击外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDownloadModal(modal);
        }
    });

    // 点击下载项
    const downloadItems = modal.querySelectorAll('.download-item:not(.disabled)');
    downloadItems.forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                // 添加点击动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                    window.open(url, '_blank');
                }, 100);
            }
        });
    });
}

// 关闭下载模态框
function closeDownloadModal(modal) {
    const contentElement = modal.querySelector('.download-content');
    
    // 添加退场动画
    if (contentElement) {
        contentElement.classList.remove('modal-content-enter');
        contentElement.classList.add('modal-content-exit');
    }
    
    // 延迟移除模态框，等待动画完成
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
                backdrop.style.display = 'none';
                if (document.body.contains(backdrop)) {
                    document.body.removeChild(backdrop);
                }
            }
            
            // 确保页面可以滚动
            document.body.classList.remove('modal-open');
            document.body.classList.add('modal-closed');
        }, 300);
    }
}