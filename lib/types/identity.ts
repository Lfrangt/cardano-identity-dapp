/**
 * 身份档案相关类型定义
 */

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  endorsements: number
  verified: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  icon: string
  verified: boolean
  proofUrl?: string
}

export interface SocialLink {
  id: string
  platform: 'x' | 'instagram' | 'wechat' | 'douyin' | 'xiaohongshu' | 'linkedin' | 'github' | 'discord' | 'telegram' | 'other'
  username: string
  url: string
  verified: boolean
}

export interface SocialPlatform {
  id: string
  name: string
  displayName: string
  icon: string
  baseUrl: string
  placeholder: string
  color: string
}

export interface IdentityProfile {
  id: string
  walletAddress: string
  displayName: string
  bio: string
  avatar?: string
  coverImage?: string
  skills: Skill[]
  achievements: Achievement[]
  socialLinks: SocialLink[]
  interests: string[]
  location?: string
  website?: string
  createdAt: number
  updatedAt: number
  nftPolicyId?: string // 身份 NFT 的 Policy ID
  verified: boolean
  privacyLevel: 'public' | 'private' | 'selective'
}

export interface ProfileFormData {
  displayName: string
  bio: string
  location?: string
  website?: string
  interests: string[]
}

export interface Connection {
  id: string
  walletAddress: string
  displayName: string
  avatar?: string
  bio?: string
  connectedAt: number
  mutualConnections: number
  status: 'pending' | 'accepted' | 'blocked'
  initiatedBy: string // 谁发起的连接
}

export interface ConnectionRequest {
  id: string
  fromAddress: string
  fromName: string
  toAddress: string
  message?: string
  timestamp: number
  status: 'pending' | 'accepted' | 'rejected'
}

export interface Endorsement {
  id: string
  skillId: string
  endorserAddress: string
  endorserName: string
  timestamp: number
  txHash?: string
}

export interface PublicProfileView {
  walletAddress: string
  displayName: string
  bio: string
  avatar?: string
  coverImage?: string
  skills: Skill[]
  achievements: Achievement[]
  interests: string[]
  socialLinks: SocialLink[]
  verified: boolean
  connectionCount: number
  isConnected: boolean
  canConnect: boolean
}

