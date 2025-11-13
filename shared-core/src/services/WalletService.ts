import { Lucid, Blockfrost, Network } from '@lucid-evolution/lucid'
import { 
  CardanoWindow, 
  CardanoWalletAPI, 
  WalletConnection, 
  WalletError, 
  WalletErrorCodes, 
  SUPPORTED_WALLETS 
} from '../types/wallet'

export class WalletService {
  private lucid: Lucid | null = null
  private connectedWallet: CardanoWalletAPI | null = null
  private network: Network = 'Preview' // 使用预览网络进行开发

  constructor() {
    // 延迟初始化，避免服务器端错误
    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  /**
   * 初始化Lucid实例
   */
  private async initialize() {
    try {
      // 只在需要时初始化 Lucid
      if (typeof window !== 'undefined') {
        this.lucid = await Lucid.new(
          new Blockfrost(
            'https://cardano-preview.blockfrost.io/api/v0',
            process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || 'preview_test_key'
          ),
          this.network
        )
      }
    } catch (error) {
      console.error('Failed to initialize Lucid:', error)
    }
  }

  /**
   * 检测已安装的钱包
   */
  detectWallets(): string[] {
    const cardanoWindow = window as unknown as CardanoWindow
    const availableWallets: string[] = []

    if (cardanoWindow.cardano) {
      SUPPORTED_WALLETS.forEach(wallet => {
        if (cardanoWindow.cardano![wallet.name]) {
          availableWallets.push(wallet.name)
        }
      })
    }

    return availableWallets
  }

  /**
   * 检查特定钱包是否已安装
   */
  isWalletInstalled(walletName: string): boolean {
    const cardanoWindow = window as unknown as CardanoWindow
    return !!(cardanoWindow.cardano && cardanoWindow.cardano[walletName])
  }

  /**
   * 连接钱包
   */
  async connectWallet(walletName: string): Promise<WalletConnection> {
    try {
      if (!this.isWalletInstalled(walletName)) {
        throw this.createError(
          WalletErrorCodes.NOT_INSTALLED,
          `${walletName} wallet is not installed`
        )
      }

      const cardanoWindow = window as unknown as CardanoWindow
      const walletAPI = cardanoWindow.cardano![walletName]
      
      // 启用钱包
      const api = await walletAPI.enable()
      this.connectedWallet = api

      // 设置Lucid钱包
      if (!this.lucid) {
        await this.initialize()
      }
      
      if (this.lucid) {
        this.lucid.selectWallet(api)
      }

      // 获取地址和余额
      const address = await this.getAddress()
      const balance = await this.getBalance()
      const networkId = await api.getNetworkId()
      
      // 验证网络
      const expectedNetworkId = this.network === 'Mainnet' ? 1 : 0
      if (networkId !== expectedNetworkId) {
        throw this.createError(
          WalletErrorCodes.NETWORK_MISMATCH,
          `Wallet is on wrong network. Expected: ${this.network}`
        )
      }

      const connection: WalletConnection = {
        address,
        balance,
        network: this.network.toLowerCase() as WalletConnection['network'],
        walletName,
        isConnected: true
      }

      // 保存到本地存储
      this.saveConnection(connection)

      return connection

    } catch (error: any) {
      console.error('Wallet connection failed:', error)
      
      if (error.code === 4) {
        throw this.createError(
          WalletErrorCodes.USER_REJECTED,
          'User rejected the connection request'
        )
      }

      if (error instanceof Error && error.message.includes('not installed')) {
        throw this.createError(
          WalletErrorCodes.NOT_INSTALLED,
          `${walletName} wallet is not installed`
        )
      }

      throw this.createError(
        WalletErrorCodes.CONNECTION_FAILED,
        error.message || 'Failed to connect wallet'
      )
    }
  }

  /**
   * 断开钱包连接
   */
  async disconnectWallet(): Promise<void> {
    this.connectedWallet = null
    if (this.lucid) {
      this.lucid.selectWallet(null as any)
    }
    
    // 清除本地存储
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cardano_wallet_connection')
    }
  }

