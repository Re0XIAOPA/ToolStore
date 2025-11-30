/**
 * 机场配置聚合文件
 * 
 * 结构：
 * - paid: 付费机场
 *   - firstTier: 一线机场
 *   - secondTier: 二线机场
 *   - thirdTier: 三线机场
 *   - adminPick: 站长自用机场
 * - free: 免费机场
 *   - firstTier: 一线机场
 *   - secondTier: 二线机场
 *   - thirdTier: 三线机场
 *   - adminPick: 站长自用机场
 * - other: 其他机场
 *   - firstTier: 一线机场
 *   - secondTier: 二线机场
 *   - thirdTier: 三线机场
 *   - adminPick: 站长自用机场
 */

import { paidAirports } from './airports/paid-airports.js';
import { freeAirports } from './airports/free-airports.js';
import { otherAirports } from './airports/other-airports.js';

export const airportConfig = {
    paid: paidAirports,
    free: freeAirports,
    other: otherAirports
};
