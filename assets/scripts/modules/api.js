// API模块 - 模拟从服务器获取数据
import { allCardData } from '../configs/card-data.js';

// 模拟API延迟
const SIMULATED_DELAY = 100; // 毫秒

/**
 * 获取所有卡片数据
 * @returns {Promise} 返回包含所有卡片数据的Promise
 */
export async function fetchAllCardData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(allCardData);
        }, SIMULATED_DELAY);
    });
}

/**
 * 获取指定部分的卡片数据
 * @param {string} section - 部分ID (tools, software, proxy)
 * @returns {Promise} 返回指定部分卡片数据的Promise
 */
export async function fetchSectionData(section) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (allCardData[section]) {
                resolve(allCardData[section]);
            } else {
                reject(new Error(`找不到部分: ${section}`));
            }
        }, SIMULATED_DELAY);
    });
}

/**
 * 更新卡片数据
 * @param {string} section - 部分ID
 * @param {number} index - 卡片索引
 * @param {object} newData - 新的卡片数据
 * @returns {Promise} 返回更新结果的Promise
 */
export async function updateCardData(section, index, newData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (allCardData[section] && allCardData[section].data[index]) {
                // 在真实API中，这里会发送数据到服务器
                // 这里我们只是更新本地数据
                allCardData[section].data[index] = {
                    ...allCardData[section].data[index],
                    ...newData
                };
                resolve({ success: true, message: '数据更新成功' });
            } else {
                reject(new Error('找不到要更新的卡片'));
            }
        }, SIMULATED_DELAY);
    });
}

/**
 * 添加新卡片
 * @param {string} section - 部分ID
 * @param {object} cardData - 新卡片数据
 * @returns {Promise} 返回添加结果的Promise
 */
export async function addCard(section, cardData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (allCardData[section]) {
                // 在真实API中，这里会发送数据到服务器
                allCardData[section].data.push(cardData);
                resolve({ success: true, message: '卡片添加成功', index: allCardData[section].data.length - 1 });
            } else {
                reject(new Error(`找不到部分: ${section}`));
            }
        }, SIMULATED_DELAY);
    });
}

/**
 * 删除卡片
 * @param {string} section - 部分ID
 * @param {number} index - 卡片索引
 * @returns {Promise} 返回删除结果的Promise
 */
export async function deleteCard(section, index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (allCardData[section] && allCardData[section].data[index]) {
                // 在真实API中，这里会发送删除请求到服务器
                allCardData[section].data.splice(index, 1);
                resolve({ success: true, message: '卡片删除成功' });
            } else {
                reject(new Error('找不到要删除的卡片'));
            }
        }, SIMULATED_DELAY);
    });
} 