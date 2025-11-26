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
    
    const codeBlockPlaceholders = [];
    const inlineCodePlaceholders = [];
    
    // 提前处理代码块，防止后续替换破坏格式
    const codeBlockRegex = /```([a-z0-9]*)[ \t]*\r?\n([\s\S]*?)\r?\n?```/gi;
    html = html.replace(codeBlockRegex, (match, lang = '', code) => {
        const token = `%%CODEBLOCK${codeBlockPlaceholders.length}%%`;
        const normalized = code.replace(/^\n+|\n+$/g, '');
        codeBlockPlaceholders.push({
            token,
            value: `<pre class="code-block"><code class="language-${lang || 'text'}">${escapeHtml(normalized)}</code></pre>`
        });
        return token;
    });
    
    // 解析行内代码，保持原样
    html = html.replace(/`([^`\n]+)`/g, (match, code) => {
        const token = `%%INLINECODE${inlineCodePlaceholders.length}%%`;
        inlineCodePlaceholders.push({ token, value: `<code>${escapeHtml(code)}</code>` });
        return token;
    });
    
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
        const convertedSrc = convertImagePath(src, filePath);
        return `<img src="${convertedSrc}" alt="${alt}" loading="lazy">`;
    });
    
    // 解析链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
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
    
    // 解析段落（允许行内HTML，例如链接）
    const blockTagPattern = /^(?:\s*<(?:\/)?(?:h[1-6]|ul|ol|li|pre|blockquote|code|img|hr))/i;
    html = html.split('\n').map(line => {
        if (!line.trim()) {
            return line;
        }
        
        if (blockTagPattern.test(line.trim())) {
            return line;
        }
        
        if (line.includes('%%CODEBLOCK')) {
            return line;
        }
        
        if (line.trim().startsWith('<p') && line.trim().endsWith('</p>')) {
            return line;
        }
        
        return `<p>${line}</p>`;
    }).join('\n');
    
    // 恢复代码块与行内代码
    codeBlockPlaceholders.forEach(({ token, value }) => {
        html = html.replace(new RegExp(token, 'g'), value);
    });
    
    inlineCodePlaceholders.forEach(({ token, value }) => {
        html = html.replace(new RegExp(token, 'g'), value);
    });
    
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

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}