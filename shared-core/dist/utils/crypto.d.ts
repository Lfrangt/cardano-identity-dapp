/**
 * 加密和解密工具函数
 * 使用 Web Crypto API 实现 AES-256-GCM 加密
 */
/**
 * 加密文件
 * @param file 要加密的文件
 * @param password 加密密码
 * @returns 加密后的数据和元数据
 */
export declare function encryptFile(file: File, password: string): Promise<{
    encryptedData: ArrayBuffer;
    salt: Uint8Array;
    iv: Uint8Array;
    metadata: {
        fileName: string;
        fileType: string;
        fileSize: number;
    };
}>;
/**
 * 解密文件
 * @param encryptedData 加密的数据
 * @param password 解密密码
 * @param salt 盐值
 * @param iv 初始化向量
 * @returns 解密后的数据
 */
export declare function decryptFile(encryptedData: ArrayBuffer, password: string, salt: Uint8Array, iv: Uint8Array): Promise<ArrayBuffer>;
/**
 * 将加密数据打包成单个 Blob
 */
export declare function packageEncryptedFile(encryptedData: ArrayBuffer, salt: Uint8Array, iv: Uint8Array, metadata: any): Blob;
/**
 * 解包加密文件
 */
export declare function unpackageEncryptedFile(blob: Blob): Promise<{
    encryptedData: ArrayBuffer;
    salt: Uint8Array;
    iv: Uint8Array;
    metadata: any;
}>;
/**
 * 从钱包地址生成加密密码
 * 这样用户不需要记住额外的密码
 */
export declare function generatePasswordFromWallet(walletAddress: string): Promise<string>;
/**
 * 计算文件哈希
 */
export declare function calculateFileHash(file: File): Promise<string>;
