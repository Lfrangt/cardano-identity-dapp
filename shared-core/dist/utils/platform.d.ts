/**
 * Cross-platform utilities for shared-core
 * Provides safe fallbacks when running outside the browser (e.g. React Native)
 */
type StorageLike = {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
};
/**
 * 获取一个通用的存储实现
 * - 浏览器环境下返回 localStorage
 * - React Native 环境返回内存存储（生命周期内有效）
 */
export declare function getStorage(): StorageLike;
/**
 * 检测是否支持 Web Crypto Subtle API
 */
export declare function hasSubtleCrypto(): boolean;
/**
 * 生成随机字节（在没有 crypto.getRandomValues 时回退到 Math.random）
 */
export declare function randomBytes(length: number): Uint8Array;
/**
 * 计算 SHA-256 哈希，React Native 环境下使用轻量级回退算法
 */
export declare function sha256(data: ArrayBuffer | ArrayBufferView): Promise<Uint8Array>;
/**
 * 检查是否存在 FileReader（浏览器特性）
 */
export declare function hasFileReader(): boolean;
export {};
