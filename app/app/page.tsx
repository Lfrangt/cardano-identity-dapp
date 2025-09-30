'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { LiquidGlassCard, LiquidGlassButton, LiquidGlassNav } from '@/components/ui/LiquidGlass'
import { WalletBalance } from '@/components/wallet/WalletBalance'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { SafeComponent } from '@/components/ui/SafeComponent'
import { setupGlobalErrorHandler } from '@/lib/utils/errorHandler'

// 全局钱包接口类型
declare global {
  interface Window {
    cardano?: {
      [key: string]: {
        enable(): Promise<any>
        isEnabled(): Promise<boolean>
        getNetworkId(): Promise<number>
        getBalance(): Promise<string>
        getUsedAddresses(): Promise<string[]>
        getUnusedAddresses(): Promise<string[]>
        name: string
        icon: string
        apiVersion: string
      }
    }
  }
}

// 支持的钱包列表
const WALLETS = [
  {
    name: 'eternl',
    displayName: 'Eternl',
    icon: '♾️',
    downloadUrl: 'https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka'
  },
  {
    name: 'nami',
    displayName: 'Nami',
    icon: '🏖️',
    downloadUrl: 'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo'
  },
  {
    name: 'flint',
    displayName: 'Flint',
    icon: '🔥',
    downloadUrl: 'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj'
  }
]

