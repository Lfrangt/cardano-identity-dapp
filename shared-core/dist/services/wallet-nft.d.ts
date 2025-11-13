/**
 * 使用纯钱包 CIP-30 API 铸造 NFT
 * 避免 lucid-cardano 的 WASM 问题
 */
import { IdentityMetadata } from './identity-nft';
/**
 * 使用钱包 API 铸造身份 NFT
 */
export declare function mintIdentityNFTWithWallet(walletApi: any, metadata: IdentityMetadata): Promise<{
    policyId: string;
    assetName: string;
    txHash: string;
    unit: string;
}>;
