// Temporary placeholder to satisfy imports
// TODO: Fix when deploying to production

export class WalletService {
  async connectWallet(walletName: string): Promise<any> {
    throw new Error('WalletService not implemented')
  }
  
  async disconnectWallet(): Promise<void> {
    throw new Error('WalletService not implemented')
  }
  
  async getBalance(): Promise<number> {
    throw new Error('WalletService not implemented')
  }
  
  detectWallets(): string[] {
    return []
  }
  
  async restoreConnection(): Promise<any> {
    return null
  }
}

export const walletService = new WalletService()
