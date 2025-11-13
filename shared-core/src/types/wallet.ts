// 钱包类型定义

export interface WalletInfo {
  name: string
  displayName: string
  icon: string
  website: string
  downloadUrl: string
}

export interface WalletConnection {
  address: string
  balance: number
  network: 'mainnet' | 'testnet' | 'preview' | 'preprod'
  walletName: string
  isConnected: boolean
}

export interface CardanoWalletAPI {
  enable(): Promise<any>
  isEnabled(): Promise<boolean>
  getNetworkId(): Promise<number>
  getUtxos(): Promise<string[]>
  getBalance(): Promise<string>
  getUsedAddresses(): Promise<string[]>
  getUnusedAddresses(): Promise<string[]>
  getChangeAddress(): Promise<string>
  getRewardAddresses(): Promise<string[]>
  signTx(tx: string, partialSign?: boolean): Promise<string>
  signData(addr: string, payload: string): Promise<{signature: string, key: string}>
  submitTx(tx: string): Promise<string>
  name: string
  icon: string
  apiVersion: string
}

export interface CardanoWindow extends Window {
  cardano?: {
    [key: string]: CardanoWalletAPI
  }
}

export interface WalletError {
  code: string
  message: string
  info?: any
}

export enum WalletErrorCodes {
  NOT_FOUND = 'WALLET_NOT_FOUND',
  NOT_INSTALLED = 'WALLET_NOT_INSTALLED', 
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  USER_REJECTED = 'USER_REJECTED',
  NETWORK_MISMATCH = 'NETWORK_MISMATCH',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED'
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
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
]