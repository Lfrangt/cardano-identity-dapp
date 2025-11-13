# Cardano Identity DApp - 共享代码架构指南

## 🎯 目标

实现 **Web 端和 iOS 端 100% 功能一致**，并且在升级 Web 端时**自动同步到 iOS 端**。

## 📦 架构设计

```
cardano-identity-dapp/
├── shared-core/              # 共享核心包（核心业务逻辑）
│   ├── src/
│   │   ├── services/        # 业务服务
│   │   │   ├── identity-nft.ts      # NFT 创建
│   │   │   ├── ipfs.ts              # IPFS 上传
│   │   │   ├── wallet-nft.ts        # 钱包 NFT 铸造
│   │   │   ├── lucid-nft.ts         # Lucid NFT 铸造
│   │   │   └── WalletService.ts     # 钱包管理
│   │   ├── utils/           # 工具函数
│   │   │   ├── crypto.ts            # 加密解密
│   │   │   ├── errorHandler.ts      # 错误处理
│   │   │   └── wallet-balance.ts    # 余额查询
│   │   └── types/           # 类型定义
│   │       └── wallet.ts            # 钱包类型
│   └── dist/                # 编译输出
├── app/                     # Next.js Web 应用
│   └── (使用 @cardano-identity/shared-core)
├── mobile/                  # React Native iOS 应用
│   └── (使用 @cardano-identity/shared-core)
└── scripts/
    └── sync-shared.sh       # 自动同步脚本
```

## 🔄 工作流程

### 1. 开发新功能（Web 或修改现有功能）

```bash
# 1. 修改共享核心代码
cd shared-core/src/services
# 编辑任何 .ts 文件

# 2. 构建共享包
npm run build:shared

# 3. 自动同步到两端
npm run sync
```

### 2. Web 端使用共享代码

```typescript
// app/page.tsx
import {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
} from '@cardano-identity/shared-core'

// 直接调用共享函数
async function handleUpload() {
  const result = await uploadToIPFS(file, 'identity.jpg')
  // ...
}
```

### 3. iOS 端使用相同代码

```typescript
// mobile/src/screens/MainScreen.tsx
import {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
} from '@cardano-identity/shared-core'

// 完全相同的 API
async function handleUpload() {
  const result = await uploadToIPFS(blob, 'identity.jpg')
  // ...
}
```

## ⚡ 自动同步机制

### 快速同步命令

```bash
# 在项目根目录运行
npm run sync
```

这个命令会：
1. ✅ 构建 `shared-core` 包
2. ✅ 自动链接到 Web 端（通过 TypeScript paths）
3. ✅ 自动安装到 Mobile 端（通过 npm install）

### 或者使用脚本

```bash
./scripts/sync-shared.sh
```

## 🚀 完整开发流程示例

### 场景：添加新的隐私级别 "组织私密"

#### 步骤 1: 修改共享类型定义

```typescript
// shared-core/src/services/identity-nft.ts
export type PrivacyLevel = 'public' | 'private' | 'selective' | 'organization'
```

#### 步骤 2: 更新业务逻辑

```typescript
// shared-core/src/services/identity-nft.ts
export function createIdentityMetadata(
  imageCID: string,
  privacy: PrivacyLevel,
  options: {...}
) {
  // 添加新的隐私级别处理
  if (privacy === 'organization') {
    // 组织私密逻辑
  }
}
```

#### 步骤 3: 同步到两端

```bash
npm run sync
```

#### 步骤 4: 两端立即可用

**Web 端 (app/upload/page.tsx):**
```typescript
import { createIdentityMetadata } from '@cardano-identity/shared-core'

// 新功能立即可用
const metadata = createIdentityMetadata(cid, 'organization', {...})
```

**iOS 端 (mobile/src/screens/UploadScreen.tsx):**
```typescript
import { createIdentityMetadata } from '@cardano-identity/shared-core'

// 完全相同的代码，功能自动同步
const metadata = createIdentityMetadata(cid, 'organization', {...})
```

## 📝 开发规范

### ✅ DO（应该做的）

1. **所有核心业务逻辑放在 `shared-core`**
   ```typescript
   // ✅ Good
   // shared-core/src/services/nft.ts
   export async function mintNFT(data) { /* ... */ }
   ```

2. **使用纯 TypeScript/JavaScript**
   ```typescript
   // ✅ Good - 纯函数，无平台依赖
   export function calculateHash(data: string): string {
     return crypto.subtle.digest('SHA-256', data)
   }
   ```

3. **平台特定 UI 放在各自项目**
   ```typescript
   // ✅ Web: app/components/UploadButton.tsx
   export function UploadButton() {
     return <button>Upload</button>
   }

   // ✅ Mobile: mobile/src/components/UploadButton.tsx
   export function UploadButton() {
     return <TouchableOpacity>...</TouchableOpacity>
   }
   ```

### ❌ DON'T（不应该做的）

1. **不要在 shared-core 中使用 Web API**
   ```typescript
   // ❌ Bad - window 只在浏览器中存在
   export function getHost() {
     return window.location.host
   }
   ```

2. **不要在 shared-core 中使用 React Native API**
   ```typescript
   // ❌ Bad - Alert 只在 React Native 中存在
   import { Alert } from 'react-native'
   export function showError() {
     Alert.alert('Error')
   }
   ```

3. **不要直接修改 lib/ 目录的旧代码**
   ```typescript
   // ❌ Bad - 旧架构，不再使用
   // lib/services/ipfs.ts (已弃用)

   // ✅ Good - 修改共享包
   // shared-core/src/services/ipfs.ts
   ```

## 🔧 常用命令

```bash
# 开发 Web 端
npm run dev

# 开发 iOS 端
cd mobile
npm run ios

# 构建共享包
npm run build:shared

# 同步到两端
npm run sync

# 监听共享包变化（开发时）
cd shared-core
npm run watch
```

## 📊 同步验证

### 检查同步是否成功

```bash
# 1. 检查 shared-core 是否构建
ls shared-core/dist

# 2. 检查 mobile 是否安装
ls mobile/node_modules/@cardano-identity

# 3. 验证两端代码一致
# Web: 检查 app/page.tsx 是否导入 @cardano-identity/shared-core
# Mobile: 检查 mobile/src/screens/MainScreen.tsx 是否导入相同包
```

## 🎉 优势总结

1. **单一代码源** - 只需维护一份核心逻辑
2. **自动同步** - 修改一次，两端立即更新
3. **类型安全** - TypeScript 类型定义完全共享
4. **功能一致** - Web 和 iOS 100% 功能相同
5. **快速迭代** - 新功能一次开发，两端部署

## 🐛 常见问题

### Q: 修改了 shared-core 但两端没更新？
A: 运行 `npm run sync` 重新构建和同步

### Q: TypeScript 类型错误？
A: 确保运行了 `npm run build:shared` 生成类型定义

### Q: Mobile 端找不到模块？
A: 在 mobile 目录运行 `npm install` 重新安装依赖

### Q: 如何添加新的共享函数？
A:
1. 在 `shared-core/src/services/` 添加函数
2. 在 `shared-core/src/index.ts` 导出
3. 运行 `npm run sync`
4. 两端即可使用

## 📚 更多资源

- [Shared Core README](./shared-core/README.md)
- [Web App Documentation](./README.md)
- [Mobile App Documentation](./mobile/README.md)
