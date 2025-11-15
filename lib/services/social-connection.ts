/**
 * 社交连接服务
 * 管理用户之间的连接、关注和社交关系
 */

import { Connection, ConnectionRequest, IdentityProfile, PublicProfileView } from '@/lib/types/identity'
import { getProfileByWallet, getAllProfiles } from './identity-profile'

const CONNECTIONS_KEY = 'social_connections'
const CONNECTION_REQUESTS_KEY = 'connection_requests'

/**
 * 获取用户的所有连接
 */
export function getUserConnections(walletAddress: string): Connection[] {
  try {
    const allConnections = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]') as Connection[]
    return allConnections.filter(
      conn => 
        (conn.walletAddress === walletAddress || conn.initiatedBy === walletAddress) &&
        conn.status === 'accepted'
    )
  } catch (error) {
    console.error('获取连接列表失败:', error)
    return []
  }
}

/**
 * 检查两个用户是否已连接
 */
export function areConnected(address1: string, address2: string): boolean {
  const connections = getUserConnections(address1)
  return connections.some(
    conn => conn.walletAddress === address2 || conn.initiatedBy === address2
  )
}

/**
 * 发送连接请求
 */
export function sendConnectionRequest(
  fromAddress: string,
  fromName: string,
  toAddress: string,
  message?: string
): ConnectionRequest {
  try {
    // 检查是否已经连接
    if (areConnected(fromAddress, toAddress)) {
      throw new Error('已经是好友了')
    }

    // 检查是否已经发送过请求
    const existingRequests = getConnectionRequests(toAddress)
    const hasPending = existingRequests.some(
      req => req.fromAddress === fromAddress && req.status === 'pending'
    )
    
    if (hasPending) {
      throw new Error('已经发送过连接请求')
    }

    const request: ConnectionRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromAddress,
      fromName,
      toAddress,
      message,
      timestamp: Date.now(),
      status: 'pending'
    }

    const allRequests = JSON.parse(localStorage.getItem(CONNECTION_REQUESTS_KEY) || '[]')
    allRequests.push(request)
    localStorage.setItem(CONNECTION_REQUESTS_KEY, JSON.stringify(allRequests))

    console.log('✅ 连接请求已发送:', request.id)
    return request
  } catch (error) {
    console.error('❌ 发送连接请求失败:', error)
    throw error
  }
}

/**
 * 获取收到的连接请求
 */
export function getConnectionRequests(walletAddress: string): ConnectionRequest[] {
  try {
    const allRequests = JSON.parse(localStorage.getItem(CONNECTION_REQUESTS_KEY) || '[]') as ConnectionRequest[]
    return allRequests.filter(req => req.toAddress === walletAddress)
  } catch (error) {
    console.error('获取连接请求失败:', error)
    return []
  }
}

/**
 * 获取发出的连接请求
 */
export function getSentConnectionRequests(walletAddress: string): ConnectionRequest[] {
  try {
    const allRequests = JSON.parse(localStorage.getItem(CONNECTION_REQUESTS_KEY) || '[]') as ConnectionRequest[]
    return allRequests.filter(req => req.fromAddress === walletAddress)
  } catch (error) {
    console.error('获取已发送请求失败:', error)
    return []
  }
}

/**
 * 接受连接请求
 */
export function acceptConnectionRequest(requestId: string): Connection | null {
  try {
    const allRequests = JSON.parse(localStorage.getItem(CONNECTION_REQUESTS_KEY) || '[]') as ConnectionRequest[]
    const requestIndex = allRequests.findIndex(req => req.id === requestId)
    
    if (requestIndex === -1) {
      throw new Error('连接请求不存在')
    }

    const request = allRequests[requestIndex]
    
    // 更新请求状态
    request.status = 'accepted'
    allRequests[requestIndex] = request
    localStorage.setItem(CONNECTION_REQUESTS_KEY, JSON.stringify(allRequests))

    // 创建连接
    const fromProfile = getProfileByWallet(request.fromAddress)
    const toProfile = getProfileByWallet(request.toAddress)

    if (!fromProfile || !toProfile) {
      throw new Error('无法找到用户档案')
    }

    const connection: Connection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      walletAddress: request.fromAddress,
      displayName: fromProfile.displayName,
      avatar: fromProfile.avatar,
      bio: fromProfile.bio,
      connectedAt: Date.now(),
      mutualConnections: 0, // TODO: 计算共同连接
      status: 'accepted',
      initiatedBy: request.fromAddress
    }

    // 保存连接（双向）
    const allConnections = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]')
    allConnections.push(connection)
    
    // 为另一方也创建连接记录
    const reverseConnection: Connection = {
      ...connection,
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      walletAddress: request.toAddress,
      displayName: toProfile.displayName,
      avatar: toProfile.avatar,
      bio: toProfile.bio
    }
    allConnections.push(reverseConnection)
    
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(allConnections))

    console.log('✅ 连接请求已接受:', requestId)
    return connection
  } catch (error) {
    console.error('❌ 接受连接请求失败:', error)
    return null
  }
}

/**
 * 拒绝连接请求
 */
export function rejectConnectionRequest(requestId: string): boolean {
  try {
    const allRequests = JSON.parse(localStorage.getItem(CONNECTION_REQUESTS_KEY) || '[]') as ConnectionRequest[]
    const requestIndex = allRequests.findIndex(req => req.id === requestId)
    
    if (requestIndex === -1) {
      return false
    }

    allRequests[requestIndex].status = 'rejected'
    localStorage.setItem(CONNECTION_REQUESTS_KEY, JSON.stringify(allRequests))

    console.log('✅ 连接请求已拒绝:', requestId)
    return true
  } catch (error) {
    console.error('❌ 拒绝连接请求失败:', error)
    return false
  }
}

