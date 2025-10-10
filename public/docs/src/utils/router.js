// 路由系统
export class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }
    
    // 添加路由
    addRoute(path, handler) {
        this.routes[path] = handler;
        return this;
    }
    
    // 导航到指定路径
    navigateTo(path) {
        // 更新URL但不刷新页面
        history.pushState({ path }, '', `#${path}`);
        this.handleRouteChange(path);
    }
    
    // 处理路由变化
    handleRouteChange(path) {
        this.currentRoute = path;
        
        // 查找匹配的路由处理器
        const handler = this.routes[path] || this.routes['*'];
        if (handler) {
            handler(path);
        }
        
        // 触发路由变化事件
        const event = new CustomEvent('route:change', { detail: { path } });
        document.dispatchEvent(event);
    }
    
    // 启动路由监听
    start() {
        // 处理浏览器前进后退按钮
        window.addEventListener('popstate', (event) => {
            const path = event.state ? event.state.path : this.getDefaultPath();
            this.handleRouteChange(path);
        });
        
        // 处理页面加载时的初始路由
        const initialPath = this.getCurrentPath();
        this.handleRouteChange(initialPath);
        
        // 监听链接点击事件
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (link) {
                event.preventDefault();
                const path = link.getAttribute('href').substring(1);
                this.navigateTo(path);
            }
        });
    }
    
    // 获取当前路径
    getCurrentPath() {
        return window.location.hash.substring(1) || this.getDefaultPath();
    }
    
    // 获取默认路径
    getDefaultPath() {
        return 'index.md';
    }
    
    // 解析路径参数
    static parseParams(path) {
        const parts = path.split('?');
        const route = parts[0];
        const params = {};
        
        if (parts[1]) {
            const paramPairs = parts[1].split('&');
            paramPairs.forEach(pair => {
                const [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            });
        }
        
        return { route, params };
    }
    
    // 生成路径
    static generatePath(route, params = {}) {
        const paramStrings = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
            
        return paramStrings ? `${route}?${paramStrings}` : route;
    }
}