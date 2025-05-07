
// 处理软件卡片点击事件
function initSoftwareCards() {
    const softwareSection = document.querySelector('#software');
    if (!softwareSection) return;

    const cards = softwareSection.querySelectorAll('.card');
    cards.forEach(card => {
        // 获取原始表格中对应行的链接
        const toolName = card.querySelector('.card-title')?.textContent;
        const originalTable = softwareSection.querySelector('table');
        const originalRow = Array.from(originalTable.querySelectorAll('tr')).find(row =>
            row.querySelector('.tool-name')?.textContent === toolName
        );
        const link = originalRow?.querySelector('a')?.href;

        if (link && link !== '#') {
            // 添加点击事件
            card.addEventListener('click', () => {
                window.open(link, '_blank');
            });

            // 添加鼠标悬停效果类
            card.classList.add('clickable');
        }
    });
}

export { initSoftwareCards }; 