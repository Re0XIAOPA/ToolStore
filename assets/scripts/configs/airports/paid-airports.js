/**
 * 付费机场配置
 * 按一线、二线、三线、站长自用、推荐分类
 * 
 * 机场对象字段说明：
 * - name: 机场名称
 * - image: 卡片图标 (可以是路径或 emoji) 
 *          路径示例: 'assets/images/airports/example.png' (推荐 128×128px)
 *          emoji 示例: '✈️', '🚀', '🎯' 等
 * - category: 分类，固定为 'paid'
 * - tier: 等级 ('first-tier'|'second-tier'|'third-tier'|'admin-pick'|'admin-recommend')
 * - description: 机场描述 (支持 HTML 标签如 <br>)
 * - link: 官网注册链接
 * - tags: 标签数组 ['稳定', '高速', '性价比']
 * - moreContent: (可选) 详情弹窗额外内容
 *   - images: 图片数组 [{url: 'assets/images/airports-imgs/xxx.png', alt: '说明'}]
 * 
 * 示例 - 使用图片路径：
 * {
 *     name: '示例机场',
 *     image: 'assets/images/airports/example.png',
 *     category: 'paid',
 *     tier: 'admin-recommend',
 *     description: '这是一个示例机场的描述',
 *     moreContent: {
 *         images: [
 *             { url: 'assets/images/airports-imgs/example1.png', alt: '示例图片1' },
 *             { url: 'assets/images/airports-imgs/example2.png' }
 *         ]
 *     },
 *     link: 'https://example.com/register?code=yourcode',
 *     tags: ['稳定', '高速', '性价比']
 * }
 * 
 * 示例 - 使用 emoji：
 * {
 *     name: '火箭机场',
 *     image: '🚀',
 *     category: 'paid',
 *     tier: 'admin-recommend',
 *     description: '高速推荐机场',
 *     link: 'https://rocket-airport.com/',
 *     tags: ['快速', '推荐']
 * }
 */

