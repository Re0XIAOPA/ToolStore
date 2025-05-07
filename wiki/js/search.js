/**
 * 搜索功能实现
 */
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // 获取所有教程卡片和类别卡片
    const allItems = document.querySelectorAll('.tool-card, .category-card');
    
    // 添加搜索输入事件监听
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // 如果搜索词为空，显示所有内容
        if (searchTerm === '') {
            allItems.forEach(item => {
                item.style.display = '';
            });
            return;
        }
        
        // 筛选匹配的内容
        allItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            // 如果标题、描述或标签中包含搜索词，则显示该项
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                tags.some(tag => tag.includes(searchTerm))) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // 添加清除搜索按钮
    const searchContainer = searchInput.parentElement;
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-search';
    clearButton.innerHTML = '&times;';
    clearButton.title = '清除搜索';
    clearButton.style.display = 'none';
    
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(clearButton);
    
    // 显示/隐藏清除按钮
    searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });
    
    // 清除搜索
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        this.style.display = 'none';
    });
    
    // 添加清除按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .clear-search {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 18px;
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .clear-search:hover {
            background-color: rgba(0, 0, 0, 0.1);
            color: #666;
        }
        
        .search-box {
            padding-right: 35px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 全文搜索功能 - 用于搜索整个文档站的内容
 */
function initGlobalSearch() {
    // 创建搜索索引
    const searchIndex = [];
    
    // 获取所有导航项
    document.querySelectorAll('.nav-item a').forEach(link => {
        const url = link.getAttribute('href');
        const title = link.textContent.trim();
        
        // 添加到搜索索引
        searchIndex.push({
            url: url,
            title: title,
            content: '' // 内容将在后续异步加载
        });
        
        // 异步加载页面内容以建立完整索引
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // 提取主要内容文本
                const mainContent = doc.querySelector('.main-content');
                if (mainContent) {
                    const content = mainContent.textContent.replace(/\s+/g, ' ').trim();
                    
                    // 更新搜索索引中的内容
                    const index = searchIndex.findIndex(item => item.url === url);
                    if (index !== -1) {
                        searchIndex[index].content = content;
                    }
                }
            })
            .catch(error => {
                console.error('加载内容失败:', error);
            });
    });
    
    // 监听搜索按钮点击
    document.querySelector('.global-search-btn').addEventListener('click', function() {
        performGlobalSearch();
    });
    
    // 监听回车键
    document.getElementById('globalSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performGlobalSearch();
        }
    });
    
    // 执行全局搜索
    function performGlobalSearch() {
        const searchTerm = document.getElementById('globalSearchInput').value.toLowerCase().trim();
        if (!searchTerm) return;
        
        // 搜索结果
        const results = searchIndex.filter(item => {
            return item.title.toLowerCase().includes(searchTerm) || 
                  item.content.toLowerCase().includes(searchTerm);
        });
        
        // 显示搜索结果
        displaySearchResults(results, searchTerm);
    }
    
    // 显示搜索结果
    function displaySearchResults(results, searchTerm) {
        const resultsContainer = document.querySelector('.search-results');
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `<p>没有找到与 "${searchTerm}" 相关的结果</p>`;
            return;
        }
        
        const resultsList = document.createElement('ul');
        resultsList.className = 'search-results-list';
        
        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${result.url}">${result.title}</a>`;
            resultsList.appendChild(listItem);
        });
        
        resultsContainer.appendChild(resultsList);
        
        // 显示搜索结果区域
        resultsContainer.style.display = 'block';
    }
} 