// 机场推荐数据
// 从airport-config.js中聚合所有机场
import { airportConfig } from './airport-config.js';

// 将分类和分级的数据扁平化为一维数组用于展示
function flattenAirportData() {
    const flattened = [];
    
    // 遍历所有分类 (paid, free, other)
    Object.entries(airportConfig).forEach(([category, tiers]) => {
        // 遍历所有分级 (firstTier, secondTier, thirdTier, adminPick)
        Object.entries(tiers).forEach(([tier, airports]) => {
            flattened.push(...airports);
        });
    });
    
    return flattened;
}

export const airportData = flattenAirportData();