export default function AppPage() {
  const [mounted, setMounted] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<any>(null)
  const [availableWallets, setAvailableWallets] = useState<string[]>([])
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    console.log('页面组件已挂载')
    
    // 延迟执行其他初始化
    setTimeout(() => {
      try {
        // 设置全局错误处理
        setupGlobalErrorHandler()
        
        // 检测可用钱包
        if (typeof window !== 'undefined' && window.cardano) {
          const available = WALLETS
            .filter(wallet => window.cardano![wallet.name])
            .map(wallet => wallet.name)
          setAvailableWallets(available)
          console.log('可用钱包:', available)
        }
      } catch (error) {
        console.error('初始化错误:', error)
      }
    }, 100)
  }, [])

  // 连接钱包函数
  const connectWallet = async (walletName: string) => {
    if (!window.cardano || !window.cardano[walletName]) {
      setError(`${walletName} 钱包未安装`)
      return
    }

    setConnecting(true)
    setError(null)

    try {
      console.log(`开始连接 ${walletName} 钱包...`)
      
      // 启用钱包
      const api = await window.cardano[walletName].enable()
      console.log('钱包 API 已启用:', api)

      // 获取基本信息
      const networkId = await api.getNetworkId()
      const balance = await api.getBalance()
      const addresses = await api.getUsedAddresses()
      
      console.log('钱包信息:', {
        networkId,
        balance,
        addresses: addresses.length
      })

      // 设置连接状态
      setConnectedWallet({
        name: walletName,
        api,
        networkId,
        balance,
        address: addresses[0] || 'N/A'
      })
      
      setWalletConnected(true)
      console.log(`${walletName} 钱包连接成功！`)

    } catch (err: any) {
      console.error('钱包连接失败:', err)
      if (err.code === 4) {
        setError('用户拒绝了连接请求')
      } else {
        setError(`连接失败: ${err.message || '未知错误'}`)
      }
    } finally {
      setConnecting(false)
    }
  }

  // 断开连接
  const disconnect = () => {
    setWalletConnected(false)
    setConnectedWallet(null)
    setError(null)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      {/* 导航栏 - 液态玻璃效果 */}
      <LiquidGlassNav className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CardanoID</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {walletConnected && connectedWallet && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-xl border border-green-400/30 text-green-700 text-sm">
                <span className="animate-pulse">🔒</span>
                <span className="font-medium">已连接 - {connectedWallet.name}</span>
              </div>
            )}
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              ← 返回首页
            </Link>
          </div>
        </div>
      </LiquidGlassNav>

      <div className="pt-12 px-6">
        <div className="max-w-4xl mx-auto">
          
          {!walletConnected ? (
            // 钱包连接界面
            <div className="text-center py-20">
              <LiquidGlassCard rainbow className="max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 liquid-glass-float shadow-xl">
                  <span className="text-white text-3xl filter drop-shadow-lg">💳</span>
                </div>
                
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  连接你的 Cardano 钱包
                </h2>
                
                <p className="text-gray-600 mb-8 text-lg">
                  选择一个钱包来访问你的去中心化身份
                </p>

                {/* 错误显示 */}
                {error && (
                  <LiquidGlassCard className="mb-6 bg-red-100/50 border-red-300/50">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-red-500 text-xl">⚠️</span>
                      <span className="text-red-700 font-medium">{error}</span>
                    </div>
                    <LiquidGlassButton 
                      variant="default"
                      size="sm"
                      onClick={() => setError(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      关闭
                    </LiquidGlassButton>
                  </LiquidGlassCard>
                )}

                {/* 钱包列表 */}
                <div className="space-y-3">
                  {WALLETS.map((wallet) => {
                    const isAvailable = availableWallets.includes(wallet.name)
                    
                    return (
                      <div key={wallet.name} className="relative">
                        {isAvailable ? (
                          <LiquidGlassButton
                            onClick={() => connectWallet(wallet.name)}
                            loading={connecting}
                            variant="default"
                            className="w-full justify-between p-5 h-auto hover:scale-[1.02] transition-transform"
                          >
                            <div className="flex items-center space-x-4">
                              <span className="text-3xl filter drop-shadow-sm">{wallet.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold text-gray-900">{wallet.displayName}</div>
                                <div className="text-sm text-green-600 flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                  已安装
                                </div>
                              </div>
                            </div>
                          </LiquidGlassButton>
                        ) : (
                          <div className="w-full flex items-center justify-between p-5 bg-gray-200/40 backdrop-blur-sm rounded-xl border border-gray-300/30 opacity-70">
                            <div className="flex items-center space-x-4">
                              <span className="text-3xl grayscale">{wallet.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold text-gray-700">{wallet.displayName}</div>
                                <div className="text-sm text-gray-500">未安装</div>
                              </div>
                            </div>
                            <a
                              href={wallet.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-500/20 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                            >
                              安装
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <LiquidGlassCard className="mt-8 bg-blue-100/50 border-blue-300/50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💡</span>
                    <p className="text-blue-800 font-medium">
                      需要安装 Cardano 钱包扩展程序才能使用此功能
                    </p>
                  </div>
                </LiquidGlassCard>
              </LiquidGlassCard>
            </div>
          ) : (
            // 连接成功后的界面
            <div className="space-y-8">
              {/* 钱包余额信息 - 始终显示在顶部 */}
              {connectedWallet && (
                <SafeComponent key={`wallet-${connectedWallet.name}-${connectedWallet.address}`}>
                  <ErrorBoundary>
                    <WalletBalance
                      walletApi={connectedWallet.api}
                      walletName={connectedWallet.name}
                      networkId={connectedWallet.networkId}
                      address={connectedWallet.address}
                    />
                  </ErrorBoundary>
                </SafeComponent>
              )}

              {/* 欢迎信息 */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  欢迎来到你的去中心化身份
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  管理你的个人资料，连接他人，建立你的声誉
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <LiquidGlassButton variant="primary" size="lg">
                    创建身份档案
                  </LiquidGlassButton>
                  <LiquidGlassButton 
                    variant="default" 
                    size="lg"
                    onClick={disconnect}
                  >
                    断开钱包
                  </LiquidGlassButton>
                </div>
              </div>

              {/* 功能卡片 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <LiquidGlassCard hover className="relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 liquid-glass-float shadow-lg">
                    <span className="text-white text-3xl filter drop-shadow-lg">👤</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 text-center">身份管理</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    创建和管理你的去中心化身份档案，展示你的技能和成就
                  </p>
                  <LiquidGlassButton variant="default" size="sm" className="w-full">
                    开始创建 →
                  </LiquidGlassButton>
                </LiquidGlassCard>
                
                <LiquidGlassCard hover className="relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 liquid-glass-float shadow-lg">
                    <span className="text-white text-3xl filter drop-shadow-lg">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3 text-center">社交连接</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    与志同道合的人建立连接，扩展你的专业网络
                  </p>
                  <LiquidGlassButton variant="default" size="sm" className="w-full">
                    发现朋友 →
                  </LiquidGlassButton>
                </LiquidGlassCard>
                
                <LiquidGlassCard hover className="relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 liquid-glass-float shadow-lg">
                    <span className="text-white text-3xl filter drop-shadow-lg">⭐</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3 text-center">声誉系统</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    建立和展示你的技能声誉，获得他人的认可
                  </p>
                  <LiquidGlassButton variant="default" size="sm" className="w-full">
                    查看声誉 →
                  </LiquidGlassButton>
                </LiquidGlassCard>
                
                <LiquidGlassCard hover className="relative overflow-hidden">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 liquid-glass-float shadow-lg">
                    <span className="text-white text-3xl filter drop-shadow-lg">🔒</span>
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3 text-center">隐私控制</h3>
                  <p className="text-gray-600 mb-6 text-center">
                    完全控制你的数据，决定哪些信息公开或私有
                  </p>
                  <LiquidGlassButton variant="default" size="sm" className="w-full">
                    隐私设置 →
                  </LiquidGlassButton>
                </LiquidGlassCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}