'use client'

import React, { useState } from 'react'
import { ProfileFormData } from '@/lib/types/identity'

interface ProfileFormProps {
  initialData?: ProfileFormData
  onSubmit: (data: ProfileFormData) => void
  onCancel?: () => void
  isLoading?: boolean
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData || {
    displayName: '',
    bio: '',
    location: '',
    website: '',
    interests: []
  })

  const [newInterest, setNewInterest] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证必填字段
    if (!formData.displayName.trim()) {
      alert('请输入显示名称')
      return
    }
    
    if (!formData.bio.trim()) {
      alert('请输入个人简介')
      return
    }
    
    onSubmit(formData)
  }

  const addInterest = () => {
    const interest = newInterest.trim()
    if (interest && !formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      })
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 显示名称 */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          显示名称 *
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          placeholder="你的名字或昵称"
          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          maxLength={50}
          required
        />
        <p className="text-xs text-purple-300/60 mt-1">
          {formData.displayName.length}/50
        </p>
      </div>

      {/* 个人简介 */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          个人简介 *
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="介绍一下你自己..."
          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          rows={4}
          maxLength={500}
          required
        />
        <p className="text-xs text-purple-300/60 mt-1">
          {formData.bio.length}/500
        </p>
      </div>

      {/* 位置 */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          位置
        </label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="你的所在地"
          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          maxLength={100}
        />
      </div>

      {/* 网站 */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          个人网站
        </label>
        <input
          type="url"
          value={formData.website || ''}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://your-website.com"
          className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* 兴趣标签 */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          兴趣标签
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addInterest()
              }
            }}
            placeholder="添加兴趣标签 (按 Enter)"
            className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            maxLength={20}
          />
          <button
            type="button"
            onClick={addInterest}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 rounded-lg transition-all text-sm font-medium"
          >
            添加
          </button>
        </div>

        {formData.interests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-full text-sm text-purple-200"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-2 text-purple-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
        <div className="flex items-start space-x-3">
          <span className="text-xl">💡</span>
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">温馨提示:</p>
            <ul className="list-disc list-inside text-blue-200/70 space-y-1">
              <li>你的档案将存储在区块链上</li>
              <li>可以随时更新你的个人信息</li>
              <li>添加技能和成就后可以获得他人背书</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 按钮组 */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all disabled:opacity-50"
          >
            取消
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
        >
          {isLoading ? '保存中...' : (initialData ? '更新档案' : '创建档案')}
        </button>
      </div>
    </form>
  )
}

