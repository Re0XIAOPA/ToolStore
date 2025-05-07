/**
 * 单页应用功能实现
 * 实现点击左侧导航加载内容而不是整页刷新
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化侧边栏
    initSidebar();
    
    // 初始化SPA功能
    initSPA();
    
    // 初始化其他功能
    initCodeHighlight();
    initCopyButtons();
    lazyLoadImages();
    initTableOfContents();
    initTagSystem();
    initScrollSpy();
    initImagePreview();
    
    // 监听浏览器前进后退事件
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.path) {
            // 滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });
            loadContent(event.state.path, false);
        }
    });
    
    // 检查当前URL是否需要加载特定内容
    checkCurrentPath();
    
    // 修复首次加载时的页面链接
    setTimeout(() => {
        const currentPath = window.location.pathname;
        fixAllRelativePaths(currentPath);
    }, 500);
    
    console.log("SPA功能初始化完成");
});

/**
 * 初始化SPA功能
 */
function initSPA() {
    // 获取所有导航链接（包括动态添加的）
    const navLinks = document.querySelectorAll('.nav-item a, .nav-links a, .main-content a');
    
    // 为每个链接添加点击事件
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // 跳过外部链接、锚点链接或已初始化的链接
        if (href && !href.startsWith('http') && !href.startsWith('#') && !link.hasAttribute('data-spa-initialized')) {
            link.addEventListener('click', function(e) {
                // 如果链接是指向当前域名下的HTML页面
                if (href.endsWith('.html') || href.indexOf('.html#') > -1) {
                    e.preventDefault();
                    
                    // 如果是当前活动链接，不做任何操作
                    if (this.parentElement && this.parentElement.classList.contains('active')) {
                        return;
                    }
                    
                    // 保存侧边栏状态
                    const collapsedStates = saveCollapsedStates();
                    
                    // 加载内容
                    loadContent(href, true);
                    
                    // 更新URL，不刷新页面
                    history.pushState({ path: href }, '', href);
                    
                    // 如果在移动设备上，点击后关闭侧边栏
                    if (window.innerWidth <= 768) {
                        const sidebar = document.querySelector('.sidebar');
                        const sidebarToggle = document.querySelector('.sidebar-toggle');
                        if (sidebar) sidebar.classList.remove('active');
                        if (sidebarToggle) sidebarToggle.classList.remove('active');
                    }
                }
            });
            
            // 标记为已初始化
            link.setAttribute('data-spa-initialized', 'true');
        }
    });
    
    // 修复页面中的所有相对路径（初始加载时）
    setTimeout(() => {
        const currentPath = window.location.pathname;
        fixImagePaths(currentPath);
    }, 500);
}

/**
 * 加载指定路径的内容
 * @param {string} path - 内容路径
 * @param {boolean} updateActive - 是否更新活动状态
 */
