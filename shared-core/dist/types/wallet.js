"use strict";
// 钱包类型定义
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_WALLETS = exports.WalletErrorCodes = void 0;
var WalletErrorCodes;
(function (WalletErrorCodes) {
    WalletErrorCodes["NOT_FOUND"] = "WALLET_NOT_FOUND";
    WalletErrorCodes["NOT_INSTALLED"] = "WALLET_NOT_INSTALLED";
    WalletErrorCodes["CONNECTION_FAILED"] = "CONNECTION_FAILED";
    WalletErrorCodes["USER_REJECTED"] = "USER_REJECTED";
    WalletErrorCodes["NETWORK_MISMATCH"] = "NETWORK_MISMATCH";
    WalletErrorCodes["INVALID_ADDRESS"] = "INVALID_ADDRESS";
    WalletErrorCodes["INSUFFICIENT_FUNDS"] = "INSUFFICIENT_FUNDS";
    WalletErrorCodes["TRANSACTION_FAILED"] = "TRANSACTION_FAILED";
})(WalletErrorCodes || (exports.WalletErrorCodes = WalletErrorCodes = {}));
exports.SUPPORTED_WALLETS = [
    {
        name: 'nami',
        displayName: 'Nami',
        icon: '🏖️',
        website: 'https://namiwallet.io/',
        downloadUrl: 'https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo'
    },
    {
        name: 'eternl',
        displayName: 'Eternl',
        icon: '♾️',
        website: 'https://eternl.io/',
        downloadUrl: 'https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka'
    },
    {
        name: 'flint',
        displayName: 'Flint',
        icon: '🔥',
        website: 'https://flint-wallet.com/',
        downloadUrl: 'https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj'
    },
    {
        name: 'gero',
        displayName: 'GeroWallet',
        icon: '⚡',
        website: 'https://gerowallet.io/',
        downloadUrl: 'https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe'
    },
    {
        name: 'typhon',
        displayName: 'Typhon',
        icon: '🌊',
        website: 'https://typhonwallet.io/',
        downloadUrl: 'https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh'
    }
];
