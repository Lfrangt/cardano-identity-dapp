'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { LiquidGlassCard, LiquidGlassButton } from '@/components/ui/LiquidGlass'
import { 
  formatADA, 
  formatAddress, 
  getNetworkName, 
  getNetworkColor,
  parseWalletBalance,
  type WalletBalance as WalletBalanceType 
} from '@/lib/utils/wallet-balance'

interface WalletBalanceProps {
  walletApi: any
  walletName: string
  networkId: number
  address: string
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  walletApi,
  walletName,
  networkId,
  address
}) => {
  const [balance, setBalance] = useState<WalletBalanceType | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isInitialized = useRef(false)
  const isFetching = useRef(false)

  // 获取余额
  const fetchBalance = useCallback(async () => {
    if (!walletApi || isFetching.current) return

    isFetching.current = true
    setLoading(true)
    setError(null)
    
    try {
      console.log('开始获取钱包余额...')
      const balanceHex = await walletApi.getBalance()
      console.log('获取到余额:', balanceHex)
      
      if (balanceHex) {
        const parsedBalance = parseWalletBalance(balanceHex)
        setBalance(parsedBalance)
        setLastUpdated(new Date())
        console.log('解析后的余额:', parsedBalance)
      }
    } catch (error: any) {
      console.error('获取余额失败:', error)
      if (error.message?.includes('User rejected')) {
        setError('用户取消了操作')
      } else {
        setError('获取余额失败，请重试')
      }
    } finally {
      setLoading(false)
      isFetching.current = false
    }
  }, [walletApi])

  // 初始化时获取余额 - 只执行一次
  useEffect(() => {
    if (walletApi && !isInitialized.current) {
      isInitialized.current = true
      // 延迟执行，避免立即触发
      const timer = setTimeout(() => {
        fetchBalance()
      }, 500) // 增加延迟时间
      
      return () => clearTimeout(timer)
    }
  }, [walletApi, fetchBalance])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      isFetching.current = false
      isInitialized.current = false
    }
  }, [])

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // 安全的重试机制
  const handleRetry = useCallback(() => {
    setError(null)
    if (!isFetching.current) {
      fetchBalance()
    }
  }, [fetchBalance])

  return (
    <div className="space-y-6">
      {/* 主余额卡片 - 液态玻璃效果 */}
      <LiquidGlassCard rainbow pulse className="text-center relative overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg liquid-glass-float mr-4">
              <span className="text-white text-2xl filter drop-shadow-lg">💰</span>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">钱包余额</h3>
              <p className="text-sm text-gray-600">实时查询</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                  查询中...
                </div>
              ) : balance && balance.ada !== undefined ? (
                balance.ada > 1000 ? 
                  `${(balance.ada / 1000).toFixed(1)}K` : 
                  balance.ada.toFixed(1)
              ) : error ? (
                '查询失败'
              ) : (
                '---'
              )} ADA
            </h2>
            
            <p className="text-gray-600 text-sm">
              {balance ? `${Number(balance.lovelace).toLocaleString()} Lovelace` : '等待钱包数据...'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100/80 border border-red-300/50 rounded-lg">
            <p className="text-red-700 text-sm text-center mb-2">{error}</p>
            <LiquidGlassButton
              onClick={handleRetry}
              variant="default"
              size="sm"
              className="w-full text-red-600 hover:text-red-800"
            >
              重试
            </LiquidGlassButton>
          </div>
        )}

        <div className="flex justify-center mb-4">
          <LiquidGlassButton
            onClick={fetchBalance}
            loading={loading}
            variant="primary"
            size="md"
            disabled={loading}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            {loading ? '实时查询中...' : '🔄 刷新钱包余额'}
          </LiquidGlassButton>
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-500/80">
            最后更新: {formatTime(lastUpdated)}
          </p>
        )}
      </LiquidGlassCard>

      {/* 钱包详情卡片 */}
      <LiquidGlassCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
          钱包详情
        </h3>
        
        <div className="space-y-4">
          {/* 钱包名称 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">钱包</span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {walletName === 'eternl' ? '♾️' : 
                 walletName === 'nami' ? '🏖️' : 
                 walletName === 'flint' ? '🔥' : '💳'}
              </span>
              <span className="font-medium capitalize">{walletName}</span>
            </div>
          </div>

          {/* 网络状态 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">网络</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getNetworkColor(networkId)}`}>
              {getNetworkName(networkId)}
            </span>
          </div>

          {/* 钱包地址 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">地址</span>
            <div className="text-right">
              <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-lg max-w-48 truncate">
                {formatAddress(address)}
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(address)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-1"
              >
                复制完整地址
              </button>
            </div>
          </div>

          {/* 余额详情 */}
          {balance && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">精确余额</span>
                <span className="font-mono text-sm">{balance.ada.toFixed(1)} ADA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lovelace</span>
                <span className="font-mono text-xs text-gray-500">{balance.lovelace}</span>
              </div>
            </div>
          )}
        </div>
      </LiquidGlassCard>

      {/* 快速操作卡片 */}
      <LiquidGlassCard hover>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">⚡</span>
          快速操作
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <LiquidGlassButton 
            variant="default"
            className="flex flex-col items-center py-6 h-auto hover:scale-105"
            onClick={() => alert('接收功能即将推出')}
          >
            <span className="text-3xl mb-2 filter drop-shadow-sm">📥</span>
            <span className="text-sm font-medium">接收</span>
          </LiquidGlassButton>
          
          <LiquidGlassButton 
            variant="default"
            className="flex flex-col items-center py-6 h-auto hover:scale-105"
            onClick={() => alert('发送功能即将推出')}
          >
            <span className="text-3xl mb-2 filter drop-shadow-sm">📤</span>
            <span className="text-sm font-medium">发送</span>
          </LiquidGlassButton>
        </div>
      </LiquidGlassCard>
    </div>
  )
}