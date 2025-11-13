/**
 * 身份 NFT 服务
 * 用于在 Cardano 链上创建和管理身份 NFT
 */
export interface IdentityMetadata {
    name: string;
    image: string;
    description?: string;
    attributes?: {
        trait_type: string;
        value: string;
    }[];
    privacy: 'public' | 'private' | 'selective';
    encrypted?: boolean;
    authorizedAddresses?: string[];
    timestamp: number;
    version: string;
}
export interface IdentityNFT {
    policyId: string;
    assetName: string;
    metadata: IdentityMetadata;
    txHash?: string;
}
/**
 * 创建身份 NFT Metadata
 */
export declare function createIdentityMetadata(imageCID: string, privacy: 'public' | 'private' | 'selective', options?: {
    name?: string;
    description?: string;
    encrypted?: boolean;
    authorizedAddresses?: string[];
    attributes?: {
        trait_type: string;
        value: string;
    }[];
}): IdentityMetadata;
/**
 * 铸造身份 NFT（演示版本）
 * 实际生产环境需要使用 Lucid 或 Cardano SDK
 */
export declare function mintIdentityNFT(walletApi: any, metadata: IdentityMetadata): Promise<IdentityNFT>;
/**
 * 获取用户的身份 NFT
 */
export declare function getIdentityNFT(walletApi: any): Promise<IdentityNFT | null>;
/**
 * 验证访问权限
 */
export declare function checkAccess(nft: IdentityNFT, requestAddress: string): boolean;
/**
 * 获取实际铸造指南
 */
export declare function getMintingGuide(): string;
