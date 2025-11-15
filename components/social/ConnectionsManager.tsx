'use client'

import React, { useState, useEffect } from 'react'
import { Connection, ConnectionRequest } from '@/lib/types/identity'
import {
  getUserConnections,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection
} from '@/lib/services/social-connection'

interface ConnectionsManagerProps {
  walletAddress: string
  onViewProfile: (address: string) => void
}

export const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({
  walletAddress,
  onViewProfile
}) => {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections')
  const [connections, setConnections] = useState<Connection[]>([])
  const [requests, setRequests] = useState<ConnectionRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [walletAddress])

  const loadData = () => {
    setLoading(true)
    try {
      const userConnections = getUserConnections(walletAddress)
      const userRequests = getConnectionRequests(walletAddress)
        .filter(r => r.status === 'pending')
      
      setConnections(userConnections)
      setRequests(userRequests)
    } catch (error) {
      console.error('加载连接数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = (requestId: string) => {
    const result = acceptConnectionRequest(requestId)
    if (result) {
      alert('✅ 已接受连接请求')
      loadData()
    } else {
      alert('接受请求失败')
    }
  }

  const handleRejectRequest = (requestId: string) => {
    const result = rejectConnectionRequest(requestId)
    if (result) {
      alert('已拒绝连接请求')
      loadData()
    } else {
      alert('拒绝请求失败')
    }
  }

  const handleRemoveConnection = (targetAddress: string, displayName: string) => {
    if (!confirm(`确定要移除与 ${displayName} 的连接吗？`)) {
      return
    }

    const result = removeConnection(walletAddress, targetAddress)
    if (result) {
      alert('✅ 连接已移除')
      loadData()
    } else {
      alert('移除连接失败')
    }
  }

  if (loading) {
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
      {/* 标签切换 */}
      <div className="flex space-x-2 p-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
            activeTab === 'connections'
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
              : 'text-purple-300 hover:bg-white/5'
          }`}
        >
          🤝 我的连接 ({connections.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all text-sm relative ${
            activeTab === 'requests'
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
              : 'text-purple-300 hover:bg-white/5'
          }`}
        >
          📬 连接请求 ({requests.length})
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* 我的连接 */}
      {activeTab === 'connections' && (
        <div className="space-y-3">
          {connections.length === 0 ? (
            <div className="text-center py-12 px-4">
              <span className="text-6xl block mb-4">🤝</span>
              <h3 className="text-xl font-bold text-white mb-2">还没有连接</h3>
              <p className="text-purple-200/70">
                搜索用户并发送连接请求来建立关系
              </p>
            </div>
          ) : (
            connections.map((connection) => (
              <div
                key={connection.id}
                className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* 头像 */}
                  <div 
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => onViewProfile(connection.walletAddress)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg hover:shadow-purple-500/50 transition-shadow">
                      {connection.avatar ? (
                        <img 
                          src={connection.avatar}
                          alt={connection.displayName}
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
                      <h4 
                        className="font-bold text-white truncate cursor-pointer hover:text-purple-300 transition-colors"
                        onClick={() => onViewProfile(connection.walletAddress)}
                      >
                        {connection.displayName}
                      </h4>
                    </div>
                    
                    {connection.bio && (
                      <p className="text-sm text-purple-200/80 line-clamp-1 mb-2">
                        {connection.bio}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-purple-300/60">
                      <span>
                        📅 {new Date(connection.connectedAt).toLocaleDateString('zh-CN')}
                      </span>
                      {connection.mutualConnections > 0 && (
                        <>
                          <span>•</span>
                          <span>{connection.mutualConnections} 个共同连接</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 操作 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewProfile(connection.walletAddress)}
                      className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 rounded-lg transition-all text-xs font-medium"
                    >
                      查看档案
                    </button>
                    <button
                      onClick={() => handleRemoveConnection(connection.walletAddress, connection.displayName)}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-300 rounded-lg transition-all text-xs font-medium"
                    >
                      移除
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 连接请求 */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <span className="text-6xl block mb-4">📬</span>
              <h3 className="text-xl font-bold text-white mb-2">没有待处理的请求</h3>
              <p className="text-purple-200/70">
                当有人发送连接请求时，会显示在这里
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-xl border border-emerald-400/20"
              >
                <div className="flex items-center gap-4">
                  {/* 头像 */}
                  <div 
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => onViewProfile(request.fromAddress)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      <span>👤</span>
                    </div>
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 
                        className="font-bold text-white truncate cursor-pointer hover:text-emerald-300 transition-colors"
                        onClick={() => onViewProfile(request.fromAddress)}
                      >
                        {request.fromName}
                      </h4>
                      <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                        待处理
                      </span>
                    </div>
                    
                    {request.message && (
                      <p className="text-sm text-purple-200/80 mb-2">
                        {request.message}
                      </p>
                    )}

                    <div className="text-xs text-purple-300/60">
                      📅 {new Date(request.timestamp).toLocaleDateString('zh-CN')}
                    </div>
                  </div>

                  {/* 操作 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 rounded-lg transition-all text-xs font-medium"
                    >
                      ✓ 接受
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-300 rounded-lg transition-all text-xs font-medium"
                    >
                      ✕ 拒绝
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

