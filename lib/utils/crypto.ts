/**
 * 加密和解密工具函数
 * 使用 Web Crypto API 实现 AES-256-GCM 加密
 */

/**
 * 从密码生成加密密钥
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * 加密文件
 * @param file 要加密的文件
 * @param password 加密密码
 * @returns 加密后的数据和元数据
 */
export async function encryptFile(file: File, password: string): Promise<{
  encryptedData: ArrayBuffer
  salt: Uint8Array
  iv: Uint8Array
  metadata: {
    fileName: string
    fileType: string
    fileSize: number
  }
}> {
  // 生成随机盐值和初始化向量
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // 从密码派生密钥
  const key = await deriveKey(password, salt)

  // 读取文件内容
  const fileData = await file.arrayBuffer()

  // 加密文件
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    fileData
  )

  return {
    encryptedData,
    salt,
    iv,
    metadata: {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    }
  }
}

/**
 * 解密文件
 * @param encryptedData 加密的数据
 * @param password 解密密码
 * @param salt 盐值
 * @param iv 初始化向量
 * @returns 解密后的数据
 */
export async function decryptFile(
  encryptedData: ArrayBuffer,
  password: string,
  salt: Uint8Array,
  iv: Uint8Array
): Promise<ArrayBuffer> {
  // 从密码派生密钥
  const key = await deriveKey(password, salt)

  // 解密数据
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encryptedData
  )

  return decryptedData
}

/**
 * 将加密数据打包成单个 Blob
 */
export function packageEncryptedFile(
  encryptedData: ArrayBuffer,
  salt: Uint8Array,
  iv: Uint8Array,
  metadata: any
): Blob {
  // 创建包含所有数据的对象
  const package_data = {
    version: '1.0',
    salt: Array.from(salt),
    iv: Array.from(iv),
    metadata,
    data: Array.from(new Uint8Array(encryptedData))
  }

  return new Blob([JSON.stringify(package_data)], { type: 'application/json' })
}

/**
 * 解包加密文件
 */
export function unpackageEncryptedFile(blob: Blob): Promise<{
  encryptedData: ArrayBuffer
  salt: Uint8Array
  iv: Uint8Array
  metadata: any
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const package_data = JSON.parse(reader.result as string)
        resolve({
          encryptedData: new Uint8Array(package_data.data).buffer,
          salt: new Uint8Array(package_data.salt),
          iv: new Uint8Array(package_data.iv),
          metadata: package_data.metadata
        })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(blob)
  })
}

/**
 * 从钱包地址生成加密密码
 * 这样用户不需要记住额外的密码
 */
export async function generatePasswordFromWallet(walletAddress: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(walletAddress)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 计算文件哈希
 */
export async function calculateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
