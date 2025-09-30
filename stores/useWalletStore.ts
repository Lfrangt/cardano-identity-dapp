import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WalletConnection, WalletError, SUPPORTED_WALLETS } from '@/lib/types/wallet'
import { walletService } from '@/lib/services/WalletService'

interface WalletStore {
  // 状态
  connection: WalletConnection | null
  isConnecting: boolean
  error: WalletError | null
  availableWallets: string[]
  
  // 动作
  connect: (walletName: string) => Promise<void>
  disconnect: () => Promise<void>
  refreshBalance: () => Promise<void>
  clearError: () => void
  detectWallets: () => void
  restoreConnection: () => Promise<void>
  
  // 计算属性
  isConnected: () => boolean
  getWalletInfo: (walletName: string) => typeof SUPPORTED_WALLETS[0] | undefined
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      connection: null,
      isConnecting: false,
      error: null,
      availableWallets: [],

      // 连接钱包
      connect: async (walletName: string) => {
        set({ isConnecting: true, error: null })
        
        try {
          const connection = await walletService.connectWallet(walletName)
          set({ 
            connection, 
            isConnecting: false, 
            error: null 
          })
        } catch (error: any) {
          console.error('Wallet connection error:', error)
          set({ 
            connection: null, 
            isConnecting: false, 
            error: error as WalletError 
          })
          throw error
        }
      },

      // 断开钱包
      disconnect: async () => {
        try {
          await walletService.disconnectWallet()
          set({ 
            connection: null, 
            error: null 
          })
        } catch (error: any) {
          console.error('Wallet disconnect error:', error)
          set({ 
            error: error as WalletError 
          })
        }
      },

      // 刷新余额
      refreshBalance: async () => {
        const { connection } = get()
        if (!connection) return

        try {
          const newBalance = await walletService.getBalance()
          set({ 
            connection: { 
              ...connection, 
              balance: newBalance 
            } 
          })
        } catch (error: any) {
          console.error('Failed to refresh balance:', error)
          set({ 
            error: error as WalletError 
          })
        }
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 检测可用钱包
      detectWallets: () => {
        if (typeof window === 'undefined') return
        
        try {
          const available = walletService.detectWallets()
          set({ availableWallets: available })
        } catch (error) {
          console.error('Failed to detect wallets:', error)
          set({ availableWallets: [] })
        }
      },

      // 恢复连接
      restoreConnection: async () => {
        try {
          const connection = await walletService.restoreConnection()
          if (connection) {
            set({ connection, error: null })
          }
        } catch (error: any) {
          console.error('Failed to restore connection:', error)
          set({ 
            connection: null, 
            error: error as WalletError 
          })
        }
      },

      // 计算属性 - 是否已连接
      isConnected: () => {
        const { connection } = get()
        return !!(connection && connection.isConnected)
      },

      // 计算属性 - 获取钱包信息
      getWalletInfo: (walletName: string) => {
        return SUPPORTED_WALLETS.find(wallet => wallet.name === walletName)
      }
    }),
    {
      name: 'wallet-store',
      partialize: (state) => ({ 
        connection: state.connection 
      }), // 只持久化连接信息
    }
  )
)

// 导出类型化的hooks
export const useWallet = () => {
  const store = useWalletStore()
  
  return {
    // 状态
    connection: store.connection,
    isConnecting: store.isConnecting,
    error: store.error,
    availableWallets: store.availableWallets,
    isConnected: store.isConnected(),
    
    // 动作
    connect: store.connect,
    disconnect: store.disconnect,
    refreshBalance: store.refreshBalance,
    clearError: store.clearError,
    detectWallets: store.detectWallets,
    restoreConnection: store.restoreConnection,
    getWalletInfo: store.getWalletInfo,
  }
}