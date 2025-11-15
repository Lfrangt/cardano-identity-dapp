'use client'

import React, { useState } from 'react'
import { IdentityProfile } from '@/lib/types/identity'
import { searchUserByAddress, searchUsers } from '@/lib/services/social-connection'

interface UserSearchProps {
  currentAddress: string
  onSelectUser: (profile: IdentityProfile) => void
}

export const UserSearch: React.FC<UserSearchProps> = ({
  currentAddress,
  onSelectUser
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<IdentityProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [searchType, setSearchType] = useState<'address' | 'general'>('general')

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)

    try {
      // 判断是否是完整地址搜索
      const isAddress = searchQuery.trim().startsWith('addr')
      
      if (isAddress) {
        setSearchType('address')
        const profile = searchUserByAddress(searchQuery.trim())
        setSearchResults(profile ? [profile] : [])
      } else {
        setSearchType('general')
        const results = searchUsers(searchQuery)
        setSearchResults(results)
      }
    } catch (error) {
      console.error('搜索失败:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="搜索钱包地址、用户名或兴趣..."
            className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
          >
            {searching ? '搜索中...' : '🔍 搜索'}
          </button>
        </div>

        {/* 搜索提示 */}
        <div className="text-xs text-purple-300/60">
          💡 提示：输入完整钱包地址可精确搜索，或输入名称/兴趣进行模糊搜索
        </div>
      </div>

      {/* 搜索结果 */}
      {searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              搜索结果 ({searchResults.length})
            </h3>
            {searchResults.length > 0 && (
              <span className="text-xs text-purple-300/60">
                {searchType === 'address' ? '精确匹配' : '模糊搜索'}
              </span>
            )}
          </div>

          {searching ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-200/70">搜索中...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 px-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-purple-200/70">未找到匹配的用户</p>
              <p className="text-sm text-purple-300/50 mt-2">
                请检查地址是否正确，或尝试其他搜索词
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => onSelectUser(profile)}
                  className="group p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 backdrop-blur-xl rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* 头像 */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
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

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-white truncate">
                          {profile.displayName}
                        </h4>
                        {profile.verified && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded flex-shrink-0">
                            ✓ 已验证
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-purple-200/80 line-clamp-1 mb-2">
                        {profile.bio}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-purple-300/60">
                        <span className="font-mono truncate">
                          {profile.walletAddress.substring(0, 12)}...
                        </span>
                        {profile.interests.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="truncate">
                              {profile.interests.slice(0, 2).join(', ')}
                              {profile.interests.length > 2 && ' ...'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 操作提示 */}
                    <div className="flex-shrink-0">
                      <div className="text-purple-300 group-hover:text-purple-200 transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 初始状态提示 */}
      {!searchQuery && (
        <div className="text-center py-12 px-4">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="text-xl font-bold text-white mb-2">发现新朋友</h3>
          <p className="text-purple-200/70 mb-4">
            通过钱包地址搜索用户，查看他们的身份档案
          </p>
          <div className="space-y-2 text-sm text-purple-300/60">
            <p>• 输入完整的 Cardano 钱包地址进行精确搜索</p>
            <p>• 或输入用户名、兴趣等关键词进行模糊搜索</p>
          </div>
        </div>
      )}
    </div>
  )
}

