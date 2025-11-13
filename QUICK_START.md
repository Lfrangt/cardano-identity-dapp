# 快速开始 - Web 和 iOS 同步开发

## 🚀 一键设置

```bash
# 1. 安装所有依赖
npm install

# 2. 构建共享包
npm run build:shared

# 3. 启动 Web 开发服务器
npm run dev
# 访问 http://localhost:3000

# 4. 在另一个终端启动 iOS 模拟器
cd mobile
npm run ios
```

## 📱 当前状态

### ✅ 已完成
- [x] 共享核心包 (`shared-core`) 创建完成
- [x] Web 端和 iOS 端配置完成
- [x] 自动同步机制配置完成
- [x] TypeScript 类型共享
- [x] 所有核心服务已迁移到共享包

### 📦 共享的核心功能

```typescript
// 这些功能在 Web 和 iOS 中完全相同

import {
  // NFT 相关
  createIdentityMetadata,
  mintIdentityNFTWithWallet,
  getIdentityNFT,
  checkAccess,

  // IPFS 相关
  uploadToIPFS,
  getFromIPFS,
  checkIPFSExists,

  // 钱包相关
  WalletService,

  // 工具函数
  encryptFile,
  decryptFile,
  handleError,
  getWalletBalance,

  // 类型定义
  WalletInfo,
  IdentityMetadata,
  IdentityNFT
} from '@cardano-identity/shared-core'
```

## 🔄 日常开发工作流

### 场景 1: 修改现有功能

```bash
# 1. 修改共享代码
vim shared-core/src/services/ipfs.ts

# 2. 同步到两端
npm run sync

# 3. Web 自动热重载（如果 dev server 在运行）
# 4. iOS 重新加载（按 Cmd+R 或重启）
```

### 场景 2: 添加新功能

```bash
# 1. 在 shared-core 添加新服务
cat > shared-core/src/services/analytics.ts << 'EOF'
export async function trackEvent(event: string) {
  console.log('Event:', event)
}
EOF

# 2. 导出新服务
echo "export * from './services/analytics'" >> shared-core/src/index.ts

# 3. 同步
npm run sync

# 4. 两端立即可用
# Web: import { trackEvent } from '@cardano-identity/shared-core'
# iOS: import { trackEvent } from '@cardano-identity/shared-core'
```

### 场景 3: 更新依赖

```bash
# 1. 更新 shared-core 依赖
cd shared-core
npm install some-package@latest

# 2. 重新构建
npm run build

# 3. 同步到两端
cd ..
npm run sync
```

## 🎯 验证同步成功

### 方法 1: 检查文件

```bash
# 检查 shared-core 构建产物
ls -la shared-core/dist/

# 检查 mobile 是否安装
ls -la mobile/node_modules/@cardano-identity/

# 检查 Web 类型提示
code app/page.tsx
# 输入 import { 后应该看到自动补全
```

### 方法 2: 运行测试导入

**Web 端测试:**
```typescript
// app/test-import.tsx
import {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
} from '@cardano-identity/shared-core'

console.log('Imports working:', {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
})
```

**iOS 端测试:**
```typescript
// mobile/src/test-import.ts
import {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
} from '@cardano-identity/shared-core'

console.log('Imports working:', {
  uploadToIPFS,
  mintIdentityNFTWithWallet,
  createIdentityMetadata
})
```

## 📊 项目结构一览

```
cardano-identity-dapp/
│
├── shared-core/              ← 🔥 核心代码（所有业务逻辑）
│   ├── src/
│   │   ├── services/        ← NFT、IPFS、钱包服务
│   │   ├── utils/           ← 工具函数
│   │   └── types/           ← TypeScript 类型
│   └── dist/                ← 编译输出（自动生成）
│
├── app/                      ← Next.js Web 应用
│   ├── page.tsx             ← 使用 shared-core
│   └── upload/              ← 上传页面
│
├── mobile/                   ← React Native iOS 应用
│   ├── src/
│   │   └── screens/
│   │       └── MainScreen.tsx ← 使用相同的 shared-core
│   └── ios/                 ← iOS 配置
│
└── scripts/
    └── sync-shared.sh       ← 同步脚本
```

## 🐛 常见问题解决

### 问题 1: "Cannot find module '@cardano-identity/shared-core'"

**解决方案:**
```bash
npm run sync
```

### 问题 2: TypeScript 类型错误

**解决方案:**
```bash
# 重新构建类型定义
cd shared-core
npm run build
cd ..
```

### 问题 3: iOS 端导入错误

**解决方案:**
```bash
cd mobile
rm -rf node_modules
npm install
```

### 问题 4: 修改后两端没更新

**解决方案:**
```bash
# 完整重建
npm run build:shared
npm run sync

# Web 重启
npm run dev

# iOS 重启
cd mobile
npm run ios
```

## 🎉 成功标志

当你看到以下内容时，说明设置成功：

1. ✅ `shared-core/dist/` 目录存在且有文件
2. ✅ Web 端可以 `import from '@cardano-identity/shared-core'`
3. ✅ iOS 端可以 `import from '@cardano-identity/shared-core'`
4. ✅ 修改 `shared-core` 后运行 `npm run sync` 两端都更新
5. ✅ TypeScript 自动补全和类型检查工作正常

## 📚 下一步

- 阅读 [SHARED_CODE_GUIDE.md](./SHARED_CODE_GUIDE.md) 了解详细架构
- 查看 [shared-core/README.md](./shared-core/README.md) 了解共享包文档
- 开始开发新功能！🚀
