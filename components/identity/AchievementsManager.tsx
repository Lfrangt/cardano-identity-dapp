'use client'

import React, { useState } from 'react'
import { Achievement } from '@/lib/types/identity'

interface AchievementsManagerProps {
  achievements: Achievement[]
  onUpdate: (achievements: Achievement[]) => void
  editable?: boolean
}

const ACHIEVEMENT_ICONS = ['🏆', '🎯', '⭐', '🥇', '💎', '🚀', '🎓', '💪', '🔥', '✨']

export const AchievementsManager: React.FC<AchievementsManagerProps> = ({
  achievements,
  onUpdate,
  editable = true
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    icon: '🏆',
    proofUrl: ''
  })

  const handleAddAchievement = () => {
    if (!newAchievement.title.trim()) {
      alert('请输入成就标题')
      return
    }
    
    if (!newAchievement.description.trim()) {
      alert('请输入成就描述')
      return
    }

    const achievement: Achievement = {
      id: Date.now().toString(),
      title: newAchievement.title.trim(),
      description: newAchievement.description.trim(),
      date: newAchievement.date,
      icon: newAchievement.icon,
      verified: false,
      proofUrl: newAchievement.proofUrl.trim() || undefined
    }

    onUpdate([...achievements, achievement])
    setNewAchievement({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      icon: '🏆',
      proofUrl: ''
    })
    setShowAddForm(false)
  }

  const handleRemoveAchievement = (achievementId: string) => {
    if (confirm('确定要删除这个成就吗？')) {
      onUpdate(achievements.filter(a => a.id !== achievementId))
    }
  }

  return (
    <div className="space-y-4">
      {/* 标题和添加按钮 */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>🏆</span>
          <span>成就</span>
          <span className="text-sm text-purple-300/70">({achievements.length})</span>
        </h3>
        {editable && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-lg transition-all text-sm font-medium"
          >
            + 添加成就
          </button>
        )}
      </div>

      {/* 添加表单 */}
      {showAddForm && (
        <div className="p-4 bg-amber-500/10 border border-amber-400/20 rounded-xl space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              成就标题 *
            </label>
            <input
              type="text"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
              placeholder="例如: 完成第一个 Cardano DApp"
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              成就描述 *
            </label>
            <textarea
              value={newAchievement.description}
              onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
              placeholder="描述你的成就..."
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              rows={3}
              maxLength={300}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                日期
              </label>
              <input
                type="date"
                value={newAchievement.date}
                onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                图标
              </label>
              <div className="grid grid-cols-5 gap-1">
                {ACHIEVEMENT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewAchievement({ ...newAchievement, icon })}
                    className={`p-2 text-2xl rounded-lg transition-all ${
                      newAchievement.icon === icon
                        ? 'bg-amber-500/30 border-2 border-amber-400'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              证明链接 (可选)
            </label>
            <input
              type="url"
              value={newAchievement.proofUrl}
              onChange={(e) => setNewAchievement({ ...newAchievement, proofUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewAchievement({
                  title: '',
                  description: '',
                  date: new Date().toISOString().split('T')[0],
                  icon: '🏆',
                  proofUrl: ''
                })
              }}
              className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium transition-all"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleAddAchievement}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              添加
            </button>
          </div>
        </div>
      )}

      {/* 成就列表 */}
      {achievements.length === 0 ? (
        <div className="text-center py-8 text-purple-300/60">
          <p className="text-sm">还没有添加成就</p>
          <p className="text-xs mt-1">点击"添加成就"开始创建</p>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-xl border border-amber-400/20 hover:border-amber-400/40 transition-all"
            >
              <div className="flex gap-4">
                {/* 图标 */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    {achievement.icon}
                  </div>
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-white">{achievement.title}</h4>
                        {achievement.verified && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                            ✓ 已验证
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-purple-200/80 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-purple-300/60">
                        <span>📅 {new Date(achievement.date).toLocaleDateString('zh-CN')}</span>
                        {achievement.proofUrl && (
                          <a
                            href={achievement.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                          >
                            <span>🔗</span>
                            <span>查看证明</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {editable && (
                      <button
                        onClick={() => handleRemoveAchievement(achievement.id)}
                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

