/**
 * 其他机场配置
 * 按一线、二线、三线、站长自用、推荐分类
 * 
 * 机场对象字段说明：
 * - name: 机场名称
 * - image: 卡片图标 (可以是路径或 emoji)
 *          路径示例: 'assets/images/airports/test-airport.png' (推荐 128×128px)
 *          emoji 示例: '⚠️', '❌', '⁉️' 等
 * - category: 分类，固定为 'other'
 * - tier: 等级 ('first-tier'|'second-tier'|'third-tier'|'admin-pick'|'admin-recommend')
 * - description: 机场描述 (支持 HTML 标签如 <br>)
 * - link: 官网链接
 * - tags: 标签数组 ['注意', '警告', '却不掞']
 * - moreContent: (可选) 详情弹窗额外内容
 *   - images: 图片数组 [{url: 'assets/images/airports-imgs/xxx.png', alt: '说明'}]
 * 
 * 示例 - 使用图片路径：
 * {
 *     name: '测试机场',
 *     image: 'assets/images/airports/test-airport.png',
 *     category: 'other',
 *     tier: 'first-tier',
 *     description: '这个机场程度未知，警慎使用',
 *     moreContent: {
 *         images: [
 *             { url: 'assets/images/airports-imgs/test1.png', alt: '测试图片' }
 *         ]
 *     },
 *     link: 'https://testairport.example.com/',
 *     tags: ['测试', '警告', '却不掞']
 * }
 * 
 * 示例 - 使用 emoji：
 * {
 *     name: '危险机场',
 *     image: '⚠️',
 *     category: 'other',
 *     tier: 'admin-pick',
 *     description: '这个机场可能不安全',
 *     link: 'https://danger-airport.example.com/',
 *     tags: ['危险', '警告', '需警慎']
 * }
 */

export const otherAirports = {
    // 一线机场
    'firstTier': [],
    // 二线机场
    'secondTier': [],
    // 三线机场
    'thirdTier': [],
    // 站长自用
    'adminPick': [],
    // 站长推荐
    'adminRecommend': []
};
