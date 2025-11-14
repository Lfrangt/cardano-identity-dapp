'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false)
  const [demoStep, setDemoStep] = useState(0)

  const demoSteps = [
    {
      title: '1. 连接钱包',
      description: '连接你的 Cardano 钱包（Eternl、Nami 等）',
      icon: '🔗',
      action: '点击连接',
      visual: 'wallet'
    },
    {
      title: '2. 上传照片',
      description: '上传你的身份照片或头像',
      icon: '📸',
      action: '选择图片',
      visual: 'upload'
    },
    {
      title: '3. 设置隐私',
      description: '选择公开、私密或选择性可见',
      icon: '🔒',
      action: '选择隐私级别',
      visual: 'privacy'
    },
    {
      title: '4. 铸造 NFT',
      description: '将身份铸造为 NFT 存储在 Cardano 链上',
      icon: '⚡',
      action: '开始铸造',
      visual: 'mint'
    },
    {
      title: '5. 完成！',
      description: '你的去中心化身份已创建成功',
      icon: '🎉',
      action: '查看身份',
      visual: 'success'
    }
  ]

  const handleNextStep = () => {
    if (demoStep < demoSteps.length - 1) {
      setDemoStep(demoStep + 1)
    } else {
      setShowDemo(false)
      setDemoStep(0)
    }
  }

  const handlePrevStep = () => {
    if (demoStep > 0) {
      setDemoStep(demoStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CardanoID</span>
          </div>

          <Link
            href="/app"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8">
            ⚡ Powered by Cardano Blockchain
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your Digital Identity.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Truly Yours.
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Build your decentralized identity on Cardano. Connect with like-minded people,
            showcase your skills, and own your digital presence forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/app"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Create Your Identity →
            </Link>

            <button 
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 bg-white/80 border border-gray-200 text-gray-900 rounded-xl font-medium hover:bg-white hover:border-gray-300 transition-all text-lg hover:shadow-lg"
            >
              🎬 观看演示
            </button>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative">
            <div className="relative max-w-4xl mx-auto">
              {/* Main Card */}
              <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">Khalil</h3>
                    <p className="text-gray-600">Cardano DApp Developer</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-500">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">95</div>
                    <div className="text-sm text-gray-500">Reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-500">Skills</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Cardano', 'React', 'TypeScript', 'Plutus', 'Music'].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20 animate-pulse" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Decentralized by Design
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of digital identity with blockchain technology
              that puts you in complete control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🛡️</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Truly Decentralized
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Your data lives on the Cardano blockchain, not on centralized servers. You own it, you control it, forever.
              </p>
            </div>

            <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">👥</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Authentic Connections
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Connect with people based on genuine interests and verified skills. No algorithms, no fake profiles.
              </p>
            </div>

            <div className="p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🌍</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Cross-Platform Identity
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Use your identity across any Web3 application. One identity, unlimited possibilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border border-white/50 shadow-xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Own Your Identity?
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join the decentralized identity revolution. Create your profile,
              connect with others, and build your reputation on the blockchain.
            </p>

            <Link
              href="/app"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>Built with ❤️ on Cardano blockchain</p>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  🎬 CardanoID 演示
                </h2>
                <p className="text-gray-600 mt-1">
                  了解如何创建你的去中心化身份
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDemo(false)
                  setDemoStep(0)
                }}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  步骤 {demoStep + 1} / {demoSteps.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((demoStep + 1) / demoSteps.length) * 100)}% 完成
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 animate-bounce">
                  <span className="text-4xl">{demoSteps[demoStep].icon}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {demoSteps[demoStep].title}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {demoSteps[demoStep].description}
                </p>
              </div>

              {/* Visual Demo Content */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
                {demoSteps[demoStep].visual === 'wallet' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {['Eternl ♾️', 'Nami 🏖️', 'Flint 🔥', 'Lace 🎴'].map((wallet) => (
                        <div key={wallet} className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                          <div className="text-center">
                            <div className="text-3xl mb-2">{wallet.split(' ')[1]}</div>
                            <div className="font-medium text-gray-900">{wallet.split(' ')[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      💡 选择一个钱包进行连接
                    </p>
                  </div>
                )}

                {demoSteps[demoStep].visual === 'upload' && (
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto border-4 border-dashed border-blue-300 rounded-2xl flex items-center justify-center bg-white hover:border-blue-500 transition-colors cursor-pointer">
                      <div>
                        <div className="text-6xl mb-4">📸</div>
                        <div className="text-gray-600 font-medium">点击上传照片</div>
                        <div className="text-sm text-gray-400 mt-2">或拖放文件到这里</div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      💡 支持 JPG、PNG、GIF 格式，最大 5MB
                    </p>
                  </div>
                )}

                {demoSteps[demoStep].visual === 'privacy' && (
                  <div className="space-y-4 max-w-2xl mx-auto">
                    {[
                      { level: '公开', icon: '🌍', desc: '所有人都可以查看', color: 'green' },
                      { level: '私密', icon: '🔒', desc: '仅你自己可见', color: 'red' },
                      { level: '选择性', icon: '👥', desc: '指定人员可见', color: 'blue' }
                    ].map((privacy) => (
                      <div key={privacy.level} className={`p-6 bg-white rounded-xl border-2 border-${privacy.color}-200 hover:border-${privacy.color}-500 transition-colors cursor-pointer`}>
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{privacy.icon}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-lg">{privacy.level}</div>
                            <div className="text-gray-600 text-sm">{privacy.desc}</div>
                          </div>
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {demoSteps[demoStep].visual === 'mint' && (
                  <div className="text-center">
                    <div className="relative w-64 h-64 mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-pulse" />
                      <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                        <div>
                          <div className="text-6xl mb-4 animate-spin">⚡</div>
                          <div className="font-bold text-gray-900 text-xl">铸造中...</div>
                          <div className="text-gray-600 text-sm mt-2">正在上传到 IPFS</div>
                          <div className="text-gray-600 text-sm">正在创建 NFT 交易</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-600">上传到 IPFS</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-600">创建 Policy Script</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-600">铸造 NFT</span>
                      </div>
                    </div>
                  </div>
                )}

                {demoSteps[demoStep].visual === 'success' && (
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
                      <span className="text-8xl">🎉</span>
                    </div>
                    <div className="space-y-2 text-left max-w-md mx-auto bg-white rounded-xl p-6 shadow-lg">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">交易哈希</span>
                        <span className="font-mono text-sm text-blue-600">a1b2c3d4...</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Policy ID</span>
                        <span className="font-mono text-sm text-purple-600">e5f6g7h8...</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">IPFS CID</span>
                        <span className="font-mono text-sm text-green-600">Qm9i0j1k...</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">状态</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ 已确认
                        </span>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-6">
                      🎊 恭喜！你的去中心化身份已创建成功
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center space-x-4">
                {demoStep > 0 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    ← 上一步
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {demoStep < demoSteps.length - 1 ? (
                    <>模拟 {demoSteps[demoStep].action} →</>
                  ) : (
                    <>🚀 开始使用</>
                  )}
                </button>
              </div>

              {/* Tips */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900 mb-1">提示</div>
                    <div className="text-sm text-blue-700">
                      {demoStep === 0 && '确保你已安装 Cardano 钱包扩展，如 Eternl 或 Nami'}
                      {demoStep === 1 && '建议使用清晰的个人照片或头像，这将作为你的身份标识'}
                      {demoStep === 2 && '你可以随时在设置中更改隐私级别'}
                      {demoStep === 3 && '铸造需要支付少量交易费用（约 2-3 ADA）'}
                      {demoStep === 4 && '你的身份 NFT 将永久存储在 Cardano 区块链上'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