function loadContent(path, updateActive) {
    // 显示加载状态
    showLoading();
    
    // 规范化路径，处理相对路径问题
    const normalizedPath = normalizePath(path);
    console.log("加载内容: ", normalizedPath);
    
    // 使用fetch API加载内容
    fetch(normalizedPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`网络响应异常: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // 解析HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // 提取主要内容
            const mainContent = doc.querySelector('.main-content');
            const tocContent = doc.querySelector('.table-of-contents');
            const sidebar = doc.querySelector('.sidebar');
            
            if (mainContent) {
                try {
                    // 先滚动到顶部，确保页面从顶部开始浏览
                    window.scrollTo({
                        top: 0,
                        behavior: 'auto'
                    });
                    
                    // 保存侧边栏折叠状态
                    const collapsedStates = saveCollapsedStates();
                    
                    // 更新主内容区
                    document.querySelector('.main-content').innerHTML = mainContent.innerHTML;
                    
                    // 处理目录（TOC）
                    handleTableOfContents(tocContent);
                    
                    // 更新左侧侧边栏，但保留当前状态
                    if (sidebar) {
                        const currentSidebar = document.querySelector('.sidebar');
                        if (currentSidebar) {
                            // 更新侧边栏内容
                            currentSidebar.innerHTML = sidebar.innerHTML;
                            // 恢复折叠状态
                            restoreCollapsedStates(collapsedStates);
                        }
                    }
                    
                    // 更新页面标题
                    const title = doc.querySelector('title');
                    if (title) {
                        document.title = title.textContent;
                    }
                    
                    // 如果需要更新活动状态
                    if (updateActive) {
                        updateActiveNavItem(normalizedPath);
                    }
                    
                    // 处理页面中的相对路径
                    fixAllRelativePaths(normalizedPath);
                    
                    // 重新初始化交互功能
                    setTimeout(() => {
                        // 重新初始化SPA功能以捕获新添加的链接
                        initSPA();
                        
                        // 初始化各种功能
                        initSidebar(); // 重新初始化侧边栏
                        initImagePreview();
                        initScrollSpy();
                        initCodeHighlight();
                        initCopyButtons();
                        lazyLoadImages();
                        initTableOfContents();
                        console.log("所有功能已重新初始化");
                    }, 100);
                } catch (error) {
                    console.error('处理内容时出错:', error);
                    showErrorMessage('处理内容时发生错误，请刷新页面重试。');
                }
            } else {
                throw new Error('无法获取页面内容: 找不到主内容区');
            }
        })
        .catch(error => {
            console.error('加载内容失败:', error);
            showErrorMessage(`无法加载请求的内容: ${error.message}。请稍后再试或刷新页面。`);
        })
        .finally(() => {
            // 隐藏加载状态
            hideLoading();
        });
}

/**
 * 处理目录内容
 * @param {Element} tocContent - 新页面的目录元素
 */
function handleTableOfContents(tocContent) {
    // 处理目录
    if (tocContent) {
        const currentToc = document.querySelector('.table-of-contents');
        if (currentToc) {
            currentToc.innerHTML = tocContent.innerHTML;
        } else {
            // 如果当前页面没有目录但新页面有，创建一个
            const tocContainer = document.createElement('div');
            tocContainer.className = 'table-of-contents';
            tocContainer.innerHTML = tocContent.innerHTML;
            document.querySelector('.page-container').appendChild(tocContainer);
        }
    } else {
        // 如果新页面没有目录但当前页面有，移除目录
        const currentToc = document.querySelector('.table-of-contents');
        if (currentToc) {
            currentToc.remove();
        }
    }
}

/**
 * 修复所有相对路径（图片、链接等）
 * @param {string} currentPath - 当前页面路径
 */
function fixAllRelativePaths(currentPath) {
    // 修复图片路径
    fixImagePaths(currentPath);
    
    // 修复链接路径
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    
    // 修复所有不是调用JS函数的相对路径链接
    document.querySelectorAll('.main-content a[href]:not([href^="#"]):not([href^="javascript"]):not([href^="http"]):not([href^="/"])').forEach(link => {
        const originalHref = link.getAttribute('href');
        link.href = normalizePath(originalHref);
    });
}

/**
 * 保存侧边栏折叠状态
 * @returns {Object} 折叠状态对象
 */
function saveCollapsedStates() {
    const states = {};
    document.querySelectorAll('.nav-category').forEach((category, index) => {
        const title = category.querySelector('.category-title').textContent.trim();
        const navItems = category.querySelector('.nav-items');
        const isCollapsed = navItems && navItems.classList.contains('collapsed');
        states[title] = isCollapsed;
    });
    return states;
}

/**
 * 恢复侧边栏折叠状态
 * @param {Object} states - 折叠状态对象
 */
function restoreCollapsedStates(states) {
    document.querySelectorAll('.nav-category').forEach((category, index) => {
        const titleElement = category.querySelector('.category-title');
        if (!titleElement) return;
        
        const title = titleElement.textContent.trim();
        const navItems = category.querySelector('.nav-items');
        if (!navItems) return;
        
        const toggleIcon = category.querySelector('.toggle-icon');
        
        if (states[title]) {
            navItems.classList.add('collapsed');
            if (toggleIcon) toggleIcon.textContent = '►';
        } else {
            navItems.classList.remove('collapsed');
            if (toggleIcon) toggleIcon.textContent = '▼';
        }
    });
}

/**
 * 规范化路径，处理相对路径问题
 * @param {string} path - 原始路径
 * @returns {string} 规范化后的路径
 */
function normalizePath(path) {
    // 如果是完整URL（以http或https开头），直接返回
    if (path.startsWith('http')) {
        return path;
    }
    
    // 如果是绝对路径（以/开头），直接返回
    if (path.startsWith('/')) {
        return path;
    }
    
    // 获取当前页面的基础路径（到最后一个斜杠之前）
    const currentPath = window.location.pathname;
    const baseDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    
    // 如果是相对路径（不以/开头），拼接到基础路径
    if (!path.startsWith('/')) {
        // 如果路径以../开头，需要处理上级目录
        if (path.startsWith('../')) {
            // 分割baseDir为路径段
            const baseParts = baseDir.split('/').filter(part => part.length > 0);
            // 分割path为路径段
            let pathParts = path.split('/');
            
            // 处理所有的../
            while (pathParts[0] === '..') {
                pathParts.shift(); // 移除..
                if (baseParts.length > 0) {
                    baseParts.pop(); // 移除一个目录层级
                }
            }
            
            // 重建路径
            return '/' + baseParts.join('/') + '/' + pathParts.join('/');
        } else if (path.startsWith('./')) {
            // 处理./情况，直接移除./
            return baseDir + path.substring(2);
        }
        
        // 简单的相对路径直接拼接
        return baseDir + path;
    }
    
    return path;
}

/**
 * 更新活动导航项
 */
function updateActiveNavItem(path) {
    console.log("更新活动导航项：", path);
    
    // 移除所有导航项的活动状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 标准化路径，移除域名和查询参数
    const normalizedPath = path.replace(/^https?:\/\/[^\/]+/, '').split('?')[0].split('#')[0];
    const pathElements = normalizedPath.split('/');
    const filename = pathElements[pathElements.length - 1];
    
    // 设置当前路径对应的导航项为活动状态
    let foundActiveItem = false;
    
    // 尝试多种匹配方式
    document.querySelectorAll('.nav-item a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const normalizedHref = href.replace(/^https?:\/\/[^\/]+/, '').split('?')[0].split('#')[0];
        const hrefElements = normalizedHref.split('/');
        const hrefFilename = hrefElements[hrefElements.length - 1];
        
        // 匹配方式1: 完全匹配路径
        if (normalizedHref === normalizedPath) {
            setActiveNavItem(link);
            foundActiveItem = true;
            return;
        }
        
        // 匹配方式2: 路径结尾匹配
        if (normalizedPath.endsWith(normalizedHref)) {
            setActiveNavItem(link);
            foundActiveItem = true;
            return;
        }
        
        // 匹配方式3: 文件名匹配
        if (filename === hrefFilename) {
            setActiveNavItem(link);
            foundActiveItem = true;
            return;
        }
    });
    
    // 如果仍然没有找到匹配项，处理特殊情况
    if (!foundActiveItem) {
        console.log("未找到活动导航项，可能是特殊页面或首页");
    }
}

/**
 * 设置导航项为活动状态并展开父分类
 * @param {Element} link - 要设置为活动状态的链接元素
 */
function setActiveNavItem(link) {
    // 设置链接所在的导航项为活动状态
    const navItem = link.closest('.nav-item');
    if (navItem) {
        navItem.classList.add('active');
    } else {
        // 如果不是standard nav item，至少给链接自身添加一个活动样式
        link.classList.add('active-link');
    }
    
    // 确保包含当前项的分类是展开的
    const parentCategory = link.closest('.nav-items');
    if (parentCategory) {
        parentCategory.classList.remove('collapsed');
        
        // 找到分类标题，并确保切换图标正确
        const categoryTitle = parentCategory.previousElementSibling;
        if (categoryTitle && categoryTitle.classList.contains('category-title')) {
            categoryTitle.classList.remove('collapsed');
            
            const toggleIcon = categoryTitle.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = '▼';
            }
        }
    }
    
    // 滚动侧边栏，确保当前项可见
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && navItem) {
        setTimeout(() => {
            const itemTop = navItem.offsetTop;
            sidebar.scrollTop = itemTop - 100;
        }, 100);
    }
}

/**
 * 显示加载状态
 */
function showLoading() {
    // 如果已有加载指示器，先移除
    hideLoading();
    
    // 创建加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>加载中...</p>
    `;
    
    // 添加到主内容区顶部
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(loadingIndicator, mainContent.firstChild);
    
    // 添加半透明遮罩
    mainContent.classList.add('loading');
}

/**
 * 隐藏加载状态
 */
function hideLoading() {
    // 移除加载指示器
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
    
    // 移除半透明遮罩
    document.querySelector('.main-content').classList.remove('loading');
}

/**
 * 代码高亮功能
 */
function initCodeHighlight() {
    // 获取所有代码块
    const codeBlocks = document.querySelectorAll('pre code, .code-block');
    
    if (codeBlocks.length === 0) return;
    
    // 如果页面上有代码块但没有加载highlight.js，则动态加载
    if (typeof hljs === 'undefined') {
        // 加载highlight.js样式
        if (!document.querySelector('link[href*="highlight"]')) {
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/atom-one-dark.min.css';
            document.head.appendChild(linkElement);
        }
        
        // 加载highlight.js脚本
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/highlight.min.js';
        script.onload = function() {
            // 脚本加载完成后执行高亮
            hljs.highlightAll();
        };
        document.head.appendChild(script);
    } else {
        // 如果已经加载了highlight.js，直接执行高亮
        hljs.highlightAll();
    }
}

/**
 * 添加代码复制按钮
 */
function initCopyButtons() {
    // 获取所有代码块
    const codeBlocks = document.querySelectorAll('pre code, .code-block');
    
    codeBlocks.forEach(block => {
        // 如果已经有复制按钮，跳过
        if (block.parentNode.querySelector('.copy-btn')) return;
        
        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '复制';
        copyBtn.title = '复制代码';
        
        // 设置相对定位的容器
        if (block.parentNode.style.position !== 'relative') {
            block.parentNode.style.position = 'relative';
        }
        
        // 添加复制按钮到代码块
        block.parentNode.appendChild(copyBtn);
        
        // 添加点击事件
        copyBtn.addEventListener('click', function() {
            // 创建一个临时textarea来复制文本
            const textArea = document.createElement('textarea');
            textArea.value = block.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                // 执行复制命令
                const successful = document.execCommand('copy');
                
                // 根据复制结果显示不同提示
                this.innerHTML = successful ? '已复制!' : '复制失败';
                this.classList.add(successful ? 'success' : 'error');
                
                // 2秒后恢复按钮状态
                setTimeout(() => {
                    this.innerHTML = '复制';
                    this.classList.remove('success', 'error');
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                this.innerHTML = '复制失败';
                this.classList.add('error');
            }
            
            // 移除临时textarea
            document.body.removeChild(textArea);
        });
    });
}

/**
 * 图片懒加载实现
 */
function lazyLoadImages() {
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        // 获取所有图片
        const images = document.querySelectorAll('.main-content img:not(.no-lazy):not(.loaded)');
        
        // 创建观察者
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 当图片进入视口
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 如果有data-src属性，则加载真实图片
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        
                        // 图片加载完成后停止观察该图片
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        // 开始观察所有图片
        images.forEach(img => {
            // 如果没有data-src属性，则设置data-src为当前src
            if (!img.dataset.src) {
                img.dataset.src = img.src;
                // 设置一个占位图或模糊的较小版本
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"%3E%3Crect width="300" height="150" fill="%23f0f0f0"/%3E%3C/svg%3E';
            }
            
            imageObserver.observe(img);
        });
    } else {
        // 如果浏览器不支持IntersectionObserver，直接加载所有图片
        document.querySelectorAll('.main-content img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * 标签过滤系统
 */
function initTagSystem() {
    // 获取所有标签
    const tags = document.querySelectorAll('.tag');
    
    if (tags.length === 0) return;
    
    // 创建标签过滤区域
    const filterContainer = document.createElement('div');
    filterContainer.className = 'tag-filter-container';
    filterContainer.innerHTML = '<h4>按标签筛选</h4><div class="tag-filters"></div>';
    
    // 收集所有标签
    const uniqueTags = new Set();
    tags.forEach(tag => {
        uniqueTags.add(tag.textContent.trim());
    });
    
    // 创建标签过滤按钮
    const tagFiltersContainer = filterContainer.querySelector('.tag-filters');
    uniqueTags.forEach(tag => {
        const filterTag = document.createElement('span');
        filterTag.className = 'filter-tag';
        filterTag.textContent = tag;
        filterTag.addEventListener('click', function() {
            this.classList.toggle('active');
            filterContent();
        });
        tagFiltersContainer.appendChild(filterTag);
    });
    
    // 在合适的位置插入标签过滤区域
    const contentHeader = document.querySelector('.content-header');
    if (contentHeader && contentHeader.nextElementSibling) {
        contentHeader.parentNode.insertBefore(filterContainer, contentHeader.nextElementSibling);
    }
    
    // 过滤内容
    function filterContent() {
        const activeFilters = document.querySelectorAll('.filter-tag.active');
        const filtersArray = Array.from(activeFilters).map(filter => filter.textContent.trim());
        
        // 如果没有活动的过滤器，显示所有内容
        if (filtersArray.length === 0) {
            document.querySelectorAll('.tool-card, .category-card').forEach(item => {
                item.style.display = '';
            });
            return;
        }
        
        // 过滤卡片
        document.querySelectorAll('.tool-card, .category-card').forEach(card => {
            const cardTags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.trim());
            
            // 检查卡片是否包含所有活动的过滤器标签
            const hasAllTags = filtersArray.every(filter => cardTags.includes(filter));
            
            // 设置显示或隐藏
            card.style.display = hasAllTags ? '' : 'none';
        });
    }
}

/**
 * 重新初始化目录导航
 */
function initTableOfContents() {
    const mainContent = document.querySelector('.main-content');
    const tocContainer = document.querySelector('.table-of-contents .toc-list');
    
    if (!mainContent || !tocContainer) return;
    
    // 清空目录
    tocContainer.innerHTML = '';
    
    // 获取所有标题
    const headings = mainContent.querySelectorAll('h2, h3');
    
    // 为每个标题添加ID并创建目录项
    headings.forEach((heading, index) => {
        // 如果标题没有ID，创建一个
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 创建目录项
        const tocItem = document.createElement('li');
        tocItem.className = `toc-item${heading.tagName === 'H3' ? ' sub-item' : ''}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        
        tocItem.appendChild(link);
        tocContainer.appendChild(tocItem);
    });
    
    // 添加点击目录项滚动到对应位置的事件
    document.querySelectorAll('.toc-item a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log("右侧目录已更新");
}

/**
 * 显示错误消息
 */
function showErrorMessage(message) {
    document.querySelector('.main-content').innerHTML = `
        <div class="content-header">
            <h1>加载失败</h1>
        </div>
        <div class="content-section">
            <div class="note">
                <p><strong>错误：</strong> ${message}</p>
                <p>您可以<a href="javascript:window.location.reload()">刷新页面</a>或返回<a href="wiki.html">教程目录</a>。</p>
            </div>
        </div>
    `;
}

/**
 * 检查当前路径并加载对应内容
 */
function checkCurrentPath() {
    const currentPath = window.location.pathname;
    const hash = window.location.hash;
    
    // 如果当前路径有效且不是wiki.html首页
    if (currentPath && !currentPath.endsWith('/wiki.html') && !currentPath.endsWith('/wiki/')) {
        // 如果路径是HTML文件
        if (currentPath.endsWith('.html')) {
            // 存储当前页面状态
            history.replaceState({ path: currentPath }, '', currentPath);
            
            // 加载内容
            loadContent(currentPath, true);
            
            // 如果有锚点，滚动到指定位置
            if (hash) {
                setTimeout(() => {
                    const element = document.querySelector(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 500);
            }
        }
    } else {
        // 确保wiki首页正确加载
        console.log("已加载wiki首页");
        // 重新初始化SPA
        setTimeout(initSPA, 100);
    }
}

/**
 * 修复图片路径问题
 * @param {string} currentPath - 当前页面路径
 */
function fixImagePaths(currentPath) {
    // 获取当前路径的目录部分
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    console.log("基础路径:", basePath);
    
    // 修复所有图片路径
    document.querySelectorAll('.main-content img').forEach(img => {
        const originalSrc = img.getAttribute('src');
        
        // 跳过已处理的或data URI图片
        if (!originalSrc || originalSrc.startsWith('data:') || img.hasAttribute('data-spa-fixed')) {
            return;
        }
        
        console.log("处理图片路径:", originalSrc);
        
        // 如果是相对路径且不是以/或http开头
        if (!originalSrc.startsWith('/') && !originalSrc.startsWith('http')) {
            // 使用规范化函数处理路径
            const newSrc = normalizePath(originalSrc);
            console.log("修正后的图片路径:", newSrc);
            img.src = newSrc;
            img.setAttribute('data-spa-fixed', 'true');
            
            // 添加错误处理，在加载失败时尝试备用路径
            img.onerror = function() {
                console.log("图片加载失败:", this.src);
                
                if (this.hasAttribute('data-spa-fallback')) {
                    // 已经尝试过备用路径，使用占位图像
                    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"%3E%3Crect width="300" height="150" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%23999"%3E图片加载失败%3C/text%3E%3C/svg%3E';
                    this.onerror = null;
                } else {
                    // 尝试备用路径
                    this.setAttribute('data-spa-fallback', 'true');
                    
                    // 尝试从上一级目录查找
                    let fallbackSrc;
                    if (originalSrc.startsWith('images/')) {
                        fallbackSrc = basePath + '../' + originalSrc;
                    } else {
                        fallbackSrc = basePath + originalSrc;
                    }
                    
                    console.log("尝试备用路径:", fallbackSrc);
                    this.src = fallbackSrc;
                }
            };
        }
    });
}

/**
 * 初始化侧边栏功能
 */
function initSidebar() {
    // 获取侧边栏元素
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    // 如果没有侧边栏，直接返回
    if (!sidebar || !sidebarToggle) return;
    
    // 移除旧的事件监听器（防止重复绑定）
    const newToggle = sidebarToggle.cloneNode(true);
    sidebarToggle.parentNode.replaceChild(newToggle, sidebarToggle);
    
    // 添加侧边栏切换事件
    newToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        sidebar.classList.toggle('active');
        
        // 保存侧边栏状态到本地存储
        const isActive = sidebar.classList.contains('active');
        localStorage.setItem('sidebarActive', isActive ? 'true' : 'false');
    });
    
    // 从本地存储恢复侧边栏状态
    const savedSidebarState = localStorage.getItem('sidebarActive');
    if (savedSidebarState === 'true') {
        sidebar.classList.add('active');
        newToggle.classList.add('active');
    } else if (savedSidebarState === 'false') {
        sidebar.classList.remove('active');
        newToggle.classList.remove('active');
    }
    
    // 初始化分类折叠功能
    initCategoryToggles();
}

/**
 * 初始化分类折叠功能
 */
function initCategoryToggles() {
    // 获取所有分类标题
    const categoryTitles = document.querySelectorAll('.category-title');
    
    // 为每个分类标题添加点击事件
    categoryTitles.forEach(title => {
        // 移除旧的事件监听器
        const newTitle = title.cloneNode(true);
        title.parentNode.replaceChild(newTitle, title);
        
        // 获取分类的导航项列表
        const navItems = newTitle.nextElementSibling;
        
        // 添加点击事件
        newTitle.addEventListener('click', function() {
            if (navItems) {
                // 切换折叠状态
                navItems.classList.toggle('collapsed');
                
                // 更新切换图标
                const toggleIcon = this.querySelector('.toggle-icon');
                if (toggleIcon) {
                    toggleIcon.textContent = navItems.classList.contains('collapsed') ? '►' : '▼';
                }
                
                // 保存折叠状态
                saveCollapsedStatesToStorage();
            }
        });
    });
    
    // 恢复保存的折叠状态
    restoreCollapsedStatesFromStorage();
}

/**
 * 保存折叠状态到本地存储
 */
function saveCollapsedStatesToStorage() {
    const states = {};
    document.querySelectorAll('.nav-category').forEach(category => {
        const titleElement = category.querySelector('.category-title');
        if (!titleElement) return;
        
        const title = titleElement.textContent.trim();
        const navItems = category.querySelector('.nav-items');
        if (!navItems) return;
        
        states[title] = navItems.classList.contains('collapsed');
    });
    
    // 保存到本地存储
    localStorage.setItem('navCategoriesState', JSON.stringify(states));
}

/**
 * 从本地存储恢复折叠状态
 */
function restoreCollapsedStatesFromStorage() {
    const savedStates = localStorage.getItem('navCategoriesState');
    if (!savedStates) return;
    
    try {
        const states = JSON.parse(savedStates);
        document.querySelectorAll('.nav-category').forEach(category => {
            const titleElement = category.querySelector('.category-title');
            if (!titleElement) return;
            
            const title = titleElement.textContent.trim();
            const navItems = category.querySelector('.nav-items');
            if (!navItems) return;
            
            const toggleIcon = titleElement.querySelector('.toggle-icon');
            
            // 恢复折叠状态
            if (states[title]) {
                navItems.classList.add('collapsed');
                if (toggleIcon) toggleIcon.textContent = '►';
            } else {
                navItems.classList.remove('collapsed');
                if (toggleIcon) toggleIcon.textContent = '▼';
            }
        });
    } catch (error) {
        console.error('恢复折叠状态出错:', error);
    }
}

/**
 * 滚动监听功能（兼容函数，如果doc-scripts.js已加载则不会执行）
 */
function initScrollSpy() {
    // 如果doc-scripts.js未加载，这个空实现将被使用
    // 如果已经通过doc-scripts.js加载，则会使用那个实现
    if (window.spyInitialized) return;
    
    const headings = document.querySelectorAll('.main-content h2, .main-content h3');
    const tocItems = document.querySelectorAll('.toc-item a');
    
    if (headings.length === 0 || tocItems.length === 0) return;
    
    // 设置标记，防止重复初始化
    window.spyInitialized = true;
    
    // 使用 IntersectionObserver 监听标题进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                
                // 高亮对应的目录项
                tocItems.forEach(item => {
                    const href = item.getAttribute('href').substring(1);
                    
                    if (href === currentId) {
                        item.parentElement.classList.add('active');
                    } else {
                        item.parentElement.classList.remove('active');
                    }
                });
            }
        });
    }, { 
        rootMargin: '-80px 0px -80% 0px', // 顶部偏移，确保标题到达顶部才触发
        threshold: 0 
    });
    
    // 观察所有标题
    headings.forEach(heading => {
        observer.observe(heading);
    });
}

/**
 * 图片预览功能（兼容函数，如果doc-scripts.js未加载时使用）
 */
function initImagePreview() {
    // 如果doc-scripts.js已加载，则使用其实现
    if (window.previewInitialized) return;
    
    // 标记为已初始化
    window.previewInitialized = true;
    
    // 简单实现：为图片添加点击放大功能
    document.querySelectorAll('.main-content img:not(.no-preview)').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            // 检查是否已有模态框
            let modal = document.getElementById('imageModal');
            
            // 如果没有模态框，创建一个
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'imageModal';
                modal.className = 'image-modal';
                modal.innerHTML = `
                    <div class="modal-container">
                        <span id="closeModal">&times;</span>
                        <img id="modalImage" class="modal-content">
                        <div id="caption"></div>
                    </div>
                `;
                document.body.appendChild(modal);
                
                // 添加关闭事件
                document.getElementById('closeModal').addEventListener('click', () => {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                });
            }
            
            // 显示模态框和图片
            modal.style.display = 'block';
            document.getElementById('modalImage').src = this.src;
            document.getElementById('caption').textContent = this.alt || '';
            document.body.style.overflow = 'hidden';
        });
    });
} 