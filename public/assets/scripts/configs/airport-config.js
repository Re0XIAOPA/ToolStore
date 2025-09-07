// 机场配置数据
const airportDetails = {
    // 顶级机场
    '顶级机场': {
        description: '稳定流媒体解锁、三网运营商高质量线路<br>总线路接入100Gbps以上带宽、单日限制总套餐的10%',
        packages: [
            {
                name: '年付每月200G',
                price: '15.60',
                period: '年',
                traffic: '200G/月'
            },
            {
                name: '月付1000G',
                price: '6.50',
                period: '月',
                traffic: '1000G/月'
            },
            {
                name: '高级月付套餐',
                price: '13.00',
                period: '月',
                traffic: '3000G/月'
            },
            {
                name: '不限时200G套餐',
                price: '12.00',
                period: '一次性',
                traffic: '200G/一次性'
            },
            {
                name: '不限时2000G套餐',
                price: '45.00',
                period: '一次性',
                traffic: '2000G/一次性'
            },
            {
                name: '不限时6000G套餐',
                price: '90.00',
                period: '一次性',
                traffic: '6000G/一次性'
            }
        ],
        link: 'https://xn--mes358a9urctx.com/#/register?code=fY6Y8I3k',
        tags: ['稳定', '高速', '性价比']
    },
    // FSCloud
    'FSCloud': {
        description: '家宽速度 万人群聊使用 秒开4K 直接访问',
        packages: [
            {
                name: '小份套餐',
                price: '13.00',
                period: '年',
                traffic: '100G/月',
                speed: '1000Mbps'
            },
            {
                name: '中份套餐',
                price: '9.00',
                period: '季',
                traffic: '350G/月',
                speed: '1000Mbps'
            },
            {
                name: '大份套餐',
                price: '10.00',
                period: '月',
                traffic: '1200G/月',
                speed: '1000Mbps'
            }
        ],
        link: 'https://dash.fscloud.homes/#/register?code=LQF59pkU',
        tags: ['稳定', '高速', '性价比']
    },
    // 早安云
    '早安云': {
        description: '十分优惠推荐备用',
        packages: [
            {
                name: '日光初显',
                price: '1.00',
                period: '月',
                traffic: '100G/月',
                speed: '不限速'
            },
            {
                name: '彩霞骤至',
                price: '2.00',
                period: '月',
                traffic: '500G/月',
                speed: '不限速'
            },
            {
                name: '日出东山',
                price: '3.00',
                period: '月',
                traffic: '1024G/月',
                speed: '不限速'
            },
        ],
        
        link: 'https://xn--9kqy92aw5h.com/#/register?code=O0Mcbu1C',
        tags: ['稳定', '高速', '性价比']
    },
    // 狗狗加速
    '狗狗加速': {
        description: '稳定快速、速度保障秒开4K、价格偏于月付',
        packages: [
            {
                name: '标准套餐',
                price: '15.80',
                period: '月',
                traffic: '160G/月',
                speed: '150Mbps'
            },
            {
                name: '高级套餐',
                price: '20.80',
                period: '月',
                traffic: '200G/月',
                speed: '不限速'
            },
            {
                name: '豪华套餐',
                price: '39.80',
                period: '月',
                traffic: '500G/月',
                speed: '不限速'
            }
        ],
        
        link: 'https://go.dginv.click/#/register?code=FdXt0gA2',
        tags: ['稳定', '高速', '性价比']
    },
    // Needay
    'Needay': {
        description: '超便宜、稳定、快速、节点多、节点倍率适中',
        packages: [
            {
                name: '月付套餐',
                price: '10.00',
                period: '月',
                traffic: '200G/月'
            },
            {
                name: '月付套餐',
                price: '15.00',
                period: '月',
                traffic: '400G/月'
            },
            {
                name: '月付套餐',
                price: '20.00',
                period: '月',
                traffic: '600G/月'
            },
            {
                name: '年付套餐',
                price: '35.00',
                period: '年',
                traffic: '300G/月'
            }
        ],
        link: 'https://needaycloud.xyz/#/register?code=dWkLWMTf',
        tags: ['稳定', '高速', '性价比']
    },
    //魔法喵MAGICAT
    '魔法喵MAGICAT': {
        description: '4K、8K无压力、快速、节点多、所有节点1x倍率',
        packages: [
            {
                name: '月付套餐A',
                price: '9.90',
                period: '月',
                traffic: '786G/月'
            },
            {
                name: '月付套餐B',
                price: '14.99',
                period: '月',
                traffic: '1152/月'
            },
            {
                name: '月付套餐C',
                price: '19.99',
                period: '月',
                traffic: '1536/月'
            }
        ],
        link: 'https://magicat.click/register?code=jVzrdmom',
        tags: ['稳定', '高速', '性价比']
    },
    // 星舰云
    '星舰云': {
        description: '超便宜、稳定、快速、节点多、节点倍率适中(1.5x-5x)',
        packages: [
            {
                name: '年付套餐',
                price: '15.00',
                period: '年',
                traffic: '300G/月'
            }
        ],
        link: 'https://xingclouds.xyz/#/register?code=L3DcR9kF',
        tags: ['稳定', '高速', '性价比']
    },
    // 云安云
    '云安云': {
        description: '便宜、稳定、快速、但月付、有优惠',
        packages: [
            {
                name: '月付套餐',
                price: '7.00',
                period: '月',
                traffic: '120G/月'
            },
            {
                name: '月付套餐',
                price: '13.00',
                period: '月',
                traffic: '238G/月'
            }
        ],
        link: 'https://yunanyun.app/#/register?code=QqGbRwUf',
        tags: ['稳定', '高速', '性价比']
    },
    // Mitce
    'Mitce': {
        description: '超便宜、全球网站排行17万左右、包稳定',
        packages: [
            {
                name: '基础套餐',
                price: '4.32',
                period: '月',
                traffic: '100G/月',
                speed: '1000Mbps'
            },
            {
                name: '标准套餐',
                price: '8.63',
                period: '月',
                traffic: '500G/月',
                speed: '1000Mbps'
            },
            {
                name: '专业套餐',
                price: '14.39',
                period: '月',
                traffic: '1000G/月',
                speed: '1000Mbps'
            }
        ],
        link: 'https://mitce.net/aff.php?aff=3878',
        tags: ['稳定', '高速', '性价比']
    },
    // CokeCloud(可乐云)
    'CokeCloud(可乐云)': {
        description: '便宜、稳定、专线、专线高速、快速、节点多、多设备、不限速<br>节点倍率(1x)，解锁流媒体，多地区支持（港口/欧美/东南亚等）',
        packages: [
            {
                name: '早餐套餐 @ 月付',
                price: '9.90',
                period: '月',
                traffic: '200GB/月',
                speed: '300Mbps',
            },
            {
                name: '客车早餐套餐 @ 月付',
                price: '12.00',
                period: '月',
                traffic: '400GB/月',
                speed: '200Mbps',
            },
            {
                name: '奶茶套餐 @ 季付',
                price: '25.90',
                period: '季',
                traffic: '300GB/月',
                speed: '200Mbps'
            },
            {
                name: '电影票套餐 @ 半年付',
                price: '38.90',
                period: '半年',
                traffic: '200GB/月',
                speed: '200Mbps'
            },
            {
                name: '游戏机专线 @ 年付',
                price: '180.00',
                period: '年',
                traffic: '100GB/月',
                speed: '不限速'
            },
            {
                name: '午餐专线 @ 月付',
                price: '22.00',
                period: '月',
                traffic: '200GB/月',
                speed: '不限速'
            },
            {
                name: '音乐会专线 @ 月付',
                price: '40.00',
                period: '月',
                traffic: '500GB/月',
                speed: '不限速'
            },
            {
                name: '寿司专线 @ 半年付',
                price: '102.00',
                period: '半年',
                traffic: '150GB/月',
                speed: '不限速'
            },
            {
                name: 'TikTok/INS运营专线',
                price: '200.00',
                period: '月',
                traffic: '1000GB/月',
                speed: '不限速'
            }
            // 其他套餐可按相同格式继续追加...
        ],
        link: 'https://test.buyzur.com/#/register?code=F7gWu5IA',
        tags: ['稳定', '高速', '性价比']
    },
    "快雷GO": {
        description: '节点支持中转和专线，支持tiktok/推特/ins/油管/奈飞/迪士尼/Chat GPT等',
        packages: [
            {
                name: '小包',
                price: '20.90',
                period: '月',
                traffic: '150G/月',
                speed: '300Mbps'
            },
            {
                name: '中包',
                price: '30.00',
                period: '月',
                traffic: '300G/月',
                speed: '500Mbps'
            },
            {
                name: '大包',
                price: '50.00',
                period: '月',
                traffic: '800G/月',
                speed: '1000Mbps'
            },
            {
                name: '旗舰包',
                price: '150.00',
                period: '月',
                traffic: '3000G/月',
                speed: '1000Mbps'
            },
            {
                name: '流量包 300G',
                price: '99.00',
                period: '',
                traffic: '一次性(可单独购买)',
                speed: '1000Mbps'
            },
            {
                name: '流量包 1000G',
                price: '199.00',
                period: '',
                traffic: '一次性(可单独购买)',
                speed: '1000Mbps'
            }
        ],
        link: 'https://kuailei.nnbhhxk.com/register?code=XVcVMy4e',
        tags: ['稳定', '高速', '中转', '专线']
    }
    // 可以添加更多机场配置...
};

// 导出配置
export { airportDetails }; 
