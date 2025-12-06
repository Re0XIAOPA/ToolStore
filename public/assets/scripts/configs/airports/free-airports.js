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
 * - warning: (可选) 警告提示信息，会在详情弹窗中以警告样式显示
 *   示例: '需进官方频道或群组获取优惠码'
 * - tip: (可选) 提示信息，会在详情弹窗中以提示样式显示
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
 *     warning: '需进官方频道获取优惠码',
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
 *     tip: '推荐使用此机场',
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
            name: '白嫖机场',
            image: '✨',
            category: 'free',
            tier: 'admin-recommend',
            description: '免费机场',
            warning: '需进官方频道或群组获取优惠码',
            link: 'https://xn--mesv7f5toqlp.ink/#/register?code=UesQ8MMb',
            tags: ['免费', '需优惠码']
        },
        {
            name: '小飞云',
            image: '☁️',
            category: 'free',
            tier: 'admin-recommend',
            description: '免费机场服务',
            warning: '需进官方频道或群组获取优惠码',
            link: 'https://xiaofeiyun.sylu.cc/#/register?code=Z97M4hgx',
            tags: ['免费', '需优惠码']
        },
        {
            name: '华夏联盟 Accelerate',
            image: '🚀',
            category: 'free',
            tier: 'admin-recommend',
            description: '免费加速服务',
            warning: '需进官方频道或群组获取优惠码',
            link: 'https://www.huaxia.cyou/#/register?code=R57K9WFf',
            tags: ['免费', '需优惠码']
        },
        {
            name: '乐猫机场',
            image: '🐱',
            category: 'free',
            tier: 'admin-recommend',
            warning: '需进官方频道或群组获取优惠码',
            description: '跑测速和滥用会封用户ip，免费节点是给大伙正常FQ用的，不是拿来24小时跑SpeedTest刷流量。 资源有限，一起珍惜，才有良好的白嫖环境。',
            link: 'https://a1.lemao888.top/#/register?code=T2NQkPvx',
            tags: ['免费', '需优惠码']
        },
    ]
};
