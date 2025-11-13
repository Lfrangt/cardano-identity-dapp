/**
 * 真实的 Cardano NFT 铸造服务
 * 使用 Lucid-Cardano
 */
import { Lucid, MintingPolicy, PolicyId } from 'lucid-cardano';
import { IdentityMetadata } from './identity-nft';
/**
 * 初始化 Lucid 实例
 */
export declare function initLucid(walletApi: any): Promise<Lucid>;
/**
 * 创建 NFT 铸造 Policy
 */
export declare function createMintingPolicy(lucid: Lucid): Promise<{
    policyId: PolicyId;
    policy: MintingPolicy;
}>;
/**
 * 真实的铸造身份 NFT
 */
export declare function mintIdentityNFTReal(walletApi: any, metadata: IdentityMetadata): Promise<{
    policyId: string;
    assetName: string;
    txHash: string;
    unit: string;
}>;
/**
 * 查询 NFT 是否存在
 */
export declare function checkNFTExists(policyId: string, assetName: string): Promise<boolean>;
/**
 * 获取 NFT metadata
 */
export declare function getNFTMetadata(policyId: string, assetName: string): Promise<any | null>;
