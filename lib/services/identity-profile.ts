/**
 * 身份档案存储服务
 * 负责身份档案的创建、更新、查询和存储（本地 + 链上）
 */

import { IdentityProfile, ProfileFormData, Skill, Achievement } from '@/lib/types/identity'

const STORAGE_KEY = 'identity_profiles'
const CURRENT_PROFILE_KEY = 'current_profile'

/**
 * 创建新的身份档案
 */
export function createProfile(
  walletAddress: string,
  formData: ProfileFormData
): IdentityProfile {
  const now = Date.now()
  
  const profile: IdentityProfile = {
    id: `profile_${now}`,
    walletAddress,
    displayName: formData.displayName,
    bio: formData.bio,
    location: formData.location,
    website: formData.website,
    interests: formData.interests,
    skills: [],
    achievements: [],
    socialLinks: [],
    createdAt: now,
    updatedAt: now,
    verified: false,
    privacyLevel: 'public'
  }

  return profile
}

/**
 * 保存档案到本地存储
 */
export function saveProfileLocally(profile: IdentityProfile): void {
  try {
    // 获取所有档案
    const profiles = getAllProfiles()
    
    // 查找是否已存在
    const existingIndex = profiles.findIndex(p => p.id === profile.id)
    
    if (existingIndex >= 0) {
      // 更新现有档案
      profiles[existingIndex] = {
        ...profile,
        updatedAt: Date.now()
      }
    } else {
      // 添加新档案
      profiles.push(profile)
    }
    
    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
    
    // 设置为当前档案
    localStorage.setItem(CURRENT_PROFILE_KEY, profile.id)
    
    console.log('✅ 档案已保存到本地:', profile.id)
  } catch (error) {
    console.error('❌ 保存档案失败:', error)
    throw new Error('保存档案失败')
  }
}

/**
 * 获取所有档案
 */
export function getAllProfiles(): IdentityProfile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    return JSON.parse(stored) as IdentityProfile[]
  } catch (error) {
    console.error('获取档案列表失败:', error)
    return []
  }
}

/**
 * 根据钱包地址获取档案
 */
export function getProfileByWallet(walletAddress: string): IdentityProfile | null {
  const profiles = getAllProfiles()
  return profiles.find(p => p.walletAddress === walletAddress) || null
}

/**
 * 根据 ID 获取档案
 */
export function getProfileById(profileId: string): IdentityProfile | null {
  const profiles = getAllProfiles()
  return profiles.find(p => p.id === profileId) || null
}

/**
 * 获取当前档案
 */
export function getCurrentProfile(): IdentityProfile | null {
  try {
    const currentId = localStorage.getItem(CURRENT_PROFILE_KEY)
    if (!currentId) return null
    
    return getProfileById(currentId)
  } catch (error) {
    console.error('获取当前档案失败:', error)
    return null
  }
}

/**
 * 更新档案基本信息
 */
export function updateProfile(
  profileId: string,
  updates: Partial<IdentityProfile>
): IdentityProfile | null {
  const profiles = getAllProfiles()
  const index = profiles.findIndex(p => p.id === profileId)
  
  if (index === -1) {
    console.error('档案不存在:', profileId)
    return null
  }
  
  const updatedProfile = {
    ...profiles[index],
    ...updates,
    updatedAt: Date.now()
  }
  
  profiles[index] = updatedProfile
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  
  console.log('✅ 档案已更新:', profileId)
  return updatedProfile
}

/**
 * 更新技能
 */
export function updateSkills(profileId: string, skills: Skill[]): IdentityProfile | null {
  return updateProfile(profileId, { skills })
}

/**
 * 更新成就
 */
export function updateAchievements(profileId: string, achievements: Achievement[]): IdentityProfile | null {
  return updateProfile(profileId, { achievements })
}

/**
 * 删除档案
 */
