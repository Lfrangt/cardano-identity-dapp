"use strict";
/**
 * 测试同步功能
 * 这个文件用于验证 shared-core 是否能正确同步到 Web 和 Mobile
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSync = testSync;
exports.getSharedCoreVersion = getSharedCoreVersion;
exports.testAsyncSync = testAsyncSync;
/**
 * 测试函数：验证共享代码同步
 */
function testSync(platform) {
    return {
        timestamp: Date.now(),
        version: '1.0.0',
        platform,
        message: `✅ Sync successful! Shared code is working on ${platform}`
    };
}
/**
 * 获取共享包版本信息
 */
function getSharedCoreVersion() {
    return '1.0.0 - 共享核心包正常工作';
}
/**
 * 测试异步功能
 */
async function testAsyncSync(platform) {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 100));
    return `🚀 异步测试成功！Platform: ${platform}, Time: ${new Date().toISOString()}`;
}
