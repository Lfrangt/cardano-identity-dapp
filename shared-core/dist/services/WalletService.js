"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = exports.WalletService = void 0;
const lucid_cardano_1 = require("lucid-cardano");
const wallet_1 = require("../types/wallet");
class WalletService {
    constructor() {
        this.lucid = null;
        this.connectedWallet = null;
        this.network = 'Preview'; // 使用预览网络进行开发
        // 延迟初始化，避免服务器端错误
        if (typeof window !== 'undefined') {
            this.initialize();
        }
    }
    /**
     * 初始化Lucid实例
     */
    async initialize() {
        try {
            // 只在需要时初始化 Lucid
            if (typeof window !== 'undefined') {
                this.lucid = await lucid_cardano_1.Lucid.new(new lucid_cardano_1.Blockfrost('https://cardano-preview.blockfrost.io/api/v0', process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || 'preview_test_key'), this.network);
            }
        }
        catch (error) {
            console.error('Failed to initialize Lucid:', error);
        }
    }
    /**
     * 检测已安装的钱包
     */
    detectWallets() {
        const cardanoWindow = window;
        const availableWallets = [];
        if (cardanoWindow.cardano) {
            wallet_1.SUPPORTED_WALLETS.forEach(wallet => {
                if (cardanoWindow.cardano[wallet.name]) {
                    availableWallets.push(wallet.name);
                }
            });
        }
        return availableWallets;
    }
    /**
     * 检查特定钱包是否已安装
     */
    isWalletInstalled(walletName) {
        const cardanoWindow = window;
        return !!(cardanoWindow.cardano && cardanoWindow.cardano[walletName]);
    }
    /**
     * 连接钱包
     */
    async connectWallet(walletName) {
        try {
            if (!this.isWalletInstalled(walletName)) {
                throw this.createError(wallet_1.WalletErrorCodes.NOT_INSTALLED, `${walletName} wallet is not installed`);
            }
            const cardanoWindow = window;
            const walletAPI = cardanoWindow.cardano[walletName];
            // 启用钱包
            const api = await walletAPI.enable();
            this.connectedWallet = api;
            // 设置Lucid钱包
            if (!this.lucid) {
                await this.initialize();
            }
            if (this.lucid) {
                this.lucid.selectWallet(api);
            }
            // 获取地址和余额
            const address = await this.getAddress();
            const balance = await this.getBalance();
            const networkId = await api.getNetworkId();
            // 验证网络
            const expectedNetworkId = this.network === 'Mainnet' ? 1 : 0;
            if (networkId !== expectedNetworkId) {
                throw this.createError(wallet_1.WalletErrorCodes.NETWORK_MISMATCH, `Wallet is on wrong network. Expected: ${this.network}`);
            }
            const connection = {
                address,
                balance,
                network: this.network.toLowerCase(),
                walletName,
                isConnected: true
            };
            // 保存到本地存储
            this.saveConnection(connection);
            return connection;
        }
        catch (error) {
            console.error('Wallet connection failed:', error);
            if (error.code === 4) {
                throw this.createError(wallet_1.WalletErrorCodes.USER_REJECTED, 'User rejected the connection request');
            }
            if (error instanceof Error && error.message.includes('not installed')) {
                throw this.createError(wallet_1.WalletErrorCodes.NOT_INSTALLED, `${walletName} wallet is not installed`);
            }
            throw this.createError(wallet_1.WalletErrorCodes.CONNECTION_FAILED, error.message || 'Failed to connect wallet');
        }
    }
    /**
     * 断开钱包连接
     */
    async disconnectWallet() {
        this.connectedWallet = null;
        if (this.lucid) {
            this.lucid.selectWallet(null);
        }
        // 清除本地存储
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cardano_wallet_connection');
        }
    }
    /**
     * 获取当前地址
     */
    async getAddress() {
        if (!this.lucid) {
            throw this.createError(wallet_1.WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized');
        }
        try {
            return await this.lucid.wallet.address();
        }
        catch (error) {
            throw this.createError(wallet_1.WalletErrorCodes.INVALID_ADDRESS, 'Failed to get wallet address');
        }
    }
    /**
     * 获取余额（以ADA为单位）
     */
    async getBalance() {
        if (!this.lucid) {
            throw this.createError(wallet_1.WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized');
        }
        try {
            const utxos = await this.lucid.wallet.getUtxos();
            let totalLovelace = 0n;
            utxos.forEach(utxo => {
                totalLovelace += utxo.assets.lovelace || 0n;
            });
            // 转换为ADA (1 ADA = 1,000,000 Lovelace)
            return Number(totalLovelace) / 1000000;
        }
        catch (error) {
            console.error('Failed to get balance:', error);
            return 0;
        }
    }
    /**
     * 获取UTXOs
     */
    async getUtxos() {
        if (!this.lucid) {
            throw this.createError(wallet_1.WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized');
        }
        return await this.lucid.wallet.getUtxos();
    }
    /**
     * 签名交易
     */
    async signTransaction(tx) {
        if (!this.lucid) {
            throw this.createError(wallet_1.WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized');
        }
        try {
            const signedTx = await tx.sign().complete();
            return signedTx;
        }
        catch (error) {
            if (error.code === 4) {
                throw this.createError(wallet_1.WalletErrorCodes.USER_REJECTED, 'User rejected transaction signing');
            }
            throw this.createError(wallet_1.WalletErrorCodes.TRANSACTION_FAILED, error.message || 'Failed to sign transaction');
        }
    }
    /**
     * 提交交易
     */
    async submitTransaction(signedTx) {
        if (!this.lucid) {
            throw this.createError(wallet_1.WalletErrorCodes.CONNECTION_FAILED, 'Lucid not initialized');
        }
        try {
            const txHash = await signedTx.submit();
            return txHash;
        }
        catch (error) {
            throw this.createError(wallet_1.WalletErrorCodes.TRANSACTION_FAILED, error.message || 'Failed to submit transaction');
        }
    }
    /**
     * 恢复之前的连接
     */
    async restoreConnection() {
        if (typeof window === 'undefined')
            return null;
        try {
            const savedConnection = localStorage.getItem('cardano_wallet_connection');
            if (!savedConnection)
                return null;
            const connection = JSON.parse(savedConnection);
            // 验证钱包仍然可用
            if (!this.isWalletInstalled(connection.walletName)) {
                this.clearSavedConnection();
                return null;
            }
            // 尝试重新连接
            const cardanoWindow = window;
            const walletAPI = cardanoWindow.cardano[connection.walletName];
            const isEnabled = await walletAPI.isEnabled();
            if (isEnabled) {
                const api = await walletAPI.enable();
                this.connectedWallet = api;
                if (!this.lucid) {
                    await this.initialize();
                }
                if (this.lucid) {
                    this.lucid.selectWallet(api);
                }
                // 更新余额
                const currentBalance = await this.getBalance();
                const updatedConnection = { ...connection, balance: currentBalance };
                this.saveConnection(updatedConnection);
                return updatedConnection;
            }
            return null;
        }
        catch (error) {
            console.error('Failed to restore wallet connection:', error);
            this.clearSavedConnection();
            return null;
        }
    }
    /**
     * 获取Lucid实例
     */
    getLucid() {
        return this.lucid;
    }
    /**
     * 获取当前连接的钱包API
     */
    getConnectedWallet() {
        return this.connectedWallet;
    }
    /**
     * 保存连接信息到本地存储
     */
    saveConnection(connection) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cardano_wallet_connection', JSON.stringify(connection));
        }
    }
    /**
     * 清除保存的连接信息
     */
    clearSavedConnection() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cardano_wallet_connection');
        }
    }
    /**
     * 创建标准化错误
     */
    createError(code, message, info) {
        return {
            code,
            message,
            info
        };
    }
}
exports.WalletService = WalletService;
// 导出单例实例
exports.walletService = new WalletService();
