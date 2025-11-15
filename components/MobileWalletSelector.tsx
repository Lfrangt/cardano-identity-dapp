'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Wallet {
  id: string
  name: string
  displayName: string
  icon: string
  color: string
  description: string
  isInstalled?: boolean
  // 浏览器扩展下载链接
  extensionUrl?: string
  // 移动端应用下载链接
  mobileDownloadUrl?: {
    ios?: string
    android?: string
  }
  // 移动端深度链接
  deepLink?: string
  // WalletConnect 支持
  supportsWalletConnect?: boolean
}

const CARDANO_WALLETS: Wallet[] = [
  {
    id: 'eternl',
    name: 'eternl',
    displayName: 'Eternl',
    icon: '♾️',
    color: 'from-blue-500 to-cyan-500',
    description: '功能最全面的 Cardano 钱包',
    extensionUrl: 'https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka',
    mobileDownloadUrl: {
      ios: 'https://apps.apple.com/app/eternl-by-tastenkunst/id6443674280',
      android: 'https://play.google.com/store/apps/details?id=io.eternl.app'
    },
    deepLink: 'eternl://',
    supportsWalletConnect: true
  },
  {
    id: 'yoroi',
    name: 'yoroi',
    displayName: 'Yoroi',
    icon: '🦋',
    color: 'from-purple-500 to-pink-500',
    description: 'EMURGO 官方轻钱包',
    extensionUrl: 'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
    mobileDownloadUrl: {
      ios: 'https://apps.apple.com/app/emurgos-yoroi-cardano-wallet/id1447326389',
      android: 'https://play.google.com/store/apps/details?id=com.emurgo'
    },
    deepLink: 'yoroi://',
    supportsWalletConnect: false
  },
  {
    id: 'lace',
    name: 'lace',
    displayName: 'Lace',
    icon: '🎴',
    color: 'from-indigo-500 to-blue-500',
    description: 'IOG 官方钱包 (支持 Ledger)',
    extensionUrl: 'https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk',
    mobileDownloadUrl: {
      ios: 'https://apps.apple.com/app/lace-wallet/id6451238474',
      android: 'https://play.google.com/store/apps/details?id=com.lace.wallet'
    },
    deepLink: 'lace://',
    supportsWalletConnect: true
  },
  {
    id: 'okx',
    name: 'okx',  // OKX 在 window.cardano 中可能使用 'okx' 或 'okxwallet'
    displayName: 'OKX Wallet',
    icon: '⭕',
    color: 'from-gray-800 to-black',
    description: '支持多链的交易所钱包',
    extensionUrl: 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    mobileDownloadUrl: {
      ios: 'https://apps.apple.com/app/okx-buy-bitcoin-btc-crypto/id1327268470',
      android: 'https://play.google.com/store/apps/details?id=com.okinc.okex.gp'
    },
    deepLink: 'okx://wallet/dapp/url?dappUrl=',
    supportsWalletConnect: true
  },
  {
    id: 'begin',
    name: 'begin',
    displayName: 'Begin',
    icon: '🌅',
    color: 'from-orange-500 to-red-500',
    description: '易用的 Cardano 钱包',
    extensionUrl: 'https://chrome.google.com/webstore/detail/begin-wallet/nhbicdelgedinnbcidconlnfeionhbml',
    mobileDownloadUrl: {
      ios: 'https://apps.apple.com/app/begin-wallet/id1614468782',
      android: 'https://play.google.com/store/apps/details?id=is.begin.app'
    },
    deepLink: 'begin://',
    supportsWalletConnect: false
  },
  {
    id: 'vespr',
    name: 'vespr',
    displayName: 'Vespr',
    icon: '👻',
    color: 'from-teal-500 to-emerald-500',
    description: '简洁的移动端钱包',
    extensionUrl: 'https://chrome.google.com/webstore/detail/vespr/ghpjeidmjngalmcdlbccfclpdjikddgg',
    mobileDownloadUrl: {
      ios: 'https://apps.apple.com/app/vespr-wallet/id6444711032',
      android: 'https://play.google.com/store/apps/details?id=art.nft_craze.gallery.main'
    },
    deepLink: 'vespr://',
    supportsWalletConnect: false
  }
]

interface MobileWalletSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectWallet: (walletId: string) => void
}