/**
 * 移除连接
 */
export function removeConnection(currentAddress: string, targetAddress: string): boolean {
  try {
    const allConnections = JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]') as Connection[]
    
    // 移除双向连接
    const filtered = allConnections.filter(conn => {
      // 移除当前用户到目标用户的连接
      if (conn.initiatedBy === currentAddress && conn.walletAddress === targetAddress) {
        return false
      }
      if (conn.initiatedBy === targetAddress && conn.walletAddress === currentAddress) {
        return false
      }
      // 移除旧的双向连接记录
      if (
        (conn.walletAddress === targetAddress && conn.initiatedBy === currentAddress) ||
        (conn.walletAddress === currentAddress && conn.initiatedBy === targetAddress)
      ) {
        return false
      }
      return true
    })

    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(filtered))
    console.log('✅ 连接已移除')
    return true
  } catch (error) {
    console.error('❌ 移除连接失败:', error)
    return false
  }
}

/**
 * 通过钱包地址搜索用户
 */
export function searchUserByAddress(address: string): IdentityProfile | null {
  try {
    // 清理地址（移除空格）
    const cleanAddress = address.trim()
    
    if (!cleanAddress) {
      return null
    }

    const profile = getProfileByWallet(cleanAddress)
    return profile
  } catch (error) {
    console.error('搜索用户失败:', error)
    return null
  }
}

/**
 * 搜索用户（支持部分地址、名称等）
 */
export function searchUsers(query: string): IdentityProfile[] {
  try {
    const allProfiles = getAllProfiles()
    const lowerQuery = query.toLowerCase().trim()
    
    if (!lowerQuery) {
      return []
    }

    return allProfiles.filter(profile => 
      profile.walletAddress.toLowerCase().includes(lowerQuery) ||
      profile.displayName.toLowerCase().includes(lowerQuery) ||
      profile.bio.toLowerCase().includes(lowerQuery) ||
      profile.interests.some(interest => interest.toLowerCase().includes(lowerQuery))
    ).slice(0, 20) // 限制返回数量
  } catch (error) {
    console.error('搜索用户失败:', error)
    return []
  }
}

/**
 * 获取公开档案视图
 */
export function getPublicProfile(
  targetAddress: string,
  viewerAddress?: string
): PublicProfileView | null {
  try {
    const profile = getProfileByWallet(targetAddress)
    
    if (!profile) {
      return null
    }

    // 检查隐私设置
    if (profile.privacyLevel === 'private' && viewerAddress !== targetAddress) {
      return null
    }

    const connections = getUserConnections(targetAddress)
    const isConnected = viewerAddress ? areConnected(targetAddress, viewerAddress) : false
    
    // 根据隐私级别决定显示内容
    let visibleSkills = profile.skills
    let visibleAchievements = profile.achievements
    
    if (profile.privacyLevel === 'selective' && !isConnected && viewerAddress !== targetAddress) {
      // 选择性分享且未连接，只显示部分信息
      visibleSkills = []
      visibleAchievements = []
    }

    const publicView: PublicProfileView = {
      walletAddress: profile.walletAddress,
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      coverImage: profile.coverImage,
      skills: visibleSkills,
      achievements: visibleAchievements,
      interests: profile.interests,
      socialLinks: profile.socialLinks || [],
      verified: profile.verified,
      connectionCount: connections.length,
      isConnected,
      canConnect: viewerAddress ? !isConnected && viewerAddress !== targetAddress : false
    }

    return publicView
  } catch (error) {
    console.error('获取公开档案失败:', error)
    return null
  }
}

/**
 * 计算共同连接数
 */
export function getMutualConnections(address1: string, address2: string): string[] {
  const connections1 = getUserConnections(address1).map(c => c.walletAddress)
  const connections2 = getUserConnections(address2).map(c => c.walletAddress)
  
  return connections1.filter(addr => connections2.includes(addr))
}

/**
 * 获取推荐连接（基于共同兴趣）
 */
export function getRecommendedConnections(
  currentAddress: string,
  limit: number = 10
): IdentityProfile[] {
  try {
    const currentProfile = getProfileByWallet(currentAddress)
    if (!currentProfile) {
      return []
    }

    const allProfiles = getAllProfiles()
    const currentConnections = getUserConnections(currentAddress)
    const connectedAddresses = currentConnections.map(c => c.walletAddress)

    // 过滤掉自己和已连接的用户
    const candidates = allProfiles.filter(
      p => p.walletAddress !== currentAddress && 
           !connectedAddresses.includes(p.walletAddress) &&
           p.privacyLevel !== 'private'
    )

    // 计算相似度分数（基于共同兴趣）
    const scored = candidates.map(profile => {
      const commonInterests = profile.interests.filter(
        interest => currentProfile.interests.includes(interest)
      ).length
      
      return {
        profile,
        score: commonInterests
      }
    })

    // 按分数排序并返回
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.profile)
  } catch (error) {
    console.error('获取推荐连接失败:', error)
    return []
  }
}

/**
 * 获取连接统计
 */
export function getConnectionStats(walletAddress: string) {
  const connections = getUserConnections(walletAddress)
  const requests = getConnectionRequests(walletAddress)
  const pendingRequests = requests.filter(r => r.status === 'pending')
  
  return {
    totalConnections: connections.length,
    pendingRequests: pendingRequests.length,
    recentConnections: connections.slice(-5).reverse()
  }
}

