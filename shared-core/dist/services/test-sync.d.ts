/**
 * 测试同步功能
 * 这个文件用于验证 shared-core 是否能正确同步到 Web 和 Mobile
 */
export interface SyncTestResult {
    timestamp: number;
    version: string;
    platform: 'web' | 'mobile';
    message: string;
}
/**
 * 测试函数：验证共享代码同步
 */
export declare function testSync(platform: 'web' | 'mobile'): SyncTestResult;
/**
 * 获取共享包版本信息
 */
export declare function getSharedCoreVersion(): string;
/**
 * 测试异步功能
 */
export declare function testAsyncSync(platform: 'web' | 'mobile'): Promise<string>;
