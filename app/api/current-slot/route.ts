import { NextResponse } from 'next/server'

/**
 * API 路由：获取当前 Cardano slot
 * GET /api/current-slot
 */
export async function GET() {
  try {
    const blockfrostKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY
    const networkId = process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK === 'Mainnet' ? 1 : 0
    const blockfrostUrl = networkId === 1
      ? 'https://cardano-mainnet.blockfrost.io/api/v0'
      : 'https://cardano-preview.blockfrost.io/api/v0'

    if (!blockfrostKey) {
      return NextResponse.json(
        { error: 'Blockfrost API key not configured' },
        { status: 500 }
      )
    }

    // 获取最新区块信息
    const response = await fetch(`${blockfrostUrl}/blocks/latest`, {
      headers: { 'project_id': blockfrostKey }
    })

    if (!response.ok) {
      throw new Error(`Blockfrost API error: ${response.status}`)
    }

    const latestBlock = await response.json()

    return NextResponse.json({
      slot: latestBlock.slot,
      time: latestBlock.time,
      height: latestBlock.height,
      epoch: latestBlock.epoch
    })

  } catch (error: any) {
    console.error('❌ 获取当前 slot 失败:', error)
    return NextResponse.json(
      { error: error.message || '服务器错误' },
      { status: 500 }
    )
  }
}
