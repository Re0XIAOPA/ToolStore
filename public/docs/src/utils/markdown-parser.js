// Markdown解析工具
export async function loadMarkdownContent(filePath) {
    try {
        // 在实际项目中，这里会从服务器加载Markdown文件
        // 为了演示，我们返回一个示例内容
        const response = await fetch(`./docs/${filePath}`);
        
        if (!response.ok) {
            throw new Error(`无法加载文档: ${filePath}`);
        }
        
        const markdownText = await response.text();
        return markdownText; // 返回原始内容，让主程序处理解析
    } catch (error) {
        console.error('加载Markdown文件失败:', error);
        throw error;
    }
}

export function parseMarkdown(markdown, filePath) {
    // 更完整的Markdown解析实现
    let html = markdown;
    
    // 解析标题
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    
    // 解析粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // 解析斜体
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // 解析删除线
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // 解析图片（必须在链接解析之前）- 添加懒加载属性和路径转换
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        // 转换图片路径
        const convertedSrc = convertImagePath(src, filePath);
        return `<img src="${convertedSrc}" alt="${alt}" loading="lazy">`;
    });
    
    // 解析链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // 解析代码块
    html = html.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, '<pre class="language-$1"><code>$2</code></pre>');
    
    // 解析行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 解析引用块
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // 解析水平线
    html = html.replace(/^---$/gm, '<hr>');
    
    // 解析无序列表
    html = html.replace(/^\s*[-+*]\s(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    // 解析有序列表
    html = html.replace(/^\s*\d+\.\s(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
    
    // 解析段落
    html = html.replace(/^([^\n<]+)$/gm, '<p>$1</p>');
    
    // 处理换行
    html = html.replace(/\n/g, '\n');
    
    return html;
}

// 转换图片路径的函数
function convertImagePath(src, filePath) {
    // 如果已经是绝对路径或完整的URL，直接返回
    if (src.startsWith('/') || src.startsWith('http') || src.startsWith('https')) {
        return src;
    }
    
    // 如果是相对路径，需要根据文件位置进行转换
    if (src.startsWith('./') || src.startsWith('../')) {
        // 获取文件所在目录
        const fileDir = filePath.substring(0, filePath.lastIndexOf('/'));
        // 构建相对于docs/src目录的路径
        if (fileDir) {
            return `docs/${fileDir}/${src.substring(2)}`;
        } else {
            return `docs/${src.substring(2)}`;
        }
    }
    
    // 如果是直接的相对路径（不以./开头），也需要转换
    if (!src.includes(':') && !src.startsWith('/')) {
        const fileDir = filePath.substring(0, filePath.lastIndexOf('/'));
        if (fileDir) {
            return `docs/${fileDir}/${src}`;
        } else {
            return `docs/${src}`;
        }
    }
    
    // 默认情况直接返回
    return src;
}