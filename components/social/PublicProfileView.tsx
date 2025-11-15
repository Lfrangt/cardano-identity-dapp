'use client'

import React, { useState, useEffect } from 'react'
import { PublicProfileView as PublicProfileType } from '@/lib/types/identity'
import {
  getPublicProfile,
  sendConnectionRequest,
  areConnected,
  removeConnection,
  getMutualConnections
} from '@/lib/services/social-connection'
import { getProfileByWallet } from '@/lib/services/identity-profile'

interface PublicProfileViewProps {
  targetAddress: string
  viewerAddress: string
  onBack?: () => void
  onConnect?: () => void
}

const SKILL_LEVELS = {
  beginner: { label: '初学者', color: 'from-gray-500 to-gray-600', percentage: 25 },
  intermediate: { label: '中级', color: 'from-blue-500 to-blue-600', percentage: 50 },
  advanced: { label: '高级', color: 'from-purple-500 to-purple-600', percentage: 75 },
  expert: { label: '专家', color: 'from-amber-500 to-orange-600', percentage: 100 }
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  targetAddress,
  viewerAddress,
  onBack,
  onConnect
}) => {
  const [profile, setProfile] = useState<PublicProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [mutualConnections, setMutualConnections] = useState<string[]>([])

  useEffect(() => {
    loadProfile()
  }, [targetAddress, viewerAddress])

  const loadProfile = () => {
    setLoading(true)
    try {
      const publicProfile = getPublicProfile(targetAddress, viewerAddress)
      setProfile(publicProfile)
      
      if (publicProfile) {
        const connected = areConnected(viewerAddress, targetAddress)
        setIsConnected(connected)
        
        const mutual = getMutualConnections(viewerAddress, targetAddress)
        setMutualConnections(mutual)
      }
    } catch (error) {
      console.error('加载档案失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async () => {
    if (!profile) return

    setActionLoading(true)
    try {
      const viewerProfile = getProfileByWallet(viewerAddress)
      if (!viewerProfile) {
        alert('请先创建您的身份档案')
        return
      }

      sendConnectionRequest(
        viewerAddress,
        viewerProfile.displayName,
        targetAddress,
        `你好！我想和你建立连接。`
      )

      alert('✅ 连接请求已发送！')
      if (onConnect) onConnect()
    } catch (error: any) {
      alert(`发送请求失败: ${error.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveConnection = () => {
    if (!confirm('确定要移除这个连接吗？')) {
      return
    }

    setActionLoading(true)
    try {
      removeConnection(viewerAddress, targetAddress)
      setIsConnected(false)
      alert('✅ 连接已移除')
      loadProfile()
    } catch (error) {
      alert('移除连接失败')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">加载中...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <span className="text-6xl block mb-4">🔒</span>
        <h3 className="text-2xl font-bold text-white mb-2">无法查看此档案</h3>
        <p className="text-purple-200/70 mb-8">
          此用户的档案可能是私密的，或者不存在
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 rounded-xl transition-all"
          >
            ← 返回
          </button>
        )}
      </div>
    )
  }

  const isOwnProfile = viewerAddress === targetAddress

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>返回</span>
        </button>
      )}

      {/* 档案卡片 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20">
        {/* 封面 */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 relative">
          {profile.coverImage && (
            <img 
              src={profile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <div className="relative px-6 pb-6">
          {/* 头像和操作按钮 */}
          <div className="flex justify-between items-start -mt-12 mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-75"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border-4 border-slate-900">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.displayName}
                    className="w-full h-full rounded-3xl object-cover"
                  />
                ) : (
                  <span>👤</span>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            {!isOwnProfile && (
              <div className="mt-12 flex gap-2">
                {isConnected ? (
                  <button
                    onClick={handleRemoveConnection}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-300 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
                  >
                    移除连接
                  </button>
                ) : profile.canConnect ? (
                  <button
                    onClick={handleSendRequest}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
                  >
                    {actionLoading ? '发送中...' : '🤝 发送连接请求'}
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 rounded-xl text-sm font-medium">
                    请求已发送
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 基本信息 */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{profile.displayName}</h2>
              {profile.verified && (
                <span className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium">
                  <span>✓</span>
                  <span>已验证</span>
                </span>
              )}
              {isConnected && (
                <span className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                  <span>🤝</span>
                  <span>已连接</span>
                </span>
              )}
            </div>

            <p className="text-purple-200/80 leading-relaxed mb-3">
              {profile.bio}
            </p>

            {/* 社交链接 */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div className="mb-3 grid grid-cols-4 gap-2">
                {profile.socialLinks.map((link) => {
                  const icons: Record<string, string> = {
                    x: '𝕏',
                    instagram: '📷',
                    wechat: '💬',
                    douyin: '🎵',
                    xiaohongshu: '📕',
                    linkedin: '💼',
                    github: '💻',
                    discord: '🎮',
                    telegram: '✈️'
                  }
                  
                  const icon = icons[link.platform] || '🔗'
                  
                  return link.url.startsWith('http') ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all flex items-center justify-center"
                      title={link.username}
                    >
                      <span className="text-lg">{icon}</span>
                    </a>
                  ) : (
                    <div
                      key={link.id}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center"
                      title={link.username}
                    >
                      <span className="text-lg">{icon}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 钱包地址 */}
            <div className="p-3 bg-black/30 rounded-xl mb-3">
              <div className="text-xs text-purple-300/60 mb-1">钱包地址</div>
              <div className="text-sm text-purple-200 font-mono truncate">
                {profile.walletAddress}
              </div>
            </div>
          </div>

          {/* 兴趣标签 */}
          {profile.interests.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full text-sm text-purple-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {profile.skills.length}
              </div>
              <div className="text-xs text-purple-300/60 mt-1">技能</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {profile.achievements.length}
              </div>
              <div className="text-xs text-purple-300/60 mt-1">成就</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {profile.connectionCount}
              </div>
              <div className="text-xs text-purple-300/60 mt-1">连接</div>
            </div>
          </div>

          {/* 共同连接 */}
          {mutualConnections.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-sm text-purple-300/70">
                <span className="font-medium">{mutualConnections.length}</span> 个共同连接
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 技能列表 */}
      {profile.skills.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-blue-400/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span>🎯</span>
            <span>技能</span>
          </h3>
          <div className="space-y-3">
            {profile.skills.map((skill) => {
              const levelInfo = SKILL_LEVELS[skill.level]
              return (
                <div key={skill.id} className="p-3 bg-white/5 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white">{skill.name}</h4>
                      <span className={`inline-block mt-1 px-2 py-0.5 bg-gradient-to-r ${levelInfo.color} text-white rounded text-xs font-medium`}>
                        {levelInfo.label}
                      </span>
                    </div>
                    {skill.endorsements > 0 && (
                      <span className="text-purple-300/70 text-sm">
                        👍 {skill.endorsements}
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div
                      className={`h-full bg-gradient-to-r ${levelInfo.color} rounded-full transition-all duration-500`}
                      style={{ width: `${levelInfo.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 成就列表 */}
      {profile.achievements.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-amber-400/20">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <span>🏆</span>
            <span>成就</span>
          </h3>
          <div className="space-y-3">
            {profile.achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 bg-white/5 rounded-xl">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{achievement.title}</h4>
                    <p className="text-sm text-purple-200/80 mb-2">
                      {achievement.description}
                    </p>
                    <div className="text-xs text-purple-300/60">
                      📅 {new Date(achievement.date).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