export function deleteProfile(profileId: string): boolean {
  try {
    const profiles = getAllProfiles()
    const filtered = profiles.filter(p => p.id !== profileId)
    
    if (filtered.length === profiles.length) {
      console.warn('档案不存在:', profileId)
      return false
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    
    // 如果删除的是当前档案，清除当前档案标记
    const currentId = localStorage.getItem(CURRENT_PROFILE_KEY)
    if (currentId === profileId) {
      localStorage.removeItem(CURRENT_PROFILE_KEY)
    }
    
    console.log('✅ 档案已删除:', profileId)
    return true
  } catch (error) {
    console.error('删除档案失败:', error)
    return false
  }
}

/**
 * 上传档案到 IPFS（演示版本）
 * 实际生产环境需要实现真实的 IPFS 上传
 */
export async function uploadProfileToIPFS(profile: IdentityProfile): Promise<string> {
  try {
    console.log('📤 开始上传档案到 IPFS...')
    
    // 准备档案数据（移除敏感信息）
    const profileData = {
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      coverImage: profile.coverImage,
      skills: profile.skills,
      achievements: profile.achievements,
      interests: profile.interests,
      location: profile.location,
      website: profile.website,
      verified: profile.verified,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    }
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成模拟的 IPFS CID
    const mockCID = 'Qm' + Array.from(crypto.getRandomValues(new Uint8Array(22)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    console.log('✅ 档案已上传到 IPFS:', mockCID)
    
    // 保存 CID 到档案
    updateProfile(profile.id, { nftPolicyId: mockCID })
    
    return mockCID
  } catch (error) {
    console.error('❌ 上传档案到 IPFS 失败:', error)
    throw new Error('上传档案失败')
  }
}

/**
 * 从 IPFS 获取档案（演示版本）
 */
export async function getProfileFromIPFS(cid: string): Promise<any> {
  try {
    console.log('📥 从 IPFS 获取档案:', cid)
    
    // 实际生产环境需要从 IPFS 获取数据
    // 这里返回模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      displayName: 'Mock Profile',
      bio: 'This is a mock profile from IPFS'
    }
  } catch (error) {
    console.error('❌ 从 IPFS 获取档案失败:', error)
    throw new Error('获取档案失败')
  }
}

/**
 * 导出档案为 JSON
 */
export function exportProfile(profile: IdentityProfile): string {
  return JSON.stringify(profile, null, 2)
}

/**
 * 从 JSON 导入档案
 */
export function importProfile(jsonString: string): IdentityProfile {
  try {
    const profile = JSON.parse(jsonString) as IdentityProfile
    
    // 验证必要字段
    if (!profile.id || !profile.walletAddress || !profile.displayName) {
      throw new Error('无效的档案数据')
    }
    
    return profile
  } catch (error) {
    console.error('导入档案失败:', error)
    throw new Error('导入档案失败')
  }
}

/**
 * 获取档案统计信息
 */
export function getProfileStats(profile: IdentityProfile) {
  return {
    totalSkills: profile.skills.length,
    totalAchievements: profile.achievements.length,
    totalEndorsements: profile.skills.reduce((sum, skill) => sum + skill.endorsements, 0),
    verifiedSkills: profile.skills.filter(s => s.verified).length,
    verifiedAchievements: profile.achievements.filter(a => a.verified).length,
    expertSkills: profile.skills.filter(s => s.level === 'expert').length
  }
}

/**
 * 搜索档案
 */
export function searchProfiles(query: string): IdentityProfile[] {
  const profiles = getAllProfiles()
  const lowerQuery = query.toLowerCase()
  
  return profiles.filter(profile => 
    profile.displayName.toLowerCase().includes(lowerQuery) ||
    profile.bio.toLowerCase().includes(lowerQuery) ||
    profile.interests.some(interest => interest.toLowerCase().includes(lowerQuery)) ||
    profile.skills.some(skill => skill.name.toLowerCase().includes(lowerQuery))
  )
}