export const paidAirports = {
    // 一线机场
    'firstTier': [
        {
            name: '奶昔机场',
            image: 'assets/images/airports/naixi.png',
            category: 'paid',
            tier: 'first-tier',
            description: '佩奇家主站机场，一家全线中转线路的高端机场，成立大概三年多了，机场主也比较佛系，机场是他们公司副业，过于高端的话还有他们家的副机场AmyTelecom',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/Nexitally.png' }
                ]
            },
            link: 'https://naiixi.com/signupbyemail.aspx?MemberCode=b185bb15b4504ae7873ceb635488b0b820250906194555',
            tags: ['高端机场', '一线机场', '稳定', '高速', '中转', '专线']
        },
        {
            name: 'Dlercloud',
            image: '',
            category: 'paid',
            tier: 'first-tier',
            description: '一家历史悠久的一线机场，从最早一批机场发展至今，已稳定运营超过十年。凭借丰富的经验与深厚的技术积累，它在延迟、稳定性、带宽冗余等方面都保持着一流水准。线路类型十分全面，提供专线 / 中转 / 直连 / 游戏优化等多种接入方式，能够满足不同使用场景需求。支持多种订阅格式与主流客户端，兼容性强、易于使用，是长期用户信赖的老牌高质量机场代表。',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/DlerCloud.png' }
                ]
            },
            link: 'https://dler.pro/auth/register?affid=214696',
            tags: ['高端机场', '一线机场', '稳定', '高速', '中转', '专线']
        },
    ],
    // 二线机场
    'secondTier': [],
    // 三线机场
    'thirdTier': [],
    // 站长自用
    'adminPick': [],
    // 站长推荐
    'adminRecommend': [
        {
            name: 'iNets',
            image: '',
            category: 'paid',
            tier: 'admin-recommend',
            description: '这款运营超十年的老牌一线机场，是跨境出行、海外娱乐与办公的优质网络后盾。它全面接入163PP、CN2GIA、9929等多类高端线路，覆盖港、日、台、美、德等全球多区域节点，还提供专线、中转、直连、游戏优化等多元接入方式，在延迟、稳定性和带宽上均达一流水准；不仅能轻松解锁Netflix、Disney+等流媒体及ChatGPT等AI工具，还支持多订阅格式与主流客户端，全程不限速且不限制连接数，仅不兼容QuantumX、Surge等无Vless-Xtls-Reality协议的软件，凭借深厚技术积累成为长期用户信赖的网络服务之选。',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/iNetS.png' }
                ]
            },
            link: 'https://inets.io/#/register?code=EquCu65T',
            tags: ['Reality协议', '不限制连接', '不限速']
        },
        {
            name: '顶级机场',
            image: 'assets/images/airports/dingjijichang.jpg',
            category: 'paid',
            tier: 'admin-recommend',
            description: '稳定流媒体解锁、三网运营商高质量线路<br>总线路接入100Gbps以上带宽、单日限制总套餐的10%',
            moreContent: {
                images: [
                    {
                        url: 'assets/images/airports-imgs/顶级机场.png',
                    }
                ]
            },
            link: 'https://xn--mes358a9urctx.com/#/register?code=fY6Y8I3k',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: 'FSCloud',
            image: 'assets/images/airports/FSCloud.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '家宽速度 万人群聊使用 秒开4K 直接访问',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/FSCloud1.png' },
                    { url: 'assets/images/airports-imgs/FSCloud2.png' },
                    { url: 'assets/images/airports-imgs/FSCloud3.png' }
                ]
            },
            link: 'https://dash.fscloud.homes/#/register?code=LQF59pkU',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: '狗狗加速',
            image: 'assets/images/airports/gougou.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '稳定快速、速度保障秒开4K、价格偏于月付',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/狗狗加速.png' }
                ]
            },
            link: 'https://go.dginv.click/#/register?code=FdXt0gA2',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: '快雷GO',
            image: 'assets/images/airports/kuailei.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '节点支持中转和专线，支持tiktok/推特/ins/油管/奈飞/迪士尼/Chat GPT等',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/快雷GO.png' }
                ]
            },
            link: 'https://kuailei.nnbhhxk.com/register?code=XVcVMy4e',
            tags: ['稳定', '高速', '中转', '专线']
        },
        {
            name: '早安云',
            image: 'assets/images/airports/zaoan.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '十分优惠推荐备用',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/早安云.png' }
                ]
            },
            link: 'https://xn--9kqy92aw5h.net/#/register?code=O0Mcbu1C',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: 'Needay',
            image: 'assets/images/airports/NeedayCloud.jpg',
            category: 'paid',
            tier: 'admin-recommend',
            description: '超便宜、稳定、快速、节点多、节点倒率适中',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/NeedayCloud.png' }
                ]
            },
            link: 'https://needaycloud.xyz/#/register?code=dWkLWMTf',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: '魔法喵MAGICAT',
            image: 'assets/images/airports/MAGICAT.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '4K、8K无压力、快速、节点多、所有节点1x倒率',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/魔法喵.png' }
                ]
            },
            link: 'https://magicat.click/register?code=jVzrdmom',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: 'Mitce',
            image: 'assets/images/airports/Mitce.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '超便宜、全球网站排行17万左右、包稳定',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/Mitce1.png' },
                    { url: 'assets/images/airports-imgs/Mitce2.png' }
                ]
            },
            link: 'https://mitce.net/aff.php?aff=3878',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: 'CokeCloud(可乐云)',
            image: 'assets/images/airports/CokeCloud.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '便宜、稳定、专线、专线高速、快速、节点多、多设备、不限速<br>节点倒率(1x)，解锁流媒体，多地区支持（港口/欧美/东南亚等）',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/CokeCloud.png' }
                ]
            },
            link: 'https://cokecloud.net/#/register?code=F7gWu5IA',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: '星舰云',
            image: 'assets/images/airports/xingclouds.jpg',
            category: 'paid',
            tier: 'admin-recommend',
            description: '超便宜、稳定、快速、节点多、节点倒率适中(1.5x-5x)',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/星舰云.png' }
                ]
            },
            link: 'https://xingclouds.xyz/#/register?code=L3DcR9kF',
            tags: ['稳定', '高速', '性价比']
        },
        {
            name: '云安云',
            image: 'assets/images/airports/yunan.png',
            category: 'paid',
            tier: 'admin-recommend',
            description: '便宜、稳定、快速、但月付、有优惠',
            moreContent: {
                images: [
                    { url: 'assets/images/airports-imgs/云安云.png' }
                ]
            },
            link: 'https://yay520.com/login?code=QqGbRwUf',
            tags: ['稳定', '高速', '性价比']
        }
    ]
};
