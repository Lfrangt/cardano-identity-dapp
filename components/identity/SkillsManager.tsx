'use client'

import React, { useState } from 'react'
import { Skill } from '@/lib/types/identity'

interface SkillsManagerProps {
  skills: Skill[]
  onUpdate: (skills: Skill[]) => void
  editable?: boolean
}

const SKILL_LEVELS = {
  beginner: { label: '初学者', color: 'from-gray-500 to-gray-600', percentage: 25 },
  intermediate: { label: '中级', color: 'from-blue-500 to-blue-600', percentage: 50 },
  advanced: { label: '高级', color: 'from-purple-500 to-purple-600', percentage: 75 },
  expert: { label: '专家', color: 'from-amber-500 to-orange-600', percentage: 100 }
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({
  skills,
  onUpdate,
  editable = true
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'intermediate' as Skill['level']
  })

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      alert('请输入技能名称')
      return
    }

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name.trim(),
      level: newSkill.level,
      endorsements: 0,
      verified: false
    }

    onUpdate([...skills, skill])
    setNewSkill({ name: '', level: 'intermediate' })
    setShowAddForm(false)
  }

  const handleRemoveSkill = (skillId: string) => {
    if (confirm('确定要删除这个技能吗？')) {
      onUpdate(skills.filter(s => s.id !== skillId))
    }
  }

  const handleUpdateLevel = (skillId: string, newLevel: Skill['level']) => {
    onUpdate(skills.map(s => 
      s.id === skillId ? { ...s, level: newLevel } : s
    ))
  }

  return (
    <div className="space-y-4">
      {/* 标题和添加按钮 */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>🎯</span>
          <span>技能</span>
          <span className="text-sm text-purple-300/70">({skills.length})</span>
        </h3>
        {editable && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 rounded-lg transition-all text-sm font-medium"
          >
            + 添加技能
          </button>
        )}
      </div>

      {/* 添加表单 */}
      {showAddForm && (
        <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-xl space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              技能名称
            </label>
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="例如: Cardano, React, Plutus..."
              className="w-full px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              技能水平
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SKILL_LEVELS).map(([level, info]) => (
                <label
                  key={level}
                  className={`flex items-center p-2 border-2 rounded-lg cursor-pointer transition-all ${
                    newSkill.level === level
                      ? 'border-purple-400/60 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="skill-level"
                    value={level}
                    checked={newSkill.level === level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                    className="mr-2"
                  />
                  <span className="text-sm text-white">{info.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewSkill({ name: '', level: 'intermediate' })
              }}
              className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium transition-all"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleAddSkill}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              添加
            </button>
          </div>
        </div>
      )}

      {/* 技能列表 */}
      {skills.length === 0 ? (
        <div className="text-center py-8 text-purple-300/60">
          <p className="text-sm">还没有添加技能</p>
          <p className="text-xs mt-1">点击"添加技能"开始创建</p>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => {
            const levelInfo = SKILL_LEVELS[skill.level]
            return (
              <div
                key={skill.id}
                className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold text-white">{skill.name}</h4>
                      {skill.verified && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">
                          ✓ 已验证
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className={`px-2 py-1 bg-gradient-to-r ${levelInfo.color} text-white rounded text-xs font-medium`}>
                        {levelInfo.label}
                      </span>
                      {skill.endorsements > 0 && (
                        <span className="text-purple-300/70">
                          👍 {skill.endorsements} 背书
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {editable && (
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* 技能进度条 */}
                <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${levelInfo.color} transition-all duration-500`}
                    style={{ width: `${levelInfo.percentage}%` }}
                  />
                </div>

                {/* 编辑级别 */}
                {editable && (
                  <div className="mt-3 flex gap-1">
                    {Object.entries(SKILL_LEVELS).map(([level, info]) => (
                      <button
                        key={level}
                        onClick={() => handleUpdateLevel(skill.id, level as Skill['level'])}
                        className={`flex-1 px-2 py-1 text-xs rounded transition-all ${
                          skill.level === level
                            ? `bg-gradient-to-r ${info.color} text-white`
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                        title={info.label}
                      >
                        {info.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

