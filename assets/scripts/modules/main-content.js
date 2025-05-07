// main-content.js - 处理主要内容的模块化组件

// 工具客户端部分渲染
export function renderToolsSection() {
    // 这里可以动态创建工具客户端部分的内容
    // 如果内容已经在HTML中定义，则不需要重复创建
    // console.log('工具客户端部分已初始化');
}

// 软件推荐部分渲染
export function renderSoftwareSection() {
    // 这里可以动态创建软件推荐部分的内容
    // 如果内容已经在HTML中定义，则不需要重复创建
    // console.log('软件推荐部分已初始化');
}

// 机场推荐部分渲染
export function renderProxySection() {
    // 这里可以动态创建机场推荐部分的内容
    // 如果内容已经在HTML中定义，则不需要重复创建
    // console.log('机场推荐部分已初始化');
}

// 初始化所有主要内容区域
export function initMainContent() {
    // 检查是否已经初始化过，避免重复初始化
    if (window.mainContentInitialized) {
        // console.log('主内容已经初始化过，跳过重复初始化');
        return;
    }
    
    renderToolsSection();
    renderSoftwareSection();
    renderProxySection();
    
    // 标记已初始化
    window.mainContentInitialized = true;
    // console.log('主内容初始化完成');
}