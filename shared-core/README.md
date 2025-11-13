# Cardano Identity - Shared Core

共享核心库，供 Web 和 Mobile 应用使用。

## 📦 包含内容

### Services (服务)
- `identity-nft.ts` - 身份 NFT 创建和管理
- `ipfs.ts` - IPFS 文件上传（NFT.Storage, Pinata）
- `wallet-nft.ts` - 使用钱包 CIP-30 API 铸造 NFT
- `lucid-nft.ts` - 使用 Lucid 铸造 NFT (可选)
- `WalletService.ts` - 钱包连接和管理

### Utils (工具)
- `crypto.ts` - 加密/解密工具
- `errorHandler.ts` - 错误处理
- `wallet-balance.ts` - 钱包余额查询

### Types (类型定义)
- `wallet.ts` - 钱包相关类型定义

## 🔄 工作流程

### 1. 修改共享代码
```bash
cd shared-core/src
# 修改任何 service/util/type 文件
```

### 2. 自动同步到 Web 和 Mobile
```bash
# 在项目根目录运行
npm run sync
```

这个命令会：
1. 构建 `shared-core` 包
2. 自动更新到 Web 端（通过 TypeScript paths）
3. 自动更新到 Mobile 端（通过 npm install）

### 3. 两端立即生效
- **Web**: 重启 `npm run dev`
- **Mobile**: 重启 `npm run ios`

## 📝 使用示例

### 在 Web 端使用
```typescript
// app/page.tsx
import {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
} from '@cardano-identity/shared-core'

// 直接使用共享函数
const result = await uploadToIPFS(file, 'identity.jpg')
```

### 在 Mobile 端使用
```typescript
// mobile/src/screens/MainScreen.tsx
import {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
} from '@cardano-identity/shared-core'

// 完全相同的 API
const result = await uploadToIPFS(blob, 'identity.jpg')
```

## 🎯 优势

1. **单一代码源** - 只需维护一份代码
2. **自动同步** - 修改一次，两端同步
3. **类型安全** - TypeScript 类型定义共享
4. **一致体验** - Web 和 Mobile 功能完全一致

## 🔧 开发注意事项

### 添加新功能
1. 在 `shared-core/src/services/` 中添加新服务
2. 在 `shared-core/src/index.ts` 中导出
3. 运行 `npm run sync`
4. 两端即可使用

### 修改现有功能
1. 直接修改 `shared-core/src/` 中的文件
2. 运行 `npm run sync`
3. 两端自动更新

### 避免平台特定代码
- ❌ 不要使用 `window`、`document`（Web 特有）
- ❌ 不要使用 React Native 特定 API
- ✅ 使用纯 TypeScript/JavaScript 逻辑
- ✅ 平台特定实现放在各自项目中

## 📚 架构图

```
cardano-identity-dapp/
├── shared-core/          # 共享核心包
│   ├── src/
│   │   ├── services/    # 业务逻辑
│   │   ├── utils/       # 工具函数
│   │   └── types/       # 类型定义
│   └── dist/            # 构建输出
├── app/                 # Web Next.js 应用
│   └── (使用 shared-core)
└── mobile/              # React Native 应用
    └── (使用 shared-core)
```

## 🚀 快速开始

```bash
# 1. 安装依赖
cd shared-core
npm install

# 2. 构建
npm run build

# 3. 同步到两端
cd ..
npm run sync

# 4. 运行 Web
npm run dev

# 5. 运行 Mobile
cd mobile
npm run ios
```
