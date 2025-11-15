'use client'

import React, { useState } from 'react'
import { IdentityProfile } from '@/lib/types/identity'
import { UserSearch } from './UserSearch'
import { PublicProfileView } from './PublicProfileView'
import { ConnectionsManager } from './ConnectionsManager'
import { getRecommendedConnections, getConnectionStats } from '@/lib/services/social-connection'

interface SocialHubProps {
  currentAddress: string
  onClose?: () => void
}

type ViewMode = 'search' | 'profile' | 'connections' | 'recommendations'

export const SocialHub: React.FC<SocialHubProps> = ({
  currentAddress,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('search')
  const [selectedProfile, setSelectedProfile] = useState<IdentityProfile | null>(null)
  const [stats, setStats] = useState(getConnectionStats(currentAddress))

  const handleSelectUser = (profile: IdentityProfile) => {
    setSelectedProfile(profile)
    setViewMode('profile')
  }

  const handleBack = () => {
    setSelectedProfile(null)
    setViewMode('search')
    // 刷新统计
    setStats(getConnectionStats(currentAddress))
  }

  const handleViewProfile = (address: string) => {
    // 这里可以加载档案并显示
    // 暂时先切换到搜索模式
    setViewMode('search')
  }

  const recommendedUsers = getRecommendedConnections(currentAddress, 5)

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            社交连接
          </h2>
          <p className="text-purple-200/70 mt-1">
            发现志同道合的人，建立去中心化社交网络
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-xl border border-blue-400/20">
          <div className="text-sm text-blue-200/70 mb-1">我的连接</div>
          <div className="text-3xl font-bold text-white">
            {stats.totalConnections}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl border border-amber-400/20">
          <div className="text-sm text-amber-200/70 mb-1">待处理请求</div>
          <div className="text-3xl font-bold text-white">
            {stats.pendingRequests}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-xl border border-purple-400/20">
          <div className="text-sm text-purple-200/70 mb-1">推荐用户</div>
          <div className="text-3xl font-bold text-white">
            {recommendedUsers.length}
          </div>
        </div>
      </div>

      {/* 导航标签 */}
      {viewMode !== 'profile' && (
        <div className="flex space-x-2 p-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setViewMode('search')}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'search'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            🔍 搜索用户
          </button>
          <button
            onClick={() => setViewMode('connections')}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all relative ${
              viewMode === 'connections'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            🤝 我的连接
            {stats.pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                {stats.pendingRequests}
              </span>
            )}
          </button>
          <button
            onClick={() => setViewMode('recommendations')}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'recommendations'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            ✨ 推荐
          </button>
        </div>
      )}

      {/* 内容区域 */}
      <div className="min-h-[400px]">
        {viewMode === 'search' && (
          <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl border border-emerald-400/20">
            <UserSearch
              currentAddress={currentAddress}
              onSelectUser={handleSelectUser}
            />
          </div>
        )}

        {viewMode === 'profile' && selectedProfile && (
          <PublicProfileView
            targetAddress={selectedProfile.walletAddress}
            viewerAddress={currentAddress}
            onBack={handleBack}
            onConnect={handleBack}
          />
        )}

        {viewMode === 'connections' && (
          <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl border border-blue-400/20">
            <ConnectionsManager
              walletAddress={currentAddress}
              onViewProfile={handleViewProfile}
            />
          </div>
        )}

        {viewMode === 'recommendations' && (
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20">
            <h3 className="text-xl font-bold text-white mb-4">推荐用户</h3>
            {recommendedUsers.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">✨</span>
                <h3 className="text-xl font-bold text-white mb-2">暂无推荐</h3>
                <p className="text-purple-200/70">
                  添加更多兴趣标签，我们会为您推荐志同道合的用户
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-purple-200/70 mb-4">
                  基于您的兴趣，为您推荐以下用户：
                </p>
                {recommendedUsers.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => handleSelectUser(profile)}
                    className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 backdrop-blur-xl rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                          {profile.avatar ? (
                            <img 
                              src={profile.avatar}
                              alt={profile.displayName}
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : (
                            <span>👤</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate mb-1">
                          {profile.displayName}
                        </h4>
                        <p className="text-sm text-purple-200/80 line-clamp-1 mb-2">
                          {profile.bio}
                        </p>
                        {profile.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {profile.interests.slice(0, 3).map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-purple-500/20 border border-purple-400/30 rounded text-xs text-purple-200"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="text-purple-300">
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
        <div className="flex items-start space-x-3">
          <span className="text-xl">💡</span>
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">使用提示:</p>
            <ul className="list-disc list-inside text-blue-200/70 space-y-1">
              <li>通过钱包地址搜索用户并查看他们的公开档案</li>
              <li>发送连接请求建立关系</li>
              <li>管理您的连接和处理收到的请求</li>
              <li>基于共同兴趣发现推荐用户</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

