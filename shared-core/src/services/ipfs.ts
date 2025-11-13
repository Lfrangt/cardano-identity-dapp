import { getStorage, hasFileReader, sha256 } from '../utils/platform'

/**
 * IPFS 存储服务
 * 使用 Pinata 或 NFT.Storage 等公共 IPFS 服务
 */

export interface IPFSUploadResult {
  cid: string // IPFS 内容标识符
  url: string // 访问 URL
  gateway: string // 使用的网关
}

/**
 * 上传文件到 IPFS (使用 NFT.Storage)
 */
export async function uploadToIPFS(
  file: Blob,
  fileName: string = 'file'
): Promise<IPFSUploadResult> {
  try {
    console.log('开始上传到 IPFS...', { fileName, size: file.size })

    // 优先使用 NFT.Storage
    const nftStorageKey = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    if (nftStorageKey && nftStorageKey !== 'your_nft_storage_key') {
      console.log('使用 NFT.Storage IPFS 服务')
      try {
        return await uploadToNFTStorage(file, fileName, nftStorageKey)
      } catch (nftError) {
        console.warn('NFT.Storage 上传失败，尝试其他方式:', nftError)
      }
    }

    // 备用方案：Pinata
    const pinataKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
    const pinataSecret = process.env.NEXT_PUBLIC_PINATA_SECRET

    if (pinataKey && pinataSecret &&
        pinataKey !== 'your_pinata_key' &&
        pinataSecret !== 'your_pinata_secret') {
      console.log('使用 Pinata IPFS 服务')
      try {
        return await uploadToPinata(file, fileName, pinataKey, pinataSecret)
      } catch (pinataError) {
        console.warn('Pinata 上传失败:', pinataError)
      }
    }

    // 最后使用本地模拟
    console.warn('⚠️ 所有 IPFS 服务不可用，使用本地模拟模式')
    const mockCID = await simulateIPFSUpload(file)

    return {
      cid: mockCID,
      url: `https://ipfs.io/ipfs/${mockCID}`,
      gateway: 'ipfs.io (模拟)'
    }
  } catch (error) {
    console.error('IPFS 上传失败:', error)
    throw new Error('上传到 IPFS 失败')
  }
}

/**
 * 使用 Pinata 上传文件
 */
async function uploadToPinata(
  file: Blob,
  fileName: string,
  apiKey: string,
  apiSecret: string
): Promise<IPFSUploadResult> {
  try {
    console.log('开始使用 Pinata 上传...', { fileName })

    const formData = new FormData()
    formData.append('file', file, fileName)

    const metadata = JSON.stringify({
      name: fileName,
    })
    formData.append('pinataMetadata', metadata)

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': apiKey,
        'pinata_secret_api_key': apiSecret
      },
      body: formData
    })

    console.log('Pinata 响应状态:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Pinata 错误响应:', errorText)
      throw new Error(`Pinata upload failed (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log('Pinata 响应数据:', data)

    const cid = data.IpfsHash

    if (!cid) {
      console.error('未找到 CID，完整响应:', data)
      throw new Error('Pinata 响应中未找到 CID')
    }

    console.log('✅ Pinata 上传成功, CID:', cid)

    return {
      cid,
      url: `https://gateway.pinata.cloud/ipfs/${cid}`,
      gateway: 'gateway.pinata.cloud'
    }
  } catch (error: any) {
    console.error('Pinata 上传失败:', error)
    throw new Error(`IPFS 上传失败: ${error.message || '未知错误'}`)
  }
}

/**
 * 使用 NFT.Storage 上传文件
 */
