/**
 * Cross-platform utilities for shared-core
 * Provides safe fallbacks when running outside the browser (e.g. React Native)
 */

type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

// Simple in-memory storage as last resort fallback
const memoryStorage = new Map<string, string>()

/**
 * 获取一个通用的存储实现
 * - 浏览器环境下返回 localStorage
 * - React Native 环境返回内存存储（生命周期内有效）
 */
export function getStorage(): StorageLike {
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
    return (globalThis as any).localStorage as StorageLike
  }

  return {
    getItem: (key: string) => (memoryStorage.has(key) ? memoryStorage.get(key)! : null),
    setItem: (key: string, value: string) => {
      memoryStorage.set(key, value)
    },
    removeItem: (key: string) => {
      memoryStorage.delete(key)
    }
  }
}

/**
 * 检测是否支持 Web Crypto Subtle API
 */
export function hasSubtleCrypto(): boolean {
  return typeof globalThis !== 'undefined'
    && typeof (globalThis as any).crypto !== 'undefined'
    && typeof (globalThis as any).crypto.subtle !== 'undefined'
}

/**
 * 生成随机字节（在没有 crypto.getRandomValues 时回退到 Math.random）
 */
export function randomBytes(length: number): Uint8Array {
  if (
    typeof globalThis !== 'undefined'
    && typeof (globalThis as any).crypto !== 'undefined'
    && typeof (globalThis as any).crypto.getRandomValues === 'function'
  ) {
    const array = new Uint8Array(length)
    ;(globalThis as any).crypto.getRandomValues(array)
    return array
  }

  const array = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    array[i] = Math.floor(Math.random() * 256)
  }
  return array
}

/**
 * 计算 SHA-256 哈希，React Native 环境下使用轻量级回退算法
 */
export async function sha256(data: ArrayBuffer | ArrayBufferView): Promise<Uint8Array> {
  const buffer =
    data instanceof ArrayBuffer
      ? data
      : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)

  if (hasSubtleCrypto()) {
    const subtle = (globalThis as any).crypto.subtle
    const hashBuffer = await subtle.digest('SHA-256', buffer)
    return new Uint8Array(hashBuffer)
  }

  // FNV-1a 32 位散列拓展至 32 字节，作为移动端的回退方案
  const view = new Uint8Array(buffer)
  let hash = 0x811c9dc5
  for (let i = 0; i < view.length; i++) {
    hash ^= view[i]
    hash = (hash * 0x01000193) >>> 0
  }

  const result = new Uint8Array(32)
  for (let i = 0; i < 32; i++) {
    hash ^= hash << 13
    hash ^= hash >>> 17
    hash ^= hash << 5
    result[i] = (hash >>> ((i % 4) * 8)) & 0xff
  }
  return result
}

/**
 * 检查是否存在 FileReader（浏览器特性）
 */
export function hasFileReader(): boolean {
  return typeof globalThis !== 'undefined' && typeof (globalThis as any).FileReader !== 'undefined'
}
