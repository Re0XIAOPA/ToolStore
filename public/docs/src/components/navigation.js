// 导航组件
export function renderNavbar(navItems) {
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) return;
    
    navMenu.innerHTML = navItems.map(item => `
        <li>
            <a href="${item.link}" ${item.link.startsWith('http') ? 'target="_blank"' : ''}>${item.text}</a>
        </li>
    `).join('');
}

export function renderSidebar(sidebarConfig, containerElement = null) {
    const sidebarContent = containerElement || document.getElementById('sidebar-content');
    if (!sidebarContent) return;
    
    // 获取当前路径对应的侧边栏配置
    const sidebarItems = sidebarConfig['/'] || [];
    
    sidebarContent.innerHTML = sidebarItems.map(group => `
        <div class="sidebar-group">
            <div class="sidebar-group-title">
                <span>${group.text}</span>
                <span class="toggle-icon">▼</span>
            </div>
            <ul class="sidebar-group-items">
                ${group.items.map(item => {
                    // 使用简化的路径格式
                    return `
                    <li class="sidebar-item">
                        <a href="#${item.link}">${item.text}</a>
                    </li>
                `}).join('')}
            </ul>
        </div>
    `).join('');
}

// 更新侧边栏高亮
export function updateActiveSidebarItem(docPath) {
    // 移除之前的所有高亮
    document.querySelectorAll('.sidebar-item a, .sider-container .sidebar-item a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 高亮当前链接（桌面端和移动端）
    const currentLink = document.querySelector(`.sidebar .sidebar-item a[href="#${docPath}"]`);
    const mobileCurrentLink = document.querySelector(`.sider-container .sidebar-item a[href="#${docPath}"]`);
    
    if (currentLink) {
        currentLink.classList.add('active');
    }
    
    if (mobileCurrentLink) {
        mobileCurrentLink.classList.add('active');
    }
}