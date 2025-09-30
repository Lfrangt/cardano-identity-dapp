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
  ada: number // ADA 数量（单位：ADA）
  lovelace: string // Lovelace 数量（原始单位）
  assets: AssetInfo[] // 其他代币
  totalValue: number // 总价值（ADA）
}

/**
 * 解析钱包余额
 */
export function parseWalletBalance(balanceHex: string): WalletBalance {
  try {
    // 移除可能的 '0x' 前缀
    const cleanHex = balanceHex.replace(/^0x/, '')
    
    // 将十六进制转换为 BigInt
    const lovelaceAmount = BigInt('0x' + cleanHex)
    
    // 使用 BigInt 进行精确计算，避免科学计数法
    const adaAmount = Number(lovelaceAmount) / 1_000_000
    
    // 如果数字太大，使用字符串计算
    let formattedAda: number
    if (lovelaceAmount > BigInt(Number.MAX_SAFE_INTEGER)) {
      // 对于超大数字，手动计算
      const adaString = lovelaceAmount.toString()
      const decimalPoint = adaString.length - 6
      if (decimalPoint <= 0) {
        formattedAda = parseFloat('0.' + '0'.repeat(-decimalPoint) + adaString)
      } else {
        const integerPart = adaString.slice(0, decimalPoint)
        const decimalPart = adaString.slice(decimalPoint)
        formattedAda = parseFloat(integerPart + '.' + decimalPart)
      }
    } else {
      formattedAda = adaAmount
    }
    
    return {
      ada: formattedAda,
      lovelace: lovelaceAmount.toString(),
      assets: [], // 基础版本先不解析代币
      totalValue: formattedAda
    }
  } catch (error) {
    console.error('Error parsing balance:', error)
    return {
      ada: 0,
      lovelace: '0',
      assets: [],
      totalValue: 0
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