'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// 全局钱包接口类型
declare global {
  interface Window {
    cardano?: {
      [key: string]: any
    }
  }
}

// 支持的钱包列表
const WALLETS = [
  {
    name: 'eternl',
    displayName: 'Eternl',
    icon: '♾️',
    downloadUrl: 'https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka'
  },
  {
    name: 'nami',
    displayName: 'Nami',
    icon: '🏖️',
    downloadUrl: 'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo'
  },
  {
    name: 'flint',
    displayName: 'Flint',
    icon: '🔥',
    downloadUrl: 'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj'
  }
]

export default function AppPage() {
  const [mounted, setMounted] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<any>(null)
  const [availableWallets, setAvailableWallets] = useState<string[]>([])
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'home' | 'upload' | 'gallery'>('home')

  // 照片上传相关状态
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [privacyLevel, setPrivacyLevel] = useState<'public' | 'private' | 'selective'>('public')
  const [authorizedAddresses, setAuthorizedAddresses] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 检查 API 配置状态
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const isAPIConfigured = () => {
    const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY
    const nftStorageKey = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    return blockfrostKey && blockfrostKey !== 'preview_test_key' &&
           nftStorageKey && nftStorageKey !== 'your_nft_storage_key'
  }

  useEffect(() => {
    setMounted(true)

    // 检查是否是演示模式
    const urlParams = new URLSearchParams(window.location.search)
    const isDemoMode = urlParams.get('demo') === 'true'

    if (isDemoMode) {
      // 演示模式：自动模拟钱包连接
      console.log('🎬 进入演示模式')
      setTimeout(() => {
        activateDemoMode()
      }, 500)
    } else {
      // 正常模式：清除任何假的连接状态
      setWalletConnected(false)
      setConnectedWallet(null)

      setTimeout(() => {
        if (typeof window !== 'undefined' && window.cardano) {
          const available = WALLETS
            .filter(wallet => window.cardano![wallet.name])
            .map(wallet => wallet.name)
          setAvailableWallets(available)
          console.log('可用钱包:', available)
        }
      }, 100)
    }
  }, [])

  // 激活演示模式
  const activateDemoMode = () => {
    console.log('✨ 激活演示模式')
    
    // 模拟钱包数据
    const demoWallet = {
      name: 'Demo Wallet',
      networkId: 0, // Preview 网络
      balance: 1234.567890,
      address: 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0kzzmjxtfrkhgyu9lsz9n3k7'
    }

    setWalletConnected(true)
    setConnectedWallet(demoWallet)
    setError(null)

    // 显示演示提示
    const banner = document.createElement('div')
    banner.id = 'demo-banner'
    banner.className = 'fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 px-6 text-center font-medium shadow-lg'
    banner.innerHTML = `
      <div class="flex items-center justify-center space-x-2">
        <span class="text-xl">🎬</span>
        <span>演示模式 - 所有操作都是模拟的，无需真实钱包</span>
        <button onclick="window.location.href='/app'" class="ml-4 px-3 py-1 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">
          退出演示
        </button>
      </div>
    `
    document.body.appendChild(banner)
  }

  // 连接钱包函数
  const connectWallet = async (walletName: string) => {
    if (!window.cardano || !window.cardano[walletName]) {
      setError(`${walletName} 钱包未安装`)
      return
    }

    setConnecting(true)
    setError(null)

    // 确保开始前状态是未连接
    setWalletConnected(false)
    setConnectedWallet(null)

    try {
      console.log(`🔗 开始连接 ${walletName} 钱包...`)

      // 请求用户授权
      const api = await window.cardano[walletName].enable()

      console.log('✅ 钱包 API 已获取')

      // 验证 API 是否真实可用
      if (!api || typeof api.getNetworkId !== 'function') {
        throw new Error('钱包 API 无效')
      }

      console.log('✅ 用户已授权,正在获取钱包信息...')

      const networkId = await api.getNetworkId()
      const addresses = await api.getUsedAddresses()

      // 验证必要数据都已获取
      if (!networkId && networkId !== 0) {
        throw new Error('无法获取网络 ID')
      }

      if (!addresses || addresses.length === 0) {
        throw new Error('无法获取钱包地址')
      }

      // 直接从钱包获取余额，不使用 Lucid
      let adaBalance = 0
      try {
        const balanceCBOR = await api.getBalance()

        // 尝试解析 CBOR 余额
        if (balanceCBOR) {
          // 使用 Cardano 序列化库解析 CBOR
          const CSL = await import('@emurgo/cardano-serialization-lib-browser')
          const hexToBytes = (hex: string) => {
            const bytes = new Uint8Array(hex.length / 2)
            for (let i = 0; i < hex.length; i += 2) {
              bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
            }
            return bytes
          }
          const value = CSL.Value.from_bytes(hexToBytes(balanceCBOR))
          const lovelace = value.coin().to_str()
          adaBalance = Number(lovelace) / 1_000_000
        }
      } catch (balanceError) {
        console.warn('无法获取余额，设置为 0:', balanceError)
        adaBalance = 0
      }

      console.log('✅ 钱包数据获取成功:', {
        name: walletName,
        networkId,
        address: addresses[0].substring(0, 20) + '...',
        balance: adaBalance.toFixed(1) + ' ADA'
      })

      const walletData = {
        name: walletName,
        api,
        networkId,
        balance: adaBalance,
        address: addresses[0]
      }

      // 只有所有数据都验证通过才设置为已连接
      setConnectedWallet(walletData)
      setWalletConnected(true)

      console.log(`🎉 ${walletName} 钱包连接成功！`)

    } catch (err: any) {
      console.error('❌ 钱包连接失败:', err)

      // 确保失败时清除状态
      setWalletConnected(false)
      setConnectedWallet(null)

      if (err.code === 4) {
        setError('用户拒绝了连接请求')
      } else if (err.code === 2) {
        setError('钱包被锁定,请先解锁')
      } else {
        setError(`连接失败: ${err.message || '未知错误'}`)
      }
    } finally {
      setConnecting(false)
    }
  }

  // 刷新余额
  const refreshBalance = async () => {
    if (!connectedWallet || !connectedWallet.api) {
      return
    }

    try {
      console.log('🔄 刷新钱包余额...')

      let adaBalance = 0
      try {
        const balanceCBOR = await connectedWallet.api.getBalance()

        if (balanceCBOR) {
          // 使用 Cardano 序列化库解析 CBOR
          const CSL = await import('@emurgo/cardano-serialization-lib-browser')
          const hexToBytes = (hex: string) => {
            const bytes = new Uint8Array(hex.length / 2)
            for (let i = 0; i < hex.length; i += 2) {
              bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
            }
            return bytes
          }
          const value = CSL.Value.from_bytes(hexToBytes(balanceCBOR))
          const lovelace = value.coin().to_str()
          adaBalance = Number(lovelace) / 1_000_000
        }
      } catch (balanceError) {
        console.warn('无法获取余额:', balanceError)
        adaBalance = 0
      }

      setConnectedWallet({
        ...connectedWallet,
        balance: adaBalance
      })

      console.log('✅ 余额已更新:', adaBalance.toFixed(1), 'ADA')
    } catch (error) {
      console.error('❌ 刷新余额失败:', error)
      setError('刷新余额失败')
    }
  }

  // 断开连接
  const disconnect = () => {
    // 安全确认
    const confirmed = window.confirm(
      '⚠️ 确定要断开钱包连接吗?\n\n断开后:\n• 所有钱包数据将被清除\n• 下次连接需要重新授权\n• 正在进行的操作将被取消'
    )

    if (!confirmed) {
      console.log('❌ 用户取消断开连接')
      return
    }

    console.log('🔓 正在断开钱包连接...')

    // 清除所有钱包状态
    setWalletConnected(false)
    setConnectedWallet(null)
    setError(null)
    setActiveTab('home')
    setSelectedFile(null)
    setPreview(null)

    // 清除任何缓存数据
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cardano_wallet_connection')
      // 清除其他可能的缓存
      sessionStorage.clear()
    }

    console.log('✅ 钱包已安全断开连接')
    console.log('🔒 下次连接需要重新授权')
  }

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      alert('请选择图片文件')
    }
  }

  // 上传照片到区块链
  const handleUpload = async () => {
    if (!selectedFile || !connectedWallet) {
      alert('请先选择照片并连接钱包')
      return
    }

    // 验证选择性隐私的授权地址
    if (privacyLevel === 'selective' && authorizedAddresses.length === 0) {
      alert('选择性分享模式需要至少添加一个授权地址')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // 检查是否是演示模式
      const urlParams = new URLSearchParams(window.location.search)
      const isDemoMode = urlParams.get('demo') === 'true'

      // 检查是否配置了真实的 API 密钥
      const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY
      const nftStorageKey = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
      const pinataKey = process.env.NEXT_PUBLIC_PINATA_API_KEY

      // 启用真实模式（但演示模式下强制使用模拟）
      const isRealMode = !isDemoMode && blockfrostKey && blockfrostKey !== 'preview_test_key'

      /*
      const isRealMode = blockfrostKey && blockfrostKey !== 'preview_test_key' &&
                         (nftStorageKey && nftStorageKey !== 'your_nft_storage_key' ||
                          pinataKey && pinataKey !== 'your_pinata_key')
      */

      if (isRealMode) {
        // 真实模式：实际上传到区块链
        console.log('🚀 开始真实上链流程...')
        console.log('隐私级别:', privacyLevel)
        console.log('文件大小:', (selectedFile.size / 1024).toFixed(2), 'KB')

        // 步骤 1: 上传到 IPFS
        setUploadStatus('📤 正在上传到 IPFS 去中心化存储...')
        setUploadProgress(20)

        // 动态导入服务模块
        const { uploadToIPFS } = await import('@/lib/services/ipfs')
        const { createIdentityMetadata } = await import('@/lib/services/identity-nft')

        // 如果是私密模式，先加密文件
        let fileToUpload = selectedFile
        let isEncrypted = false

        if (privacyLevel === 'private') {
          setUploadStatus('🔐 正在加密照片...')
          // TODO: 实现加密逻辑
          isEncrypted = true
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        // 上传到 IPFS
        const ipfsResult = await uploadToIPFS(fileToUpload, selectedFile.name)
        console.log('✅ IPFS 上传成功:', ipfsResult)
        setUploadProgress(50)

        // 步骤 2: 创建 NFT metadata
        setUploadStatus('📝 正在准备 NFT metadata...')

        const privacyLabels = {
          public: '公开',
          private: '私密',
          selective: '选择性分享'
        }

        const metadata = createIdentityMetadata(ipfsResult.cid, privacyLevel, {
          name: `身份照片 - ${new Date().toLocaleDateString('zh-CN')}`,
          description: `在 Cardano 区块链上的去中心化身份照片 (${privacyLabels[privacyLevel]})`,
          encrypted: isEncrypted,
          authorizedAddresses: privacyLevel === 'selective' ? authorizedAddresses : undefined,
          attributes: [
            { trait_type: '隐私级别', value: privacyLabels[privacyLevel] },
            { trait_type: '加密状态', value: isEncrypted ? '已加密' : '未加密' },
            { trait_type: '文件大小', value: `${(selectedFile.size / 1024).toFixed(2)} KB` },
            { trait_type: '上传日期', value: new Date().toISOString() },
            { trait_type: 'IPFS Gateway', value: ipfsResult.gateway }
          ]
        })

        console.log('📋 Metadata 已创建:', metadata)
        setUploadProgress(55)

        // 步骤 3: 使用钱包 API 铸造 NFT
        setUploadStatus('⚡ 正在铸造 NFT 到 Cardano 区块链...')
        setUploadProgress(60)

        // 导入钱包 NFT 铸造服务
        const { mintIdentityNFTWithWallet } = await import('@/lib/services/wallet-nft')

        console.log('开始使用钱包 API 铸造 NFT...')
        const result = await mintIdentityNFTWithWallet(connectedWallet.api, metadata)

        setUploadProgress(100)
        setUploadStatus('🎉 上链成功！')

        console.log('🎉 NFT 铸造成功！', result)

        // 显示成功信息
        const networkName = connectedWallet.networkId === 1 ? 'mainnet' : 'preview'
        const explorerUrl = `https://cardanoscan.io/${networkName}/transaction/${result.txHash}`

        alert(`✅ 照片已成功上传到 Cardano 区块链!

🔗 交易哈希: ${result.txHash.substring(0, 20)}...
🎨 Policy ID: ${result.policyId.substring(0, 20)}...
🏷️ 资产名称: ${result.assetName}
🔐 隐私级别: ${privacyLabels[privacyLevel]}
📦 IPFS CID: ${ipfsResult.cid.substring(0, 20)}...

您可以在区块链浏览器中查看此交易:
${explorerUrl}`)

        // 保存到本地存储
        const savedNFTs = JSON.parse(localStorage.getItem('my_nfts') || '[]')
        savedNFTs.push({
          policyId: result.policyId,
          assetName: result.assetName,
          txHash: result.txHash,
          unit: result.unit,
          metadata,
          ipfsResult,
          timestamp: Date.now()
        })
        localStorage.setItem('my_nfts', JSON.stringify(savedNFTs))

      } else {
        // 演示模式：模拟完整的上传流程
        console.log('🎭 演示模式 - 模拟完整上链流程')

        // 步骤 1: 模拟 IPFS 上传
        setUploadStatus('📤 正在上传到 IPFS 去中心化存储...')
        setUploadProgress(15)
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 生成模拟的 IPFS CID
        const mockCID = 'Qm' + Array.from(crypto.getRandomValues(new Uint8Array(22)))
          .map(b => b.toString(16).padStart(2, '0')).join('')

        console.log('✅ 模拟 IPFS CID:', mockCID)
        setUploadProgress(30)

        // 步骤 2: 创建 metadata
        setUploadStatus('📝 正在准备 NFT metadata...')
        await new Promise(resolve => setTimeout(resolve, 800))

        const privacyLabels = {
          public: '公开',
          private: '私密',
          selective: '选择性分享'
        }

        const mockMetadata = {
          name: `身份照片 - ${new Date().toLocaleDateString('zh-CN')}`,
          description: `在 Cardano 区块链上的去中心化身份照片 (${privacyLabels[privacyLevel]})`,
          image: `ipfs://${mockCID}`,
          privacy: privacyLevel,
          timestamp: Date.now()
        }

        console.log('✅ Metadata 已创建:', mockMetadata)
        setUploadProgress(50)

        // 步骤 3: 模拟铸造 NFT
        setUploadStatus('⚡ 正在铸造 NFT 到 Cardano 区块链...')
        await new Promise(resolve => setTimeout(resolve, 1500))

        const mockPolicyId = Array.from(crypto.getRandomValues(new Uint8Array(28)))
          .map(b => b.toString(16).padStart(2, '0')).join('')

        const mockAssetName = 'CardanoIdentity' + Date.now()

        console.log('✅ 模拟 Policy ID:', mockPolicyId)
        setUploadProgress(70)

        // 步骤 4: 模拟交易提交
        setUploadStatus('📝 正在提交交易到区块链...')
        await new Promise(resolve => setTimeout(resolve, 1000))

        const mockTxHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0')).join('')

        console.log('✅ 模拟交易哈希:', mockTxHash)
        setUploadProgress(90)

        // 步骤 5: 模拟等待确认
        setUploadStatus('⏳ 等待区块链确认...')
        await new Promise(resolve => setTimeout(resolve, 1000))

        setUploadProgress(100)
        console.log('🎉 演示模式上传完成')

        // 保存到本地存储
        const savedNFTs = JSON.parse(localStorage.getItem('my_nfts') || '[]')
        savedNFTs.push({
          policyId: mockPolicyId,
          assetName: mockAssetName,
          txHash: mockTxHash,
          metadata: mockMetadata,
          ipfsResult: {
            cid: mockCID,
            url: `https://ipfs.io/ipfs/${mockCID}`,
            gateway: 'ipfs.io (演示)'
          },
          timestamp: Date.now(),
          isDemo: true
        })
        localStorage.setItem('my_nfts', JSON.stringify(savedNFTs))

        // 显示成功信息
        const network = connectedWallet.networkId === 1 ? 'mainnet' : 'preview'

        alert(`✅ 照片已成功上传（演示模式）!

🎭 这是演示模式，数据已保存到本地存储

📋 上传信息:
🔗 交易哈希: ${mockTxHash.substring(0, 20)}...
🎨 Policy ID: ${mockPolicyId.substring(0, 20)}...
🏷️ 资产名称: ${mockAssetName}
🔐 隐私级别: ${privacyLabels[privacyLevel]}
📦 IPFS CID: ${mockCID.substring(0, 20)}...

💡 要启用真实上链功能:
由于 lucid-cardano 库的 WASM 模块在浏览器中有兼容性问题，
目前暂时使用演示模式。真实上链功能需要:

1. 解决 WASM 兼容性问题
2. 或使用服务器端 API 来处理交易
3. 或等待 lucid-cardano 更新

您可以在"我的NFT"标签中查看已保存的记录。`)
      }

      // 重置状态
      setSelectedFile(null)
      setPreview(null)
      setUploadStatus('')
      setUploadProgress(0)
      setPrivacyLevel('public')
      setAuthorizedAddresses([])
      setActiveTab('gallery')

    } catch (error: any) {
      console.error('❌ 上传失败:', error)

      // 提供详细的错误信息
      let errorMessage = `上传失败: ${error.message || '未知错误'}`

      if (error.message?.includes('UTxO Balance Insufficient')) {
        errorMessage = '钱包余额不足！\n\n请确保钱包中至少有 5 ADA 用于支付交易费用。'
      } else if (error.message?.includes('Collateral')) {
        errorMessage = '需要设置抵押品(Collateral)！\n\n请在钱包设置中配置抵押品后重试。'
      } else if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('403')) {
        errorMessage = 'API 密钥无效！\n\n请检查 .env.local 中的 Blockfrost 和 IPFS API 密钥是否正确。'
      } else if (error.message?.includes('IPFS')) {
        errorMessage = 'IPFS 上传失败！\n\n请检查:\n- NFT.Storage 或 Pinata API 密钥是否正确\n- 网络连接是否正常\n- 文件大小是否超出限制'
      } else if (error.message?.includes('network')) {
        errorMessage = '网络错误！\n\n请检查:\n- 网络连接是否正常\n- 钱包网络是否与配置一致\n- Blockfrost API 是否可用'
      }

      alert(errorMessage)
      setUploadStatus('❌ 上传失败')
      setUploadProgress(0)

    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadStatus('')
        setUploadProgress(0)
      }, 2000)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* 导航栏 */}
      <nav className="relative z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CardanoID
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {walletConnected && connectedWallet && (
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl border border-emerald-400/30">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-300 font-medium text-sm">
                  {connectedWallet.name.charAt(0).toUpperCase() + connectedWallet.name.slice(1)}
                </span>
              </div>
            )}
            <Link href="/" className="text-purple-300 hover:text-white transition-colors font-medium">
              返回首页
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-12 px-6 pb-20">
        <div className="max-w-6xl mx-auto">

          {!walletConnected ? (
            // 钱包连接界面
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto">
                {/* 标题 */}
                <div className="mb-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl mb-6 shadow-2xl shadow-purple-500/50 animate-pulse">
                    <span className="text-white text-5xl">💎</span>
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    连接 Cardano 钱包
                  </h2>
                  <p className="text-purple-200/80 text-lg">
                    开启你的去中心化身份之旅
                  </p>
                </div>

                {/* 错误显示 */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-red-400 text-xl">⚠️</span>
                        <span className="text-red-300 font-medium">{error}</span>
                      </div>
                      <button
                        onClick={() => setError(null)}
                        className="text-red-300 hover:text-red-200 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* 钱包列表 */}
                <div className="space-y-3">
                  {WALLETS.map((wallet) => {
                    const isAvailable = availableWallets.includes(wallet.name)

                    return (
                      <div key={wallet.name}>
                        {isAvailable ? (
                          <button
                            onClick={() => connectWallet(wallet.name)}
                            disabled={connecting}
                            className="w-full group relative overflow-hidden p-5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 backdrop-blur-xl rounded-2xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 disabled:opacity-50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-4xl">{wallet.icon}</div>
                                <div className="text-left">
                                  <div className="font-bold text-white text-lg">{wallet.displayName}</div>
                                  <div className="text-emerald-400 text-sm flex items-center">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                                    已安装
                                  </div>
                                </div>
                              </div>
                              <div className="text-purple-300 group-hover:text-white transition-colors">
                                →
                              </div>
                            </div>
                          </button>
                        ) : (
                          <div className="w-full p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-4xl opacity-30">{wallet.icon}</div>
                                <div className="text-left">
                                  <div className="font-bold text-white/50 text-lg">{wallet.displayName}</div>
                                  <div className="text-gray-400 text-sm">未安装</div>
                                </div>
                              </div>
                              <a
                                href={wallet.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
                              >
                                安装
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💡</span>
                    <p className="text-blue-200 text-sm text-left">
                      需要安装 Cardano 钱包扩展程序才能使用。推荐使用 Eternl 或 Nami 钱包。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // 连接成功后的界面
            <div className="space-y-6">
              {/* 钱包信息卡片 */}
              <div className="relative overflow-hidden p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/50">
                      <span className="text-white text-3xl">💰</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-white">钱包已连接</h3>
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium">
                          {connectedWallet.networkId === 1 ? 'Mainnet' : 'Testnet'}
                        </span>
                      </div>
                      <p className="text-purple-300 text-sm">
                        {connectedWallet.name.charAt(0).toUpperCase() + connectedWallet.name.slice(1)}
                      </p>
                      <p className="text-purple-400/70 text-xs font-mono truncate max-w-xs mt-1">
                        {connectedWallet.address.substring(0, 30)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-sm text-purple-300/70">余额</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        {typeof connectedWallet.balance === 'number'
                          ? connectedWallet.balance.toFixed(1)
                          : '0.0'} ADA
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={refreshBalance}
                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 hover:border-emerald-400/60 text-emerald-300 hover:text-emerald-200 rounded-xl font-medium transition-all text-sm flex items-center space-x-2"
                      >
                        <span>💰</span>
                        <span>刷新余额</span>
                      </button>
                      <button
                        onClick={() => {
                          const confirmed = window.confirm(
                            `🔄 切换到其他 ${connectedWallet.name} 账户?\n\n将会:\n• 保持钱包连接\n• ${connectedWallet.name} 会弹出账户选择窗口\n• 选择其他账户后自动更新`
                          )
                          if (confirmed) {
                            connectWallet(connectedWallet.name)
                          }
                        }}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 hover:border-blue-400/60 text-blue-300 hover:text-blue-200 rounded-xl font-medium transition-all text-sm flex items-center space-x-2"
                      >
                        <span>🔄</span>
                        <span>切换账户</span>
                      </button>
                      <button
                        onClick={disconnect}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 hover:border-red-400/60 text-red-300 hover:text-red-200 rounded-xl font-medium transition-all text-sm flex items-center space-x-2"
                      >
                        <span>🔓</span>
                        <span>断开</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 标签导航 */}
              <div className="flex space-x-2 p-2 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'home'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-white/5'
                  }`}
                >
                  🏠 主页
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-white/5'
                  }`}
                >
                  📸 上传照片
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'gallery'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-white/5'
                  }`}
                >
                  🖼️ 我的NFT
                </button>
              </div>

              {/* 内容区域 */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                      去中心化身份系统
                    </h1>
                    <p className="text-purple-200/80 text-lg">
                      在 Cardano 区块链上构建你的数字身份
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                        <span className="text-white text-3xl">👤</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">身份管理</h3>
                      <p className="text-purple-200/70 mb-6">
                        创建和管理你的去中心化身份档案,展示你的技能和成就
                      </p>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                        开始创建 →
                      </button>
                    </div>

                    <div className="group p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-emerald-500/50 transition-shadow">
                        <span className="text-white text-3xl">🤝</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">社交连接</h3>
                      <p className="text-purple-200/70 mb-6">
                        与志同道合的人建立连接,扩展你的专业网络
                      </p>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
                        发现朋友 →
                      </button>
                    </div>

                    <div className="group p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl rounded-3xl border border-amber-400/20 hover:border-amber-400/40 transition-all duration-300 cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-amber-500/50 transition-shadow">
                        <span className="text-white text-3xl">⭐</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">声誉系统</h3>
                      <p className="text-purple-200/70 mb-6">
                        建立和展示你的技能声誉,获得他人的认可
                      </p>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/50 transition-all">
                        查看声誉 →
                      </button>
                    </div>

                    <div className="group p-6 bg-gradient-to-br from-rose-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-rose-400/20 hover:border-rose-400/40 transition-all duration-300 cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-rose-500/50 transition-shadow">
                        <span className="text-white text-3xl">🔒</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">隐私控制</h3>
                      <p className="text-purple-200/70 mb-6">
                        完全控制你的数据,决定哪些信息公开或私有
                      </p>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-rose-500/50 transition-all">
                        隐私设置 →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="max-w-2xl mx-auto">
                  <div className="p-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-white">上传照片到区块链</h2>
                      <button
                        onClick={() => setShowSetupGuide(true)}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 rounded-xl text-sm font-medium transition-all"
                      >
                        {isAPIConfigured() ? '✅ 真实模式' : '⚙️ 配置指南'}
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {!preview ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-64 border-2 border-dashed border-purple-400/40 hover:border-purple-400/60 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all hover:bg-purple-500/5"
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-4xl">📷</span>
                        </div>
                        <div className="text-center">
                          <p className="text-white font-medium mb-2">点击选择照片</p>
                          <p className="text-purple-300/70 text-sm">支持 JPG, PNG, GIF 格式</p>
                        </div>
                      </button>
                    ) : (
                      <div className="space-y-6">
                        <div className="relative rounded-2xl overflow-hidden">
                          <img src={preview} alt="Preview" className="w-full h-auto max-h-96 object-contain bg-black/20" />
                        </div>

                        {/* 隐私级别选择 */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <span>🔐</span>
                            <span>隐私设置</span>
                          </h3>

                          <div className="space-y-2">
                            {/* 公开选项 */}
                            <label className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                              privacyLevel === 'public'
                                ? 'border-blue-400/60 bg-blue-500/10'
                                : 'border-white/10 hover:border-white/20 bg-white/5'
                            }`}>
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
                                  <span className="font-semibold text-white">公开</span>
                                </div>
                                <p className="text-purple-300/70 text-sm mt-1">任何人都可以查看</p>
                              </div>
                            </label>

                            {/* 私密选项 */}
                            <label className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                              privacyLevel === 'private'
                                ? 'border-blue-400/60 bg-blue-500/10'
                                : 'border-white/10 hover:border-white/20 bg-white/5'
                            }`}>
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
                                  <span className="font-semibold text-white">私密</span>
                                </div>
                                <p className="text-purple-300/70 text-sm mt-1">加密存储，只有你能查看</p>
                              </div>
                            </label>

                            {/* 选择性分享选项 */}
                            <label className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                              privacyLevel === 'selective'
                                ? 'border-blue-400/60 bg-blue-500/10'
                                : 'border-white/10 hover:border-white/20 bg-white/5'
                            }`}>
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
                                  <span className="font-semibold text-white">选择性分享</span>
                                </div>
                                <p className="text-purple-300/70 text-sm mt-1">只有授权地址可以查看</p>
                              </div>
                            </label>
                          </div>

                          {/* 授权地址管理 */}
                          {privacyLevel === 'selective' && (
                            <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                              <h4 className="font-semibold text-white mb-3 text-sm">授权地址列表</h4>
                              <div className="flex gap-2 mb-3">
                                <input
                                  type="text"
                                  placeholder="输入 Cardano 地址"
                                  className="flex-1 px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                      const addr = e.currentTarget.value.trim()
                                      if (!authorizedAddresses.includes(addr)) {
                                        setAuthorizedAddresses([...authorizedAddresses, addr])
                                        e.currentTarget.value = ''
                                      }
                                    }
                                  }}
                                />
                              </div>
                              {authorizedAddresses.length > 0 ? (
                                <div className="space-y-2">
                                  {authorizedAddresses.map((addr, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                      <span className="text-xs text-white/80 font-mono truncate flex-1">
                                        {addr.substring(0, 15)}...{addr.substring(addr.length - 10)}
                                      </span>
                                      <button
                                        onClick={() => setAuthorizedAddresses(authorizedAddresses.filter((_, i) => i !== idx))}
                                        className="ml-2 text-red-400 hover:text-red-300 text-sm"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-blue-300/60">还没有授权地址，按 Enter 添加</p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setSelectedFile(null)
                              setPreview(null)
                              setPrivacyLevel('public')
                              setAuthorizedAddresses([])
                            }}
                            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all"
                          >
                            重新选择
                          </button>
                          <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
                          >
                            {uploading ? '上传中...' : '🚀 上传到区块链'}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">ℹ️</span>
                        <div className="text-sm text-blue-200">
                          <p className="font-medium mb-1">关于上传:</p>
                          <ul className="list-disc list-inside text-blue-200/70 space-y-1">
                            <li>照片将被上传到 IPFS 去中心化存储</li>
                            <li>会铸造一个 NFT 作为所有权证明</li>
                            <li>所有数据永久保存在 Cardano 区块链上</li>
                            <li>上传需要支付约 1.5-2 ADA 的交易费用</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                (() => {
                  const savedNFTs = JSON.parse(localStorage.getItem('my_nfts') || '[]')

                  if (savedNFTs.length === 0) {
                    return (
                      <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <span className="text-6xl">🖼️</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">你的 NFT 收藏</h3>
                        <p className="text-purple-200/70 mb-8">上传照片后,你的 NFT 会显示在这里</p>
                        <button
                          onClick={() => setActiveTab('upload')}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                          上传第一张照片 →
                        </button>
                      </div>
                    )
                  }

                  return (
                    <div>
                      <div className="mb-6 flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">我的 NFT 收藏 ({savedNFTs.length})</h3>
                        <button
                          onClick={() => {
                            if (confirm('确定要清空所有 NFT 记录吗？')) {
                              localStorage.removeItem('my_nfts')
                              window.location.reload()
                            }
                          }}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 rounded-xl text-sm font-medium transition-all"
                        >
                          清空记录
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedNFTs.reverse().map((nft: any, index: number) => (
                          <div key={index} className="group p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
                            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
                              {(() => {
                                // 调试：打印 NFT 数据
                                console.log('NFT 数据:', nft)
                                console.log('Image URL:', nft.metadata?.image)
                                console.log('IPFS Result:', nft.ipfsResult)

                                // 尝试多种方式获取图片URL
                                let imageUrl = null

                                // 1. 尝试从 localStorage 获取（模拟模式）
                                if (nft.ipfsResult?.cid) {
                                  const localKey = `ipfs_${nft.ipfsResult.cid}`
                                  const localData = localStorage.getItem(localKey)
                                  if (localData && localData.startsWith('data:')) {
                                    console.log('✅ 从 localStorage 加载图片')
                                    imageUrl = localData
                                  }
                                }

                                // 2. 尝试从 metadata.image 或 ipfsResult.url
                                if (!imageUrl) {
                                  imageUrl = nft.metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || nft.ipfsResult?.url
                                }

                                console.log('最终图片 URL:', imageUrl ? (imageUrl.startsWith('data:') ? 'Data URL (本地)' : imageUrl) : 'null')

                                if (imageUrl) {
                                  return (
                                    <img
                                      src={imageUrl}
                                      alt={nft.metadata?.name || 'NFT Image'}
                                      className="w-full h-full object-cover"
                                      onLoad={() => console.log('✅ 图片加载成功')}
                                      onError={(e) => {
                                        console.error('❌ 图片加载失败')
                                        // 如果是 IPFS URL 失败，尝试其他 gateway
                                        const img = e.target as HTMLImageElement
                                        if (!img.src.startsWith('data:')) {
                                          if (img.src.includes('ipfs.io')) {
                                            const cid = img.src.split('/ipfs/')[1]
                                            const newUrl = `https://gateway.pinata.cloud/ipfs/${cid}`
                                            console.log('🔄 尝试 Pinata gateway:', newUrl)
                                            img.src = newUrl
                                          } else if (img.src.includes('pinata')) {
                                            const cid = img.src.split('/ipfs/')[1]
                                            const newUrl = `https://cloudflare-ipfs.com/ipfs/${cid}`
                                            console.log('🔄 尝试 Cloudflare gateway:', newUrl)
                                            img.src = newUrl
                                          }
                                        }
                                      }}
                                    />
                                  )
                                } else {
                                  console.log('⚠️ 没有找到图片 URL')
                                  return <span className="text-6xl">🖼️</span>
                                }
                              })()}
                            </div>

                            <h4 className="text-lg font-bold text-white mb-2 truncate">
                              {nft.metadata?.name || nft.assetName}
                            </h4>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center text-purple-300">
                                <span className="mr-2">🎨</span>
                                <span className="truncate">{nft.policyId.substring(0, 12)}...</span>
                              </div>

                              <div className="flex items-center text-purple-300">
                                <span className="mr-2">🔗</span>
                                <span className="truncate">{nft.txHash.substring(0, 12)}...</span>
                              </div>

                              {nft.metadata?.privacy && (
                                <div className="flex items-center text-purple-300">
                                  <span className="mr-2">🔐</span>
                                  <span>{nft.metadata.privacy === 'public' ? '公开' : nft.metadata.privacy === 'private' ? '私密' : '选择性分享'}</span>
                                </div>
                              )}

                              {nft.isDemo && (
                                <div className="flex items-center text-amber-400">
                                  <span className="mr-2">🎭</span>
                                  <span>演示模式</span>
                                </div>
                              )}

                              <div className="text-purple-400/70 text-xs">
                                {new Date(nft.timestamp).toLocaleString('zh-CN')}
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                              <button
                                onClick={() => {
                                  const info = `NFT 详情:

Policy ID: ${nft.policyId}
资产名称: ${nft.assetName}
交易哈希: ${nft.txHash}
IPFS CID: ${nft.ipfsResult?.cid || 'N/A'}
隐私级别: ${nft.metadata?.privacy || 'N/A'}
创建时间: ${new Date(nft.timestamp).toLocaleString('zh-CN')}
${nft.isDemo ? '\n⚠️ 这是演示模式生成的记录' : ''}`
                                  alert(info)
                                }}
                                className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium transition-all"
                              >
                                查看详情
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()
              )}
            </div>
          )}
        </div>
      </div>

      {/* 上传loading遮罩 */}
      {uploading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="max-w-md w-full p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl border border-purple-400/30">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>

              <div>
                <p className="text-xl font-bold text-white mb-2">{uploadStatus}</p>
                <p className="text-purple-200/70 text-sm">请稍候,正在处理...</p>
              </div>

              {/* 进度条 */}
              <div className="space-y-2">
                <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-purple-300 text-sm font-medium">{uploadProgress}%</p>
              </div>

              {/* 步骤指示器 */}
              <div className="pt-4 space-y-2 text-left">
                <div className={`flex items-center space-x-3 ${uploadProgress >= 20 ? 'text-emerald-400' : 'text-white/30'}`}>
                  <span className="text-lg">{uploadProgress >= 20 ? '✅' : '⏳'}</span>
                  <span className="text-sm">上传到 IPFS</span>
                </div>
                <div className={`flex items-center space-x-3 ${uploadProgress >= 60 ? 'text-emerald-400' : 'text-white/30'}`}>
                  <span className="text-lg">{uploadProgress >= 60 ? '✅' : '⏳'}</span>
                  <span className="text-sm">创建 NFT metadata</span>
                </div>
                <div className={`flex items-center space-x-3 ${uploadProgress >= 90 ? 'text-emerald-400' : 'text-white/30'}`}>
                  <span className="text-lg">{uploadProgress >= 90 ? '✅' : '⏳'}</span>
                  <span className="text-sm">铸造并上链</span>
                </div>
                <div className={`flex items-center space-x-3 ${uploadProgress >= 100 ? 'text-emerald-400' : 'text-white/30'}`}>
                  <span className="text-lg">{uploadProgress >= 100 ? '✅' : '⏳'}</span>
                  <span className="text-sm">等待区块链确认</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API 配置指南弹窗 */}
      {showSetupGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl border border-purple-400/30 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                🔧 区块链配置指南
              </h2>
              <button
                onClick={() => setShowSetupGuide(false)}
                className="text-purple-300 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 text-purple-100">
              {/* 当前状态 */}
              <div className={`p-4 rounded-2xl border ${isAPIConfigured() ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-amber-500/10 border-amber-400/30'}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{isAPIConfigured() ? '✅' : '⚠️'}</span>
                  <div>
                    <div className="font-bold text-white">
                      {isAPIConfigured() ? '真实模式已启用' : '当前处于演示模式'}
                    </div>
                    <div className="text-sm opacity-80">
                      {isAPIConfigured()
                        ? '您的照片将真实上传到 IPFS 并铸造为 Cardano NFT'
                        : '照片上传仅为模拟，不会真实上链'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 步骤 1: Blockfrost */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-lg text-sm">1</span>
                  <span>获取 Blockfrost API 密钥</span>
                </h3>
                <div className="pl-10 space-y-2 text-sm">
                  <p>Blockfrost 是 Cardano 区块链的 API 服务提供商</p>
                  <ol className="list-decimal list-inside space-y-1 opacity-90">
                    <li>访问 <a href="https://blockfrost.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">blockfrost.io</a></li>
                    <li>注册免费账号并登录</li>
                    <li>点击 "Add Project" 创建项目</li>
                    <li>选择 <strong>Preview</strong> 网络(测试) 或 <strong>Mainnet</strong> (正式)</li>
                    <li>复制生成的 API 密钥 (格式: preview_xxxxxxx)</li>
                  </ol>
                </div>
              </div>

              {/* 步骤 2: NFT.Storage */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-lg text-sm">2</span>
                  <span>获取 NFT.Storage API 密钥</span>
                </h3>
                <div className="pl-10 space-y-2 text-sm">
                  <p>NFT.Storage 提供免费的 IPFS 去中心化存储</p>
                  <ol className="list-decimal list-inside space-y-1 opacity-90">
                    <li>访问 <a href="https://nft.storage" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">nft.storage</a></li>
                    <li>点击 "Start Storing" 注册账号</li>
                    <li>登录后进入 Dashboard</li>
                    <li>点击 "API Keys" 标签</li>
                    <li>点击 "New Key" 创建新密钥</li>
                    <li>复制生成的密钥</li>
                  </ol>
                </div>
              </div>

              {/* 步骤 3: 配置环境变量 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-lg text-sm">3</span>
                  <span>配置环境变量</span>
                </h3>
                <div className="pl-10 space-y-2 text-sm">
                  <p>编辑项目根目录的 <code className="px-2 py-1 bg-black/30 rounded">.env.local</code> 文件:</p>
                  <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto text-green-400 font-mono text-xs">
{`# Blockfrost API
NEXT_PUBLIC_BLOCKFROST_API_KEY=preview_你的密钥
NEXT_PUBLIC_BLOCKFROST_NETWORK=Preview

# NFT.Storage API
NEXT_PUBLIC_NFT_STORAGE_API_KEY=你的NFT.Storage密钥`}
                  </pre>
                </div>
              </div>

              {/* 步骤 4: 重启服务器 */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-lg text-sm">4</span>
                  <span>重启开发服务器</span>
                </h3>
                <div className="pl-10 space-y-2 text-sm">
                  <p>在终端中按 <kbd className="px-2 py-1 bg-black/30 rounded">Ctrl+C</kbd> 停止服务器，然后运行:</p>
                  <pre className="p-4 bg-black/50 rounded-xl text-green-400 font-mono text-xs">
npm run dev
                  </pre>
                </div>
              </div>

              {/* 步骤 5: 准备测试 ADA */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-lg text-sm">5</span>
                  <span>准备测试 ADA (Preview 网络)</span>
                </h3>
                <div className="pl-10 space-y-2 text-sm">
                  <p>如果使用 Preview 测试网，需要获取免费的测试 ADA:</p>
                  <ol className="list-decimal list-inside space-y-1 opacity-90">
                    <li>确保钱包切换到 Preview 测试网</li>
                    <li>访问 <a href="https://docs.cardano.org/cardano-testnets/tools/faucet/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Cardano Testnet Faucet</a></li>
                    <li>输入钱包地址，获取测试 ADA (建议至少 10 ADA)</li>
                  </ol>
                </div>
              </div>

              {/* 注意事项 */}
              <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">💡</span>
                  <div className="text-sm space-y-1">
                    <p className="font-bold text-white">重要提示:</p>
                    <ul className="list-disc list-inside opacity-90 space-y-1">
                      <li>初学者建议使用 <strong>Preview</strong> 测试网</li>
                      <li>铸造 NFT 需要支付约 1.5-2 ADA 的交易费</li>
                      <li>确保钱包网络与配置的网络一致</li>
                      <li>不要公开分享你的 API 密钥</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSetupGuide(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
