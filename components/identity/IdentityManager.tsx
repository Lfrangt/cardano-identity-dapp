'use client'

import React, { useState, useEffect } from 'react'
import { IdentityProfile, ProfileFormData, Skill, Achievement, SocialLink } from '@/lib/types/identity'
import {
  createProfile,
  saveProfileLocally,
  getProfileByWallet,
  updateProfile,
  updateSkills,
  updateAchievements,
  uploadProfileToIPFS,
  getProfileStats
} from '@/lib/services/identity-profile'
import { ProfileForm } from './ProfileForm'
import { ProfileCard } from './ProfileCard'
import { SkillsManager } from './SkillsManager'
import { AchievementsManager } from './AchievementsManager'
import { SocialLinksManager } from './SocialLinksManager'

interface IdentityManagerProps {
  walletAddress: string
  onClose?: () => void
}

type ViewMode = 'overview' | 'create' | 'edit' | 'skills' | 'achievements' | 'socialLinks'

export const IdentityManager: React.FC<IdentityManagerProps> = ({
  walletAddress,
  onClose
}) => {
  const [profile, setProfile] = useState<IdentityProfile | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 加载现有档案
    const existingProfile = getProfileByWallet(walletAddress)
    if (existingProfile) {
      setProfile(existingProfile)
      setViewMode('overview')
    } else {
      setViewMode('create')
    }
  }, [walletAddress])

  const handleCreateProfile = async (formData: ProfileFormData) => {
    setLoading(true)
    try {
      console.log('创建新档案...', formData)
      
      // 创建档案
      const newProfile = createProfile(walletAddress, formData)
      
      // 保存到本地
      saveProfileLocally(newProfile)
      
      // 模拟上传到 IPFS
      await uploadProfileToIPFS(newProfile)
      
      setProfile(newProfile)
      setViewMode('overview')
      
      alert('✅ 身份档案创建成功！')
    } catch (error: any) {
      console.error('创建档案失败:', error)
      alert(`创建档案失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (formData: ProfileFormData) => {
    if (!profile) return
    
    setLoading(true)
    try {
      console.log('更新档案...', formData)
      
      const updated = updateProfile(profile.id, {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        interests: formData.interests
      })
      
      if (updated) {
        setProfile(updated)
        setViewMode('overview')
        alert('✅ 档案已更新！')
      }
    } catch (error: any) {
      console.error('更新档案失败:', error)
      alert(`更新档案失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSkills = (skills: Skill[]) => {
    if (!profile) return
    
    const updated = updateSkills(profile.id, skills)
    if (updated) {
      setProfile(updated)
    }
  }

  const handleUpdateAchievements = (achievements: Achievement[]) => {
    if (!profile) return
    
    const updated = updateAchievements(profile.id, achievements)
    if (updated) {
      setProfile(updated)
    }
  }

  const handleUpdateSocialLinks = (socialLinks: SocialLink[]) => {
    if (!profile) return
    
    const updated = updateProfile(profile.id, { socialLinks })
    if (updated) {
      setProfile(updated)
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            身份管理
          </h2>
          <p className="text-purple-200/70 mt-1">
            创建和管理你的去中心化身份档案
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

      {/* 导航标签 */}
      {profile && viewMode !== 'create' && (
        <div className="flex space-x-2 p-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
              viewMode === 'overview'
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            📋 概览
          </button>
          <button
            onClick={() => setViewMode('skills')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
              viewMode === 'skills'
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            🎯 技能
          </button>
          <button
            onClick={() => setViewMode('achievements')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
              viewMode === 'achievements'
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            🏆 成就
          </button>
          <button
            onClick={() => setViewMode('socialLinks')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
              viewMode === 'socialLinks'
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                : 'text-purple-300 hover:bg-white/5'
            }`}
          >
            🔗 社交链接
          </button>
        </div>
      )}

      {/* 内容区域 */}
      <div className="space-y-6">
        {/* 创建档案 */}
        {viewMode === 'create' && (
          <div className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl mb-4 shadow-2xl">
                <span className="text-white text-4xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">创建你的身份档案</h3>
              <p className="text-purple-200/70">
                开始构建你的去中心化数字身份
              </p>
            </div>
            <ProfileForm 
              onSubmit={handleCreateProfile}
              isLoading={loading}
            />
          </div>
        )}

        {/* 编辑档案 */}
        {viewMode === 'edit' && profile && (
          <div className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20">
            <h3 className="text-2xl font-bold text-white mb-6">编辑档案</h3>
            <ProfileForm 
              initialData={{
                displayName: profile.displayName,
                bio: profile.bio,
                location: profile.location,
                website: profile.website,
                interests: profile.interests
              }}
              onSubmit={handleUpdateProfile}
              onCancel={() => setViewMode('overview')}
              isLoading={loading}
            />
          </div>
        )}

        {/* 档案概览 */}
        {viewMode === 'overview' && profile && (
          <div className="space-y-6">
            {/* 档案卡片 */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20 overflow-hidden">
              <ProfileCard 
                profile={profile}
                onEdit={() => setViewMode('edit')}
                editable={true}
              />
            </div>

            {/* 统计数据 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 技能预览 */}
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-blue-400/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>🎯</span>
                    <span>技能</span>
                  </h3>
                  <button
                    onClick={() => setViewMode('skills')}
                    className="text-blue-300 hover:text-blue-200 transition-colors text-sm"
                  >
                    管理 →
                  </button>
                </div>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {profile.skills.length}
                  </div>
                  <div className="text-sm text-blue-200/70 mt-1">已添加技能</div>
                </div>
              </div>

              {/* 成就预览 */}
              <div className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-amber-400/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>🏆</span>
                    <span>成就</span>
                  </h3>
                  <button
                    onClick={() => setViewMode('achievements')}
                    className="text-amber-300 hover:text-amber-200 transition-colors text-sm"
                  >
                    管理 →
                  </button>
                </div>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    {profile.achievements.length}
                  </div>
                  <div className="text-sm text-amber-200/70 mt-1">已获得成就</div>
                </div>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="p-6 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💡</span>
                <div className="text-sm text-blue-200">
                  <p className="font-medium mb-2">下一步:</p>
                  <ul className="list-disc list-inside text-blue-200/70 space-y-1">
                    <li>添加你的技能并设置技能水平</li>
                    <li>记录你的成就和里程碑</li>
                    <li>邀请他人为你的技能背书</li>
                    <li>将档案上传到区块链永久保存</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 技能管理 */}
        {viewMode === 'skills' && profile && (
          <div className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl border border-blue-400/20">
            <SkillsManager
              skills={profile.skills}
              onUpdate={handleUpdateSkills}
              editable={true}
            />
          </div>
        )}

        {/* 成就管理 */}
        {viewMode === 'achievements' && profile && (
          <div className="p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl border border-amber-400/20">
            <AchievementsManager
              achievements={profile.achievements}
              onUpdate={handleUpdateAchievements}
              editable={true}
            />
          </div>
        )}

        {/* 社交链接管理 */}
        {viewMode === 'socialLinks' && profile && (
          <div className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl border border-blue-400/20">
            <SocialLinksManager
              socialLinks={profile.socialLinks}
              onUpdate={handleUpdateSocialLinks}
              editable={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}

