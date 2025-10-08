// 钱包余额和资产工具函数

export interface AssetInfo {
  policyId: string
  assetName: string
  quantity: string
  fingerprint?: string
  metadata?: {
    name?: string
    description?: string
    ticker?: string
    decimals?: number
  }
}

export interface WalletBalance {
  ada: string // ADA 数量字符串，避免科学计数法
  adaNumber: number // ADA 数值（可能会有科学计数法，仅用于小额计算）
  lovelace: string // Lovelace 数量（原始单位）
  assets: AssetInfo[] // 其他代币
  totalValue: string // 总价值字符串
}

/**
 * 将 BigInt lovelace 转换为 ADA 字符串（带2位小数）
 */
function bigIntToAdaString(lovelaceAmount: bigint): { adaString: string, adaNumber: number } {
  const lovelaceStr = lovelaceAmount.toString()
  const len = lovelaceStr.length

  if (len <= 6) {
    // 小于 1 ADA
    const paddedStr = lovelaceStr.padStart(6, '0')
    const integerPart = '0'
    const decimalPart = paddedStr.slice(0, 2) // 只保留2位小数
    const adaString = integerPart + '.' + decimalPart
    const adaNumber = parseFloat(adaString)

    console.log('Small balance:', { adaString, adaNumber })
    return { adaString, adaNumber }
  } else {
    // 大于等于 1 ADA
    const integerPart = lovelaceStr.slice(0, len - 6)
    const decimalPart = lovelaceStr.slice(len - 6, len - 4) // 取前2位作为小数

    const adaString = integerPart + '.' + decimalPart
    // 对于超大数字，parseFloat会有科学计数法，但我们主要用字符串
    const adaNumber = parseFloat(adaString)

    console.log('Large balance:', { integerPart, decimalPart, adaString })
    return { adaString, adaNumber }
  }
}

/**
 * 简单的 CBOR 解码器（仅用于解析余额）
 */
function parseCBORBalance(hex: string): bigint {
  // 移除 0x 前缀
  const cleanHex = hex.replace(/^0x/, '')

  console.log('Parsing CBOR hex:', cleanHex)

  // 检查是否是 CBOR 数组格式 (以 82 开头表示2元素数组)
  if (cleanHex.startsWith('82')) {
    // 跳过数组标记 82
    let pos = 2

    // 读取第一个元素（ADA 余额）
    const firstByte = parseInt(cleanHex.slice(pos, pos + 2), 16)
    console.log('First byte:', firstByte.toString(16))

    if (firstByte === 0x1a) {
      // 0x1a 表示后面跟着 4 字节的无符号整数
      pos += 2
      const balanceHex = cleanHex.slice(pos, pos + 8)
      console.log('Balance hex (4 bytes):', balanceHex)
      return BigInt('0x' + balanceHex)
    } else if (firstByte === 0x1b) {
      // 0x1b 表示后面跟着 8 字节的无符号整数
      pos += 2
      const balanceHex = cleanHex.slice(pos, pos + 16)
      console.log('Balance hex (8 bytes):', balanceHex)
      return BigInt('0x' + balanceHex)
    } else if (firstByte <= 0x17) {
      // 直接编码的小整数 (0-23)
      console.log('Small integer:', firstByte)
      return BigInt(firstByte)
    }
  }

  // 如果不是 CBOR 格式，尝试直接解析
  console.log('Not CBOR format, parsing as direct hex')
  return BigInt('0x' + cleanHex)
}

/**
 * 解析钱包余额
 */
export function parseWalletBalance(balanceHex: string): WalletBalance {
  try {
    // 解析 CBOR 编码的余额
    const lovelaceAmount = parseCBORBalance(balanceHex)
    console.log('Parsed lovelace amount:', lovelaceAmount.toString())

    // 使用自定义函数转换，避免科学计数法
    const { adaString, adaNumber } = bigIntToAdaString(lovelaceAmount)

    return {
      ada: adaString,
      adaNumber: adaNumber,
      lovelace: lovelaceAmount.toString(),
      assets: [], // 基础版本先不解析代币
      totalValue: adaString
    }
  } catch (error) {
    console.error('Error parsing balance:', error)
    return {
      ada: '0.00',
      adaNumber: 0,
      lovelace: '0',
      assets: [],
      totalValue: '0.00'
    }
  }
}

/**
 * 格式化 ADA 金额显示
 */
export function formatADA(amount: number): string {
  if (amount === 0) return '0.00'
  if (amount < 0.01) return '< 0.01'
  if (amount < 1) return amount.toFixed(4)
  if (amount < 1000) return amount.toFixed(2)
  if (amount < 1000000) return `${(amount / 1000).toFixed(2)}K`
  return `${(amount / 1000000).toFixed(2)}M`
}

/**
 * 格式化地址显示
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 20) return address
  return `${address.slice(0, 12)}...${address.slice(-8)}`
}

/**
 * 获取网络名称
 */
export function getNetworkName(networkId: number): string {
  switch (networkId) {
    case 0: return 'Testnet'
    case 1: return 'Mainnet'
    default: return `Network ${networkId}`
  }
}

/**
 * 获取网络状态颜色
 */
export function getNetworkColor(networkId: number): string {
  switch (networkId) {
    case 0: return 'text-orange-600 bg-orange-50'
    case 1: return 'text-green-600 bg-green-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}