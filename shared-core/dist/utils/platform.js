"use strict";
/**
 * Cross-platform utilities for shared-core
 * Provides safe fallbacks when running outside the browser (e.g. React Native)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorage = getStorage;
exports.hasSubtleCrypto = hasSubtleCrypto;
exports.randomBytes = randomBytes;
exports.sha256 = sha256;
exports.hasFileReader = hasFileReader;
// Simple in-memory storage as last resort fallback
const memoryStorage = new Map();
/**
 * 获取一个通用的存储实现
 * - 浏览器环境下返回 localStorage
 * - React Native 环境返回内存存储（生命周期内有效）
 */
function getStorage() {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        return globalThis.localStorage;
    }
    return {
        getItem: (key) => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
        setItem: (key, value) => {
            memoryStorage.set(key, value);
        },
        removeItem: (key) => {
            memoryStorage.delete(key);
        }
    };
}
/**
 * 检测是否支持 Web Crypto Subtle API
 */
function hasSubtleCrypto() {
    return typeof globalThis !== 'undefined'
        && typeof globalThis.crypto !== 'undefined'
        && typeof globalThis.crypto.subtle !== 'undefined';
}
/**
 * 生成随机字节（在没有 crypto.getRandomValues 时回退到 Math.random）
 */
function randomBytes(length) {
    if (typeof globalThis !== 'undefined'
        && typeof globalThis.crypto !== 'undefined'
        && typeof globalThis.crypto.getRandomValues === 'function') {
        const array = new Uint8Array(length);
        globalThis.crypto.getRandomValues(array);
        return array;
    }
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }
    return array;
}
/**
 * 计算 SHA-256 哈希，React Native 环境下使用轻量级回退算法
 */
async function sha256(data) {
    const buffer = data instanceof ArrayBuffer
        ? data
        : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    if (hasSubtleCrypto()) {
        const subtle = globalThis.crypto.subtle;
        const hashBuffer = await subtle.digest('SHA-256', buffer);
        return new Uint8Array(hashBuffer);
    }
    // FNV-1a 32 位散列拓展至 32 字节，作为移动端的回退方案
    const view = new Uint8Array(buffer);
    let hash = 0x811c9dc5;
    for (let i = 0; i < view.length; i++) {
        hash ^= view[i];
        hash = (hash * 0x01000193) >>> 0;
    }
    const result = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        hash ^= hash << 13;
        hash ^= hash >>> 17;
        hash ^= hash << 5;
        result[i] = (hash >>> ((i % 4) * 8)) & 0xff;
    }
    return result;
}
/**
 * 检查是否存在 FileReader（浏览器特性）
 */
function hasFileReader() {
    return typeof globalThis !== 'undefined' && typeof globalThis.FileReader !== 'undefined';
}
