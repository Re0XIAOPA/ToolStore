/*
 * ----------------------------------------------------
 * 推荐卡片配置格式说明
 * ----------------------------------------------------
 * 支持两种配置格式：
 * 1. 字符串格式：直接使用工具名称，按默认排序
 *    例：'Clash Verge'
 * 2. 对象格式：使用对象配置，支持热度排序
 *    例：{ name: 'Shadowrocket', hot: 1 }
 *    
 * hot 字段说明：
 * - hot 值越小，排序越靠前（1 > 2 > 3 ...）
 * - 未设置 hot 字段的项目按默认顺序排列在设置了 hot 的项目之后
 * - 相同 hot 值的项目按配置文件中的原始顺序排列
 * 
 * supr 字段说明：
 * - supr 值为 true 时，表示该推荐为至尊推荐
 * - 至尊推荐会显示至尊图标而不是星星图标
 * ----------------------------------------------------
 */

// 推荐卡片配置
export const recommendConfig = {
    // 工具类推荐
    tools: [
        { name: 'Clash Verge', hot: 1, supr: true },
        { name: 'Mihomo Party', hot: 2 },
        { name: 'Shadowrocket', hot: 3 },
        'ClashMeta',
        'Surfboard',
        'singbox',
        'Hiddify',
        'Surge5'
    ],

    // 软件类推荐
    software: [
        { name: 'Netflix', hot: 1, supr: true },
        { name: 'APKPure', hot: 2 },
        '银河录像局',
        'Youtube',
        'Gmail'
    ],

    // 机场类推荐
    proxy: [
        { name: '奶昔机场', hot: 1, supr: true },
        { name: '顶级机场', hot: 2 },
        {name: 'Mitce', hot: 3 },
        { name: '快雷GO', hot: 4 },
        '早安云',
        'CokeCloud(可乐云)',
        '魔法喵MAGICAT',
        'DlerCloud',
        'iNets',
    ]
};