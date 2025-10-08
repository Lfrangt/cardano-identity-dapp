import { NextRequest, NextResponse } from 'next/server'

/**
 * API 路由：准备 NFT 铸造数据
 * POST /api/mint-nft
 *
 * 注意：由于 lucid-cardano WASM 在 Next.js API 路由中也有兼容性问题，
 * 这个路由只负责准备 metadata，实际的策略创建和交易构建在客户端完成
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metadata, walletAddress } = body

    console.log('🚀 服务器端准备 NFT 数据...')
    console.log('钱包地址:', walletAddress)

    // 验证参数
    if (!metadata || !walletAddress) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 获取环境变量
    const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY
    const network = process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK || 'Preview'

    if (!blockfrostKey || blockfrostKey === 'preview_test_key') {
      return NextResponse.json(
        { error: 'Blockfrost API 密钥未配置' },
        { status: 500 }
      )
    }

    // 生成资产名称
    const assetName = 'CardanoIdentity' + Date.now()
    const assetNameHex = Buffer.from(assetName, 'utf8').toString('hex')

    // 创建时间锁定（24小时后过期）
    const lockTime = Date.now() + 24 * 60 * 60 * 1000

    console.log('✅ NFT 数据准备成功')
    console.log('Asset Name:', assetName)
    console.log('Lock Time:', new Date(lockTime).toISOString())

    // 返回准备好的数据，让客户端完成策略创建和交易构建
    return NextResponse.json({
      success: true,
      message: 'NFT 数据准备成功，将在客户端完成铸造',
      data: {
        assetName,
        assetNameHex,
        metadata,
        lockTime,
        walletAddress,
        network
      }
    })

  } catch (error: any) {
    console.error('❌ 服务器端处理失败:', error)
    return NextResponse.json(
      {
        error: error.message || '服务器错误',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
