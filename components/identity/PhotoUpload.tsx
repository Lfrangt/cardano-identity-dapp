'use client'

import React, { useState, useRef } from 'react'
import { LiquidGlassCard, LiquidGlassButton } from '@/components/ui/LiquidGlass'

interface PhotoUploadProps {
  onPhotoSelect: (file: File, privacyLevel: 'public' | 'private' | 'selective') => void
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [privacyLevel, setPrivacyLevel] = useState<'public' | 'private' | 'selective'>('public')
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([])
  const [newAddress, setNewAddress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)

      // 创建预览
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      onPhotoSelect(selectedFile, privacyLevel)
    }
  }

  const addAuthorizedAddress = () => {
    if (newAddress && !authorizedAddresses.includes(newAddress)) {
      setAuthorizedAddresses([...authorizedAddresses, newAddress])
      setNewAddress('')
    }
  }

  const removeAuthorizedAddress = (address: string) => {
    setAuthorizedAddresses(authorizedAddresses.filter(a => a !== address))
  }

  return (
    <div className="space-y-6">
      <LiquidGlassCard rainbow>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          上传身份照片
        </h3>

        {/* 文件选择区域 */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-600">点击更换照片</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-white text-4xl">📷</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">点击选择照片</p>
                <p className="text-sm text-gray-600">支持 JPG, PNG, GIF 格式</p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* 隐私级别选择 */}
        {selectedFile && (
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">隐私设置</h4>

            <div className="space-y-3">
              {/* 公开选项 */}
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={privacyLevel === 'public'}
                  onChange={(e) => setPrivacyLevel(e.target.value as any)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">🌍</span>
                    <span className="font-semibold">公开</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">任何人都可以查看你的照片</p>
                </div>
              </label>

              {/* 加密选项 */}
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={privacyLevel === 'private'}
                  onChange={(e) => setPrivacyLevel(e.target.value as any)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">🔒</span>
                    <span className="font-semibold">私密</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">照片加密存储，只有你能查看</p>
                </div>
              </label>

              {/* 选择性分享选项 */}
              <label className="flex items-center p-4 border-2 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="privacy"
                  value="selective"
                  checked={privacyLevel === 'selective'}
                  onChange={(e) => setPrivacyLevel(e.target.value as any)}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">👥</span>
                    <span className="font-semibold">选择性分享</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">只有授权的地址可以查看</p>
                </div>
              </label>
            </div>

            {/* 授权地址管理 */}
            {privacyLevel === 'selective' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-3">授权地址</h5>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="输入 Cardano 地址"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <LiquidGlassButton
                    onClick={addAuthorizedAddress}
                    disabled={!newAddress}
                    size="sm"
                  >
                    添加
                  </LiquidGlassButton>
                </div>

                {authorizedAddresses.length > 0 ? (
                  <div className="space-y-2">
                    {authorizedAddresses.map((address, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm font-mono truncate flex-1">{address.slice(0, 20)}...{address.slice(-10)}</span>
                        <button
                          onClick={() => removeAuthorizedAddress(address)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">还没有授权地址</p>
                )}
              </div>
            )}

            {/* 上传按钮 */}
            <LiquidGlassButton
              onClick={handleUpload}
              variant="primary"
              size="lg"
              className="w-full mt-6"
            >
              🚀 上传到 Cardano 链
            </LiquidGlassButton>

            {/* 提示信息 */}
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-xl mr-2">💡</span>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">注意事项：</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>照片将存储在 IPFS 去中心化网络上</li>
                    <li>照片哈希值会记录在 Cardano 区块链上</li>
                    <li>加密照片使用 AES-256 加密算法</li>
                    <li>上传需要支付少量 ADA 作为交易费用</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </LiquidGlassCard>
    </div>
  )
}
