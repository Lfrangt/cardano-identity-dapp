import { CardanoWalletAPI, WalletConnection } from '../types/wallet';
export declare class WalletService {
    private lucid;
    private connectedWallet;
    private network;
    constructor();
    /**
     * 初始化Lucid实例
     */
    private initialize;
    /**
     * 检测已安装的钱包
     */
    detectWallets(): string[];
    /**
     * 检查特定钱包是否已安装
     */
    isWalletInstalled(walletName: string): boolean;
    /**
     * 连接钱包
     */
    connectWallet(walletName: string): Promise<WalletConnection>;
    /**
     * 断开钱包连接
     */
    disconnectWallet(): Promise<void>;
    /**
     * 获取当前地址
     */
    getAddress(): Promise<string>;
    /**
     * 获取余额（以ADA为单位）
     */
    getBalance(): Promise<number>;
    /**
     * 获取UTXOs
     */
    getUtxos(): Promise<any>;
    /**
     * 签名交易
     */
    signTransaction(tx: any): Promise<any>;
    /**
     * 提交交易
     */
    submitTransaction(signedTx: any): Promise<string>;
    /**
     * 恢复之前的连接
     */
    restoreConnection(): Promise<WalletConnection | null>;
    /**
     * 获取Lucid实例
     */
    getLucid(): Lucid | null;
    /**
     * 获取当前连接的钱包API
     */
    getConnectedWallet(): CardanoWalletAPI | null;
    /**
     * 保存连接信息到本地存储
     */
    private saveConnection;
    /**
     * 清除保存的连接信息
     */
    private clearSavedConnection;
    /**
     * 创建标准化错误
     */
    private createError;
}
export declare const walletService: WalletService;
