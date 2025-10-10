import { sidebarConfig } from '../configs/sidebar-config.js';
import { docsStructureConfig } from '../configs/docs-structure.js';

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
                        // 处理布尔值
                        if (value.trim().toLowerCase() === 'true') {
                            metadata[key.trim()] = true;
                        } else if (value.trim().toLowerCase() === 'false') {
                            metadata[key.trim()] = false;
                        } else {
                            metadata[key.trim()] = value.replace(/^['"]|['"]$/g, ''); // 去除引号
                        }
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
            // 过滤掉隐藏的文件
            const filteredGroups = groups.map(group => {
                const filteredFiles = group.files.filter(file => !file.hidden);
                return {
                    ...group,
                    files: filteredFiles
                };
            }).filter(group => group.files.length > 0); // 过滤掉空的组
            
            sidebarConfig[path] = filteredGroups.map(group => ({
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
    static async parseDocsStructure() {
        // 定义文档结构
        const structure = {
            '/': []
        };
        
        // 使用导入的侧边栏配置
        const groups = sidebarConfig;
        
        // 按照顺序处理每个组
        for (const group of groups) {
            try {
                // 获取目录中的文件列表
                const files = await this.getFilesInDirectory(group.dir);
                
                // 过滤并排序文件
                const mdFiles = files
                    .filter(file => file.endsWith('.md'))
                    .map(async (file) => {
                        // 加载文件内容以获取元数据
                        const filePath = group.dir === '.' ? file : `${group.dir}/${file}`;
                        try {
                            const content = await this.loadFileContent(filePath);
                            const metadata = this.extractMetadata(content);
                            
                            return {
                                title: metadata.title || this.extractTitleFromFileContent(content) || file.replace('.md', ''),
                                path: filePath,
                                order: metadata.order || 0,
                                hidden: metadata.hidden || false
                            };
                        } catch (error) {
                            console.warn(`无法加载文件 ${filePath}:`, error);
                            return {
                                title: file.replace('.md', ''),
                                path: filePath,
                                order: 0,
                                hidden: false
                            };
                        }
                    });
                
                // 等待所有文件处理完成
                const resolvedFiles = await Promise.all(mdFiles);
                
                // 按照order排序
                const sortedFiles = resolvedFiles
                    .filter(file => !file.hidden)
                    .sort((a, b) => a.order - b.order);
                
                // 只有当组中有文件时才添加到结构中
                if (sortedFiles.length > 0) {
                    structure['/'].push({
                        title: group.title,
                        files: sortedFiles
                    });
                }
            } catch (error) {
                console.warn(`处理目录 ${group.dir} 时出错:`, error);
            }
        }
        
        return structure;
    }
    
    // 获取目录中的文件列表
    static async getFilesInDirectory(dir) {
        // 使用从配置文件导入的文档结构配置
        return docsStructureConfig[dir] || [];
    }
    
    // 加载文件内容
    static async loadFileContent(filePath) {
        try {
            // 构建正确的文件路径
            const fullPath = `./docs/${filePath}`;
            const response = await fetch(fullPath);
            
            if (!response.ok) {
                throw new Error(`无法加载文件: ${fullPath}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error('加载文件内容失败:', error);
            throw error;
        }
    }
    
    // 从文件内容中提取标题
    static extractTitleFromFileContent(content) {
        // 移除元数据部分
        const contentWithoutMetadata = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
        
        // 匹配第一个标题
        const titleMatch = contentWithoutMetadata.match(/^#\s+(.*$)/m);
        return titleMatch ? titleMatch[1] : null;
    }
}