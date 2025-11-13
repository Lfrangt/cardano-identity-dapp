'use client'

import { useEffect, useState } from 'react'
import {
  testSync,
  getSharedCoreVersion,
  testAsyncSync,
  type SyncTestResult
} from '@cardano-identity/shared-core'

export default function TestSyncPage() {
  const [syncResult, setSyncResult] = useState<SyncTestResult | null>(null)
  const [version, setVersion] = useState<string>('')
  const [asyncResult, setAsyncResult] = useState<string>('')

  useEffect(() => {
    // 测试同步函数
    const result = testSync('web')
    setSyncResult(result)

    // 获取版本
    const ver = getSharedCoreVersion()
    setVersion(ver)

    // 测试异步函数
    testAsyncSync('web').then(setAsyncResult)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🧪 共享代码同步测试
        </h1>

        {/* 测试结果卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ✅ 同步测试结果
          </h2>
          {syncResult && (
            <div className="space-y-3 text-white/90">
              <p><strong>平台:</strong> {syncResult.platform}</p>
              <p><strong>版本:</strong> {syncResult.version}</p>
              <p><strong>时间戳:</strong> {new Date(syncResult.timestamp).toLocaleString('zh-CN')}</p>
              <p className="text-green-300 text-lg"><strong>消息:</strong> {syncResult.message}</p>
            </div>
          )}
        </div>

        {/* 版本信息 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            📦 共享包版本
          </h2>
          <p className="text-white/90 text-lg">{version}</p>
        </div>

        {/* 异步测试 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🚀 异步功能测试
          </h2>
          <p className="text-white/90">{asyncResult || '加载中...'}</p>
        </div>

        {/* 说明 */}
        <div className="bg-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-400/30">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ℹ️ 测试说明
          </h2>
          <div className="text-white/90 space-y-2">
            <p>• 这个页面使用了从 <code className="bg-white/20 px-2 py-1 rounded">@cardano-identity/shared-core</code> 导入的函数</p>
            <p>• 同样的代码也可以在 iOS 应用中使用</p>
            <p>• 当你修改 shared-core 并运行 <code className="bg-white/20 px-2 py-1 rounded">npm run sync</code> 时，两端都会更新</p>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="mt-8">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
          >
            ← 返回主页
          </a>
        </div>
      </div>
    </div>
  )
}
