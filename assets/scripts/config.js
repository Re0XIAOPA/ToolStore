// 缓存策略配置
export const cacheConfig = {
    // 强缓存设置
    strongCache: {
      maxAge: 259200, // 3天
      immutable: true
    },
    
    // 协商缓存设置
    negotiateCache: {
      etag: true,
      lastModified: true
    }
  };
  
  // 懒加载配置
  export const lazyLoadConfig = {
    // 图片懒加载
    images: {
      threshold: 0.1,
      rootMargin: '50px'
    },
    
    // 脚本懒加载
    scripts: {
      threshold: 0.3,
      rootMargin: '100px'
    }
  };
  