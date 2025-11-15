'use client'

import React, { useState, useEffect } from 'react'

export const WalletDebugger: React.FC = () => {
  const [detectedWallets, setDetectedWallets] = useState<string[]>([])
  const [showDebugger, setShowDebugger] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.cardano) {
      const wallets = Object.keys(window.cardano)
      setDetectedWallets(wallets)
      console.log('🔍 检测到的钱包:', wallets)
      console.log('📋 完整的 window.cardano 对象:', window.cardano)
    }
  }, [showDebugger])

  if (!showDebugger) {
    return (
      <button
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 rounded-lg text-yellow-300 text-sm font-medium transition-all z-50"
      >
        🔧 调试钱包
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] overflow-auto bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50">
      <div className="sticky top-0 bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold">🔧 钱包调试器</h3>
        <button
          onClick={() => setShowDebugger(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            检测到的钱包 ({detectedWallets.length})
          </h4>
          {detectedWallets.length > 0 ? (
            <ul className="space-y-2">
              {detectedWallets.map((wallet) => (
                <li
                  key={wallet}
                  className="p-2 bg-gray-800 rounded text-sm text-green-400 font-mono"
                >
                  window.cardano.{wallet}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">未检测到钱包扩展</p>
          )}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            使用说明
          </h4>
          <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
            <li>打开浏览器控制台 (F12)</li>
            <li>查看上面列出的钱包名称</li>
            <li>如果看到 OKX 相关的名称，请截图反馈</li>
          </ol>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={() => {
              if (window.cardano) {
                console.log('=== 完整钱包信息 ===')
                Object.keys(window.cardano).forEach((name) => {
                  console.log(`\n钱包名称: ${name}`)
                  console.log('详细信息:', window.cardano[name])
                  if (window.cardano[name].name) {
                    console.log('显示名称:', window.cardano[name].name)
                  }
                  if (window.cardano[name].icon) {
                    console.log('图标:', window.cardano[name].icon)
                  }
                })
              }
              alert('详细信息已输出到控制台，请按 F12 查看')
            }}
            className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 rounded text-blue-300 text-sm transition-all"
          >
            📋 输出详细信息
          </button>
        </div>
      </div>
    </div>
  )
}

