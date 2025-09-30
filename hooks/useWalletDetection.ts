import { useEffect, useCallback } from 'react'
import { useWallet } from '@/stores/useWalletStore'

export const useWalletDetection = () => {
  const { detectWallets, restoreConnection, availableWallets } = useWallet()

  // 检测钱包
  const detectAvailableWallets = useCallback(() => {
    if (typeof window === 'undefined') return
    
    // 延迟执行，确保钱包扩展已加载
    setTimeout(() => {
      detectWallets()
    }, 1000)
  }, [detectWallets])

  // 组件挂载时的初始化
  useEffect(() => {
    // 检测可用钱包
    detectAvailableWallets()
    
    // 尝试恢复之前的连接
    restoreConnection()

    // 监听窗口焦点，用户可能在其他标签页安装了钱包
    const handleFocus = () => {
      detectAvailableWallets()
    }

    window.addEventListener('focus', handleFocus)
    
    // 监听钱包扩展的加载事件
    const handleLoad = () => {
      detectAvailableWallets()
    }

    window.addEventListener('load', handleLoad)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('load', handleLoad)
    }
  }, [detectAvailableWallets, restoreConnection])

  return {
    availableWallets,
    detectWallets: detectAvailableWallets
  }
}