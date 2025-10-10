const fs = require('fs');
const path = require('path');

// 检查图片文件
const imagePath = path.join(__dirname, 'docs', 'tools', '微信图片_2025-10-10_221315_703.png');

console.log('检查图片文件:', imagePath);

// 检查文件是否存在
if (fs.existsSync(imagePath)) {
    console.log('✓ 文件存在');
    
    // 获取文件信息
    const stats = fs.statSync(imagePath);
    console.log('文件大小:', stats.size, '字节');
    console.log('最后修改时间:', stats.mtime);
    
    // 读取文件内容检查
    try {
        const buffer = fs.readFileSync(imagePath);
        console.log('文件可以正常读取');
        console.log('文件前10字节:', buffer.slice(0, 10));
        
        // 检查是否是有效的PNG文件
        // PNG文件头应该是 89 50 4E 47 0D 0A 1A 0A
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            console.log('✓ 文件是有效的PNG格式');
        } else {
            console.log('⚠ 文件可能不是PNG格式');
        }
    } catch (err) {
        console.log('✗ 读取文件时出错:', err.message);
    }
} else {
    console.log('✗ 文件不存在');
}

// 检查目录结构
const docsDir = path.join(__dirname, 'docs');
const toolsDir = path.join(__dirname, 'docs', 'tools');

console.log('\n检查目录结构:');
console.log('docs目录存在:', fs.existsSync(docsDir));
console.log('tools目录存在:', fs.existsSync(toolsDir));

if (fs.existsSync(toolsDir)) {
    const files = fs.readdirSync(toolsDir);
    console.log('tools目录中的文件:');
    files.forEach(file => {
        console.log('  -', file);
    });
}