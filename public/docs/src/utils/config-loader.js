// 配置加载器，支持从Markdown文件中提取配置信息
export class ConfigLoader {
    // 从Markdown内容中提取元数据
    static extractMetadata(content) {
        const metadata = {};
        
        // 匹配YAML front matter
        const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = content.match(frontMatterRegex);
        
        if (match) {
            const frontMatter = match[1];
            const lines = frontMatter.split('\n');
            
            for (const line of lines) {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join(':').trim();
                    // 处理数组类型的值
                    if (value.startsWith('[') && value.endsWith(']')) {
                        try {
                            metadata[key.trim()] = JSON.parse(value);
                        } catch (e) {
                            metadata[key.trim()] = value.slice(1, -1).split(',').map(item => item.trim());
                        }
                    } else {
                        metadata[key.trim()] = value.replace(/^['"]|['"]$/g, ''); // 去除引号
                    }
                }
            }
        }
        
        return metadata;
    }
    
    // 生成侧边栏配置
    static generateSidebarConfig(docsStructure) {
        const sidebarConfig = {};
        
        for (const [path, groups] of Object.entries(docsStructure)) {
            sidebarConfig[path] = groups.map(group => ({
                text: group.title,
                items: group.files.map(file => ({
                    text: file.title,
                    link: file.path
                }))
            }));
        }
        
        return sidebarConfig;
    }
    
    // 解析文档结构
    static parseDocsStructure() {
        // 这是一个示例结构，实际项目中可以从文件系统动态生成
        return {
            '/': [
                {
                    title: '入门指南',
                    files: [
                        { title: '介绍', path: 'index.md' },
                        { title: '快速开始', path: 'guide/quick-start.md' },
                        { title: '安装说明', path: 'guide/installation.md' }
                    ]
                },
                {
                    title: '工具使用',
                    files: [
                        { title: 'Clash Verge', path: 'tools/clash-verge.md' },
                        { title: 'ClashMeta', path: 'tools/clashmeta.md' },
                        { title: 'Shadowrocket', path: 'tools/shadowrocket.md' }
                    ]
                },
                {
                    title: '开发指南',
                    files: [
                        { title: '贡献指南', path: 'development/contributing.md' },
                        { title: '项目结构', path: 'development/architecture.md' }
                    ]
                }
            ]
        };
    }
}