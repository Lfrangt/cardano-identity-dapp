'use client'

import React from 'react'
import { IdentityProfile } from '@/lib/types/identity'

interface ProfileCardProps {
  profile: IdentityProfile
  onEdit?: () => void
  editable?: boolean
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEdit,
  editable = false
}) => {
  const { displayName, bio, location, website, interests, skills, achievements, verified } = profile

  return (
    <div className="relative overflow-hidden">
      {/* 封面图 */}
      <div className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 relative">
        {profile.coverImage ? (
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative px-6 pb-6">
        {/* 头像 */}
        <div className="flex justify-between items-start -mt-12 mb-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-lg opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl border-4 border-slate-900">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={displayName} 
                  className="w-full h-full rounded-3xl object-cover"
                />
              ) : (
                <span>👤</span>
              )}
            </div>
          </div>

          {editable && onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 rounded-xl transition-all text-sm font-medium mt-12"
            >
              编辑档案
            </button>
          )}
        </div>

        {/* 基本信息 */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            {verified && (
              <span className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium">
                <span>✓</span>
                <span>已验证</span>
              </span>
            )}
          </div>
          
          <p className="text-purple-200/80 leading-relaxed mb-3">
            {bio}
          </p>

          {/* 元数据 */}
          <div className="flex flex-wrap gap-3 text-sm text-purple-300/70">
            {location && (
              <div className="flex items-center space-x-1">
                <span>📍</span>
                <span>{location}</span>
              </div>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>🔗</span>
                <span>网站</span>
              </a>
            )}
            <div className="flex items-center space-x-1">
              <span>📅</span>
              <span>加入于 {new Date(profile.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
        </div>

        {/* 兴趣标签 */}
        {interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
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
              {skills.length}
            </div>
            <div className="text-xs text-purple-300/60 mt-1">技能</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {achievements.length}
            </div>
            <div className="text-xs text-purple-300/60 mt-1">成就</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {skills.reduce((sum, skill) => sum + skill.endorsements, 0)}
            </div>
            <div className="text-xs text-purple-300/60 mt-1">背书</div>
          </div>
        </div>

          {/* 社交链接 */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {profile.socialLinks.map((link) => {
              // 获取平台图标
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
                  <span className="text-xl">{icon}</span>
                </a>
              ) : (
                <div
                  key={link.id}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center"
                  title={link.username}
                >
                  <span className="text-xl">{icon}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* 钱包地址 */}
        <div className="mt-4 p-3 bg-black/30 rounded-xl">
          <div className="text-xs text-purple-300/60 mb-1">钱包地址</div>
          <div className="text-sm text-purple-200 font-mono truncate">
            {profile.walletAddress}
          </div>
        </div>
      </div>
    </div>
  )
}

