export interface WalletInfo {
    name: string;
    displayName: string;
    icon: string;
    website: string;
    downloadUrl: string;
}
export interface WalletConnection {
    address: string;
    balance: number;
    network: 'mainnet' | 'testnet' | 'preview' | 'preprod';
    walletName: string;
    isConnected: boolean;
}
export interface CardanoWalletAPI {
    enable(): Promise<any>;
    isEnabled(): Promise<boolean>;
    getNetworkId(): Promise<number>;
    getUtxos(): Promise<string[]>;
    getBalance(): Promise<string>;
    getUsedAddresses(): Promise<string[]>;
    getUnusedAddresses(): Promise<string[]>;
    getChangeAddress(): Promise<string>;
    getRewardAddresses(): Promise<string[]>;
    signTx(tx: string, partialSign?: boolean): Promise<string>;
    signData(addr: string, payload: string): Promise<{
        signature: string;
        key: string;
    }>;
    submitTx(tx: string): Promise<string>;
    name: string;
    icon: string;
    apiVersion: string;
}
export interface CardanoWindow extends Window {
    cardano?: {
        [key: string]: CardanoWalletAPI;
    };
}
export interface WalletError {
    code: string;
    message: string;
    info?: any;
}
export declare enum WalletErrorCodes {
    NOT_FOUND = "WALLET_NOT_FOUND",
    NOT_INSTALLED = "WALLET_NOT_INSTALLED",
    CONNECTION_FAILED = "CONNECTION_FAILED",
    USER_REJECTED = "USER_REJECTED",
    NETWORK_MISMATCH = "NETWORK_MISMATCH",
    INVALID_ADDRESS = "INVALID_ADDRESS",
    INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
    TRANSACTION_FAILED = "TRANSACTION_FAILED"
}
export declare const SUPPORTED_WALLETS: WalletInfo[];
