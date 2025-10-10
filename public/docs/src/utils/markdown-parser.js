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

export function parseMarkdown(markdown) {
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
    
    // 解析图片（必须在链接解析之前）- 添加懒加载属性
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
    
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