export const MobileWalletSelector: React.FC<MobileWalletSelectorProps> = ({
  isOpen,
  onClose,
  onSelectWallet
}) => {
  const [isMobile, setIsMobile] = useState(false)
  const [installedWallets, setInstalledWallets] = useState<string[]>([])
  const [showAllWallets, setShowAllWallets] = useState(false)

  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      const ua = navigator.userAgent
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
      setIsMobile(mobile)
    }

    // 检测已安装的钱包
    const checkInstalledWallets = () => {
      if (typeof window !== 'undefined' && window.cardano) {
        const installed = CARDANO_WALLETS
          .filter(wallet => window.cardano?.[wallet.name])
          .map(wallet => wallet.id)
        setInstalledWallets(installed)
      }
    }

    checkMobile()
    checkInstalledWallets()
  }, [isOpen])

  const handleWalletClick = (wallet: Wallet) => {
    if (isMobile) {
      // 移动端：尝试深度链接跳转
      if (wallet.deepLink) {
        // 获取当前页面 URL
        const currentUrl = window.location.href
        
        // 构建深度链接
        let deepLinkUrl = wallet.deepLink
        if (wallet.id === 'okx') {
          // OKX 特殊处理 - 需要传递当前页面 URL
          deepLinkUrl = `${wallet.deepLink}${encodeURIComponent(currentUrl)}`
        }

        // 尝试打开应用
        window.location.href = deepLinkUrl

        // 如果应用未安装，2秒后跳转到下载页面
        const timer = setTimeout(() => {
          const userAgent = navigator.userAgent.toLowerCase()
          const isIOS = /iphone|ipad|ipod/.test(userAgent)
          const isAndroid = /android/.test(userAgent)

          if (isIOS && wallet.mobileDownloadUrl?.ios) {
            window.location.href = wallet.mobileDownloadUrl.ios
          } else if (isAndroid && wallet.mobileDownloadUrl?.android) {
            window.location.href = wallet.mobileDownloadUrl.android
          }
        }, 2000)

        // 如果用户返回，清除定时器
        window.addEventListener('blur', () => clearTimeout(timer))
      } else {
        // 没有深度链接，直接跳转到下载页面
        const userAgent = navigator.userAgent.toLowerCase()
        const isIOS = /iphone|ipad|ipod/.test(userAgent)
        const isAndroid = /android/.test(userAgent)

        if (isIOS && wallet.mobileDownloadUrl?.ios) {
          window.open(wallet.mobileDownloadUrl.ios, '_blank')
        } else if (isAndroid && wallet.mobileDownloadUrl?.android) {
          window.open(wallet.mobileDownloadUrl.android, '_blank')
        }
      }
    } else {
      // 桌面端：使用浏览器扩展
      if (installedWallets.includes(wallet.id)) {
        onSelectWallet(wallet.name)
      } else {
        // 未安装，跳转到下载页面
        if (wallet.extensionUrl) {
          window.open(wallet.extensionUrl, '_blank')
        }
      }
    }
  }

  const getWalletStatus = (wallet: Wallet) => {
    if (isMobile) {
      return {
        text: '打开应用',
        color: 'text-green-400'
      }
    } else {
      if (installedWallets.includes(wallet.id)) {
        return {
          text: '已安装',
          color: 'text-green-400'
        }
      } else {
        return {
          text: '未安装',
          color: 'text-orange-400'
        }
      }
    }
  }

  const displayedWallets = showAllWallets ? CARDANO_WALLETS : CARDANO_WALLETS.slice(0, 4)

  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 底部弹窗 */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[80vh] overflow-hidden flex flex-col">
          {/* 头部 */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-white">连接钱包</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {isMobile ? '选择一个钱包应用' : '选择一个浏览器钱包'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* 设备类型指示 */}
            <div className="flex items-center gap-2 mt-3">
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full">
                <span className="text-xs text-purple-300">
                  {isMobile ? '📱 移动端' : '💻 桌面端'}
                </span>
              </div>
              {!isMobile && (
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
                  <span className="text-xs text-blue-300">
                    {installedWallets.length} 个已安装
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 钱包列表 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-3">
              {displayedWallets.map((wallet) => {
                const status = getWalletStatus(wallet)
                const isInstalled = installedWallets.includes(wallet.id)

                return (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletClick(wallet)}
                    className={`w-full p-4 rounded-2xl border transition-all ${
                      isInstalled
                        ? 'bg-gradient-to-r ' + wallet.color + ' bg-opacity-10 border-white/20 hover:border-white/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* 图标 */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${wallet.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {wallet.icon}
                      </div>

                      {/* 信息 */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {wallet.displayName}
                          </h3>
                          <span className={`text-xs ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {wallet.description}
                        </p>
                      </div>

                      {/* 箭头 */}
                      <div className="text-gray-400">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* 显示更多按钮 */}
            {!showAllWallets && CARDANO_WALLETS.length > 4 && (
              <button
                onClick={() => setShowAllWallets(true)}
                className="w-full mt-4 p-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <span className="text-sm">显示全部 {CARDANO_WALLETS.length} 个钱包</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
            )}
          </div>

          {/* 底部提示 */}
          <div className="p-6 border-t border-white/10 bg-black/50">
            <div className="flex items-start gap-3 text-sm text-gray-400">
              <span className="text-lg">ℹ️</span>
              <div>
                <p>
                  {isMobile
                    ? '点击钱包后将跳转到对应的应用。如果应用未安装，将自动引导您下载。'
                    : '首次使用需要安装浏览器扩展。已安装的钱包会自动连接。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 动画样式 */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default MobileWalletSelector

