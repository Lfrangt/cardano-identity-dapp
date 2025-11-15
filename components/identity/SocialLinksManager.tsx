'use client'

import React, { useState } from 'react'
import { SocialLink } from '@/lib/types/identity'

interface SocialLinksManagerProps {
  socialLinks: SocialLink[]
  onUpdate: (links: SocialLink[]) => void
  editable?: boolean
}

// 支持的社交平台配置
const SOCIAL_PLATFORMS = [
  {
    id: 'x',
    name: 'X (Twitter)',
    displayName: 'X',
    icon: '𝕏',
    baseUrl: 'https://x.com/',
    placeholder: '@username',
    color: 'from-black to-gray-800'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    displayName: 'Instagram',
    icon: '📷',
    baseUrl: 'https://instagram.com/',
    placeholder: '@username',
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'wechat',
    name: 'WeChat',
    displayName: '微信',
    icon: '💬',
    baseUrl: '',
    placeholder: '微信号',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'douyin',
    name: 'Douyin',
    displayName: '抖音',
    icon: '🎵',
    baseUrl: 'https://www.douyin.com/user/',
    placeholder: '抖音号',
    color: 'from-black to-cyan-500'
  },
  {
    id: 'xiaohongshu',
    name: 'Xiaohongshu',
    displayName: '小红书',
    icon: '📕',
    baseUrl: 'https://www.xiaohongshu.com/user/profile/',
    placeholder: '小红书ID',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    displayName: 'LinkedIn',
    icon: '💼',
    baseUrl: 'https://linkedin.com/in/',
    placeholder: 'username',
    color: 'from-blue-600 to-blue-700'
  },
  {
    id: 'github',
    name: 'GitHub',
    displayName: 'GitHub',
    icon: '💻',
    baseUrl: 'https://github.com/',
    placeholder: 'username',
    color: 'from-gray-700 to-gray-900'
  },
  {
    id: 'discord',
    name: 'Discord',
    displayName: 'Discord',
    icon: '🎮',
    baseUrl: '',
    placeholder: 'username#1234',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    displayName: 'Telegram',
    icon: '✈️',
    baseUrl: 'https://t.me/',
    placeholder: '@username',
    color: 'from-blue-400 to-blue-600'
  }
]

export const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({
  socialLinks,
  onUpdate,
  editable = true
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(SOCIAL_PLATFORMS[0].id)
  const [username, setUsername] = useState('')

  const handleAddLink = () => {
    if (!username.trim()) {
      alert('请输入用户名或账号')
      return
    }

    const platform = SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform)
    if (!platform) return

    // 构建完整 URL
    let url = username.trim()
    
    // 如果用户输入的不是完整URL，则使用平台baseUrl构建
    if (!url.startsWith('http')) {
      // 清理用户名（移除 @ 符号等）
      const cleanUsername = url.replace(/^@/, '')
      url = platform.baseUrl ? platform.baseUrl + cleanUsername : cleanUsername
    }

    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: selectedPlatform as any,
      username: username.trim(),
      url,
      verified: false
    }

    onUpdate([...socialLinks, newLink])
    setUsername('')
    setShowAddForm(false)
  }

  const handleRemoveLink = (linkId: string) => {
    if (confirm('确定要删除这个社交链接吗？')) {
      onUpdate(socialLinks.filter(link => link.id !== linkId))
    }
  }

  const getPlatformInfo = (platformId: string) => {
    return SOCIAL_PLATFORMS.find(p => p.id === platformId) || SOCIAL_PLATFORMS[0]
  }

  return (
    <div className="space-y-4">
      {/* 标题和添加按钮 */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>🔗</span>
          <span>社交链接</span>
          <span className="text-sm text-purple-300/70">({socialLinks.length})</span>
        </h3>
        {editable && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-300 rounded-lg transition-all text-sm font-medium"
          >
            + 添加链接
          </button>
        )}
      </div>

      {/* 添加表单 */}
      {showAddForm && (
        <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              选择平台
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SOCIAL_PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedPlatform === platform.id
                      ? 'border-blue-400 bg-blue-500/20'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="text-2xl mb-1">{platform.icon}</div>
                  <div className="text-xs text-white truncate">{platform.displayName}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              用户名或账号
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={getPlatformInfo(selectedPlatform).placeholder}
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddLink()
                }
              }}
            />
            <p className="text-xs text-blue-300/60 mt-1">
              {getPlatformInfo(selectedPlatform).baseUrl 
                ? `将自动生成链接：${getPlatformInfo(selectedPlatform).baseUrl}...`
                : '直接显示账号信息'}
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setUsername('')
              }}
              className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium transition-all"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              添加
            </button>
          </div>
        </div>
      )}

      {/* 链接列表 */}
      {socialLinks.length === 0 ? (
        <div className="text-center py-8 text-purple-300/60">
          <p className="text-sm">还没有添加社交链接</p>
          <p className="text-xs mt-1">点击"添加链接"开始连接你的社交账号</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {socialLinks.map((link) => {
            const platformInfo = getPlatformInfo(link.platform)
            return (
              <div
                key={link.id}
                className={`p-4 bg-gradient-to-r ${platformInfo.color} bg-opacity-10 backdrop-blur-xl rounded-xl border border-white/20 hover:border-white/30 transition-all group`}
              >
                <div className="flex items-center gap-3">
                  {/* 图标 */}
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${platformInfo.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {platformInfo.icon}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-white text-sm">{platformInfo.displayName}</h4>
                      {link.verified && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                          ✓
                        </span>
                      )}
                    </div>
                    
                    {link.url.startsWith('http') ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-300 hover:text-blue-200 truncate block transition-colors"
                      >
                        {link.username}
                      </a>
                    ) : (
                      <p className="text-sm text-purple-200/80 truncate">
                        {link.username}
                      </p>
                    )}
                  </div>

                  {/* 操作 */}
                  {editable && (
                    <button
                      onClick={() => handleRemoveLink(link.id)}
                      className="flex-shrink-0 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 提示信息 */}
      {socialLinks.length > 0 && (
        <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-xl">
          <div className="flex items-start space-x-2 text-xs text-blue-200">
            <span>💡</span>
            <div>
              <p className="font-medium mb-1">提示：</p>
              <ul className="list-disc list-inside text-blue-200/70 space-y-0.5">
                <li>社交链接会显示在你的公开档案中</li>
                <li>点击链接可以访问你的社交账号</li>
                <li>未来可以通过验证获得认证标识</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