async function uploadToNFTStorage(
  file: Blob,
  fileName: string,
  apiKey: string
): Promise<IPFSUploadResult> {
  try {
    console.log('开始使用 NFT.Storage 上传...', {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      apiKeyPrefix: apiKey.substring(0, 10) + '...'
    })

    // 使用 /upload 端点上传文件
    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': file.type || 'image/jpeg'
      },
      body: file
    })

    console.log('NFT.Storage 响应状态:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('NFT.Storage 错误响应:', errorText)

      if (response.status === 401) {
        throw new Error('NFT.Storage API 密钥无效或已过期')
      } else if (response.status === 403) {
        throw new Error('NFT.Storage API 密钥权限不足')
      }

      throw new Error(`NFT.Storage 上传失败 (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log('NFT.Storage 响应数据:', data)

    // NFT.Storage 响应格式: { ok: true, value: { cid: "...", size: ..., ... } }
    const cid = data.value?.cid || data.cid

    if (!cid) {
      console.error('未找到 CID，完整响应:', data)
      throw new Error('NFT.Storage 响应中未找到 CID')
    }

    console.log('✅ NFT.Storage 上传成功, CID:', cid)

    return {
      cid,
      url: `https://nftstorage.link/ipfs/${cid}`,
      gateway: 'nftstorage.link'
    }
  } catch (error: any) {
    console.error('❌ NFT.Storage 上传失败:', error)
    throw error
  }
}

/**
 * 模拟 IPFS 上传（用于开发和演示）
 * 生成一个基于文件内容的唯一标识符
 */
async function simulateIPFSUpload(file: Blob): Promise<string> {
  // 读取文件内容并计算哈希
  const arrayBuffer = await file.arrayBuffer()
  const hashArray = Array.from(await sha256(arrayBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  // 生成类似 IPFS CID 的标识符
  // 真实的 CID 格式：QmXxx... 或 bafxxx...
  const mockCID = 'Qm' + hashHex.slice(0, 44)

  console.log('模拟 IPFS CID 生成:', mockCID)

  // 在本地存储中保存（模拟 IPFS），仅在可用时执行
  if (hasFileReader()) {
    try {
      const dataURL = await blobToDataURL(file)
      const storage = getStorage()
      storage.setItem(`ipfs_${mockCID}`, dataURL)
    } catch (error) {
      console.warn('模拟 IPFS 保存失败，但不影响使用:', error)
    }
  }

  return mockCID
}

/**
 * 从 IPFS 获取文件
 */
export async function getFromIPFS(cid: string): Promise<Blob> {
  try {
    // 首先尝试从本地存储获取（开发模式）
    const storage = getStorage()
    const localData = storage.getItem(`ipfs_${cid}`)
    if (localData) {
      return dataURLToBlob(localData)
    }

    // 生产环境：从 IPFS 网关获取
    const response = await fetch(`https://ipfs.io/ipfs/${cid}`)
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS')
    }

    return await response.blob()
  } catch (error) {
    console.error('从 IPFS 获取文件失败:', error)
    throw new Error('无法从 IPFS 获取文件')
  }
}

/**
 * 检查 IPFS 内容是否存在
 */
export async function checkIPFSExists(cid: string): Promise<boolean> {
  try {
    // 检查本地存储
    const storage = getStorage()
    if (storage.getItem(`ipfs_${cid}`)) {
      return true
    }

    // 检查 IPFS 网关
    const response = await fetch(`https://ipfs.io/ipfs/${cid}`, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * 辅助函数：Blob 转 DataURL
 */
function blobToDataURL(blob: Blob): Promise<string> {
  if (hasFileReader()) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // 非浏览器环境直接抛错，由调用方捕获后回退
  return Promise.reject(new Error('FileReader not available in this environment'))
}

/**
 * 辅助函数：DataURL 转 Blob
 */
function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',')
  const mimeMatch = parts[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'
  const bstr = atob(parts[1])
  const n = bstr.length
  const u8arr = new Uint8Array(n)

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i)
  }

  return new Blob([u8arr], { type: mime })
}

/**
 * 获取 IPFS 配置指南
 */
export function getIPFSSetupGuide(): string {
  return `
# IPFS 配置指南

## 使用 NFT.Storage (推荐)

1. 访问 https://nft.storage
2. 注册账号并获取 API 密钥
3. 在项目中添加环境变量:
   NEXT_PUBLIC_NFT_STORAGE_API_KEY=your_api_key

## 使用 Pinata

1. 访问 https://pinata.cloud
2. 注册账号并获取 API 密钥和 Secret
3. 添加环境变量:
   NEXT_PUBLIC_PINATA_API_KEY=your_api_key
   NEXT_PUBLIC_PINATA_SECRET=your_secret

## 使用 Web3.Storage

1. 访问 https://web3.storage
2. 注册并获取 API token
3. 添加环境变量:
   NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token
  `.trim()
}
