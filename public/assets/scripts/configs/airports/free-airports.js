/**
 * 免费机场配置
 * 按一线、二线、三线、站长自用、推荐分类
 * 
 * 机场对象字段说明：
 * - name: 机场名称
 * - image: 卡片图标 (可以是路径或 emoji)
 *          路径示例: 'assets/images/airports/free-example.png' (推荐 128×128px)
 *          emoji 示例: '🙋', '🏆', '🌟' 等
 * - category: 分类，固定为 'free'
 * - tier: 等级 ('first-tier'|'second-tier'|'third-tier'|'admin-pick'|'admin-recommend')
 * - description: 机场描述 (支持 HTML 标签如 <br>)
 * - link: 官网或下载链接
 * - tags: 标签数组 ['免费', '稳定', '性价比']
 * - moreContent: (可选) 详情弹窗额外内容
 *   - images: 图片数组 [{url: 'assets/images/airports-imgs/xxx.png', alt: '说明'}]
 * 
 * 示例 - 使用图片路径：
 * {
 *     name: '免费机场',
 *     image: 'assets/images/airports/free-example.png',
 *     category: 'free',
 *     tier: 'first-tier',
 *     description: '一个不错的免费机场',
 *     moreContent: {
 *         images: [
 *             { url: 'assets/images/airports-imgs/free1.png' }
 *         ]
 *     },
 *     link: 'https://freealirport.com/',
 *     tags: ['免费', '稳定', '性价比']
 * }
 * 
 * 示例 - 使用 emoji：
 * {
 *     name: '爱心六床',
 *     image: '🙋',
 *     category: 'free',
 *     tier: 'admin-recommend',
 *     description: '免费且很不错',
 *     link: 'https://free-airport.example.com/',
 *     tags: ['免费', '正规', '有心']
 * }
 */

export const freeAirports = {
    // 一线机场
    'firstTier': [],
    // 二线机场
    'secondTier': [],
    // 三线机场
    'thirdTier': [],
    // 站长自用
    'adminPick': [],
    // 站长推荐
    'adminRecommend': [
        {
            name: '乐猫机场',
            image: '🐱',
            category: 'free',
            tier: 'admin-recommend',
            description: '这是站长自用的机场，欢迎使用！',
            link: 'https://a1.lemao888.top/#/register?code=T2NQkPvx',
            tags: ['站长自用', '免费']
        }
    ]
};
