export interface AssetInfo {
    policyId: string;
    assetName: string;
    quantity: string;
    fingerprint?: string;
    metadata?: {
        name?: string;
        description?: string;
        ticker?: string;
        decimals?: number;
    };
}
export interface WalletBalance {
    ada: string;
    adaNumber: number;
    lovelace: string;
    assets: AssetInfo[];
    totalValue: string;
}
/**
 * 解析钱包余额
 */
export declare function parseWalletBalance(balanceHex: string): WalletBalance;
/**
 * 格式化 ADA 金额显示
 */
export declare function formatADA(amount: number): string;
/**
 * 格式化地址显示
 */
export declare function formatAddress(address: string): string;
/**
 * 获取网络名称
 */
export declare function getNetworkName(networkId: number): string;
/**
 * 获取网络状态颜色
 */
export declare function getNetworkColor(networkId: number): string;
