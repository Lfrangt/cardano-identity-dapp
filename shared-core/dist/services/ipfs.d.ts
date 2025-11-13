/**
 * IPFS 存储服务
 * 使用 Pinata 或 NFT.Storage 等公共 IPFS 服务
 */
export interface IPFSUploadResult {
    cid: string;
    url: string;
    gateway: string;
}
/**
 * 上传文件到 IPFS (使用 NFT.Storage)
 */
export declare function uploadToIPFS(file: Blob, fileName?: string): Promise<IPFSUploadResult>;
/**
 * 从 IPFS 获取文件
 */
export declare function getFromIPFS(cid: string): Promise<Blob>;
/**
 * 检查 IPFS 内容是否存在
 */
export declare function checkIPFSExists(cid: string): Promise<boolean>;
/**
 * 获取 IPFS 配置指南
 */
export declare function getIPFSSetupGuide(): string;
