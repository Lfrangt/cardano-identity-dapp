'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  Download, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  RefreshCw
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { useWallet } from '@/stores/useWalletStore'
import { useWalletDetection } from '@/hooks/useWalletDetection'
import { SUPPORTED_WALLETS, WalletErrorCodes } from '@/lib/types/wallet'
import { cn } from '@/lib/utils'

interface WalletConnectorProps {
  onConnect?: (connected: boolean) => void
  className?: string
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ 
  onConnect, 
  className 
}) => {
  const { 
    connection, 
    isConnecting, 
    error, 
    isConnected, 
    connect, 
    disconnect, 
    clearError,
    getWalletInfo 
  } = useWallet()
  
  const { availableWallets } = useWalletDetection()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  // 通知父组件连接状态变化
  useEffect(() => {
    if (onConnect) {
      onConnect(isConnected)
    }
  }, [isConnected, onConnect])

  // 处理钱包连接
  const handleConnect = async (walletName: string) => {
    if (isConnecting) return
    
    setSelectedWallet(walletName)
    clearError()
    
    try {
      await connect(walletName)
      setSelectedWallet(null)
    } catch (error) {
      console.error('Connection failed:', error)
      setSelectedWallet(null)
    }
  }

  // 处理断开连接
  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  // 清除错误并重试
  const handleRetry = () => {
    clearError()
    if (selectedWallet) {
      handleConnect(selectedWallet)
    }
  }

  // 如果已连接，显示连接状态
  if (isConnected && connection) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("max-w-md mx-auto", className)}
      >
        <GlassCard className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">钱包已连接</h3>
              <p className="text-sm text-gray-600">
                {getWalletInfo(connection.walletName)?.displayName || connection.walletName}
              </p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">地址:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {connection.address.slice(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">余额:</span>
              <span className="font-semibold">{connection.balance.toFixed(2)} ADA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">网络:</span>
              <span className="capitalize">{connection.network}</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <AnimatedButton 
              variant="secondary" 
              size="sm"
              onClick={handleDisconnect}
              className="flex-1"
            >
              断开连接
            </AnimatedButton>
            <AnimatedButton 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
            </AnimatedButton>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("max-w-2xl mx-auto", className)}
    >
      <GlassCard className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            连接你的Cardano钱包
          </h3>
          
          <p className="text-gray-600">
            选择一个钱包来访问你的去中心化身份
          </p>
        </div>

        {/* 错误显示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 mb-1">连接失败</h4>
                    <p className="text-sm text-red-700 mb-3">{error.message}</p>
                    
                    {error.code === WalletErrorCodes.USER_REJECTED && (
                      <p className="text-xs text-red-600">
                        请在钱包中接受连接请求
                      </p>
                    )}
                    
                    {error.code === WalletErrorCodes.NOT_INSTALLED && (
                      <p className="text-xs text-red-600">
                        请先安装钱包扩展程序
                      </p>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={handleRetry}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-lg transition-colors"
                      >
                        重试
                      </button>
                      <button
                        onClick={clearError}
                        className="text-xs text-red-600 hover:text-red-800 px-3 py-1 transition-colors"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 钱包列表 */}
        <div className="grid gap-3">
          {SUPPORTED_WALLETS.map((wallet) => {
            const isAvailable = availableWallets.includes(wallet.name)
            const isCurrentlyConnecting = isConnecting && selectedWallet === wallet.name
            
            return (
              <motion.div
                key={wallet.name}
                whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                whileTap={{ scale: isAvailable ? 0.98 : 1 }}
              >
                <div
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200",
                    isAvailable
                      ? "border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 cursor-pointer"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                  )}
                  onClick={() => isAvailable && !isConnecting && handleConnect(wallet.name)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{wallet.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{wallet.displayName}</h4>
                      <p className="text-sm text-gray-600">
                        {isAvailable ? '已安装' : '未安装'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isCurrentlyConnecting ? (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : isAvailable ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    ) : (
                      <div className="flex space-x-2">
                        <a
                          href={wallet.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="下载钱包"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <a
                          href={wallet.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                          title="官方网站"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* 帮助信息 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">需要帮助？</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 确保你已经安装了Cardano钱包扩展</li>
            <li>• 钱包需要连接到Cardano预览网络</li>
            <li>• 刷新页面如果钱包没有显示为已安装</li>
          </ul>
        </div>
      </GlassCard>
    </motion.div>
  )
}