  /**
   * 获取当前地址
   */
  async getAddress(): Promise<string> {
    if (!this.lucid) {
      throw this.createError(WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized')
    }

    try {
      return await this.lucid.wallet.address()
    } catch (error) {
      throw this.createError(WalletErrorCodes.INVALID_ADDRESS, 'Failed to get wallet address')
    }
  }

  /**
   * 获取余额（以ADA为单位）
   */
  async getBalance(): Promise<number> {
    if (!this.lucid) {
      throw this.createError(WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized')
    }

    try {
      const utxos = await this.lucid.wallet.getUtxos()
      let totalLovelace = 0n

      utxos.forEach(utxo => {
        totalLovelace += utxo.assets.lovelace || 0n
      })

      // 转换为ADA (1 ADA = 1,000,000 Lovelace)
      return Number(totalLovelace) / 1_000_000
    } catch (error) {
      console.error('Failed to get balance:', error)
      return 0
    }
  }

  /**
   * 获取UTXOs
   */
  async getUtxos() {
    if (!this.lucid) {
      throw this.createError(WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized')
    }

    return await this.lucid.wallet.getUtxos()
  }

  /**
   * 签名交易
   */
  async signTransaction(tx: any): Promise<any> {
    if (!this.lucid) {
      throw this.createError(WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized')
    }

    try {
      const signedTx = await tx.sign().complete()
      return signedTx
    } catch (error: any) {
      if (error.code === 4) {
        throw this.createError(
          WalletErrorCodes.USER_REJECTED,
          'User rejected transaction signing'
        )
      }
      
      throw this.createError(
        WalletErrorCodes.TRANSACTION_FAILED,
        error.message || 'Failed to sign transaction'
      )
    }
  }

  /**
   * 提交交易
   */
  async submitTransaction(signedTx: any): Promise<string> {
    if (!this.lucid) {
      throw this.createError(WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized')
    }

    try {
      const txHash = await signedTx.submit()
      return txHash
    } catch (error: any) {
      throw this.createError(
        WalletErrorCodes.TRANSACTION_FAILED,
        error.message || 'Failed to submit transaction'
      )
    }
  }

  /**
   * 恢复之前的连接
   */
  async restoreConnection(): Promise<WalletConnection | null> {
    if (typeof window === 'undefined') return null

    try {
      const savedConnection = localStorage.getItem('cardano_wallet_connection')
      if (!savedConnection) return null

      const connection: WalletConnection = JSON.parse(savedConnection)
      
      // 验证钱包仍然可用
      if (!this.isWalletInstalled(connection.walletName)) {
        this.clearSavedConnection()
        return null
      }

      // 尝试重新连接
      const cardanoWindow = window as unknown as CardanoWindow
      const walletAPI = cardanoWindow.cardano![connection.walletName]
      const isEnabled = await walletAPI.isEnabled()
      
      if (isEnabled) {
        const api = await walletAPI.enable()
        this.connectedWallet = api
        
        if (!this.lucid) {
          await this.initialize()
        }
        
        if (this.lucid) {
          this.lucid.selectWallet(api)
        }

        // 更新余额
        const currentBalance = await this.getBalance()
        const updatedConnection = { ...connection, balance: currentBalance }
        this.saveConnection(updatedConnection)
        
        return updatedConnection
      }

      return null
    } catch (error) {
      console.error('Failed to restore wallet connection:', error)
      this.clearSavedConnection()
      return null
    }
  }

  /**
   * 获取Lucid实例
   */
  getLucid(): Lucid | null {
    return this.lucid
  }

  /**
   * 获取当前连接的钱包API
   */
  getConnectedWallet(): CardanoWalletAPI | null {
    return this.connectedWallet
  }

  /**
   * 保存连接信息到本地存储
   */
  private saveConnection(connection: WalletConnection): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cardano_wallet_connection', JSON.stringify(connection))
    }
  }

  /**
   * 清除保存的连接信息
   */
  private clearSavedConnection(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cardano_wallet_connection')
    }
  }

  /**
   * 创建标准化错误
   */
  private createError(code: WalletErrorCodes, message: string, info?: any): WalletError {
    return {
      code,
      message,
      info
    } as WalletError
  }
}

// 导出单例实例
export const walletService = new WalletService()