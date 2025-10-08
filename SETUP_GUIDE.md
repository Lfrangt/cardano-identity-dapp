# Cardano 身份 DApp 配置指南

## 🚀 快速开始

本项目支持两种模式：
1. **演示模式**：✅ 无需配置，使用本地模拟 - 开箱即用！
2. **真实模式**：配置 API 密钥后，可在 Cardano 链上铸造真实的 NFT

### 立即体验演示模式

```bash
npm install
npm run dev
```

访问 `http://localhost:3000/app` 即可开始使用演示模式。

---

## 🎯 真实模式 vs 演示模式

| 功能 | 演示模式 | 真实模式 |
|------|---------|---------|
| 钱包连接 | ✅ 真实连接 | ✅ 真实连接 |
| 查看余额 | ✅ 真实显示 | ✅ 真实显示 |
| IPFS 上传 | ❌ 本地模拟 | ✅ 真实上传到 IPFS |
| NFT 铸造 | ❌ 本地模拟 | ✅ 真实铸造到链上 |
| 交易费用 | 0 ADA | ~1.5-2 ADA/次 |
| 需要配置 | 不需要 | 需要 API 密钥 |

---

## 📋 真实模式配置步骤

### 1. 获取 Blockfrost API 密钥

Blockfrost 是 Cardano 区块链的 API 服务提供商。

#### 步骤：
1. 访问 [https://blockfrost.io](https://blockfrost.io)
2. 点击 "Get Started" 注册免费账号
3. 登录后，点击 "Add Project"
4. 选择网络：
   - **Preview** (推荐用于测试)
   - **Mainnet** (用于生产环境，需要真实的 ADA)
5. 复制生成的 API 密钥

### 2. 获取 NFT.Storage API 密钥

NFT.Storage 提供免费的 IPFS 存储服务。

#### 步骤：
1. 访问 [https://nft.storage](https://nft.storage)
2. 点击 "Start Storing" 注册账号
3. 登录后，点击 "API Keys"
4. 点击 "New Key" 创建新的 API 密钥
5. 复制生成的密钥

### 3. 配置环境变量

编辑项目根目录的 `.env.local` 文件：

```bash
# Blockfrost API
NEXT_PUBLIC_BLOCKFROST_API_KEY=preview_你的API密钥
NEXT_PUBLIC_BLOCKFROST_NETWORK=Preview

# NFT.Storage API
NEXT_PUBLIC_NFT_STORAGE_API_KEY=你的NFT.Storage密钥
```

### 4. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

---

## 💰 准备测试网 ADA

如果使用 Preview 测试网，你需要一些测试 ADA：

### 获取测试 ADA：
1. 确保钱包已切换到 Preview 测试网
2. 访问 [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnets/tools/faucet/)
3. 输入你的钱包地址
4. 等待测试 ADA 到账（通常几分钟）

---

## 🔧 功能说明

### 当前实现的功能

#### ✅ 已完成
1. **钱包连接**
   - 支持 Eternl、Nami、Flint 钱包
   - 使用 CIP-30 标准
   - 实时显示余额和地址
   - 网络检测(Mainnet/Testnet)

2. **照片上传**
   - 支持 JPG、PNG、GIF 等图片格式
   - 实时预览功能
   - 自动检测演示/真实模式
   - IPFS 上传(真实模式)
   - NFT 铸造(真实模式)

3. **用户界面**
   - 深色主题 + 液态玻璃效果
   - 响应式设计
   - 标签页导航
   - 配置指南弹窗

#### 🚧 规划中的功能
1. **隐私级别选择**
   - 🌍 公开：所有人可见
   - 🔒 私密：AES-256 加密
   - 👥 选择性分享：授权特定地址

2. **NFT 画廊**
   - 展示已铸造的 NFT
   - 从区块链读取元数据
   - 查看交易历史

3. **加密功能**
   - Web Crypto API
   - AES-256-GCM 加密
   - 基于钱包地址的密钥生成

### 真实模式照片上传流程

```
1. 选择照片 → 2. 上传到 IPFS → 3. 创建 Metadata → 4. 铸造 NFT → 5. 上链确认
     ↓              ↓                    ↓                  ↓             ↓
  本地预览      获取 CID          CIP-25 格式         Lucid 构建交易    等待确认(~20s)
```

### 演示模式说明

- 钱包连接: ✅ 真实
- 余额显示: ✅ 真实
- 上传操作: ❌ 模拟(不消耗 ADA)
- NFT 铸造: ❌ 本地存储
- 适合场景: 学习、测试 UI、演示功能

---

## 🌐 网络选择

### Preview Testnet (推荐新手)
- 免费的测试网络
- 可以获取免费的测试 ADA
- 适合学习和测试

### Mainnet (生产环境)
- 真实的 Cardano 主网
- 需要真实的 ADA
- 交易永久记录在区块链上

---

## 🔍 查看交易

铸造成功后，可以在区块链浏览器查看：

### Preview Testnet:
- [https://preview.cardanoscan.io](https://preview.cardanoscan.io)

### Mainnet:
- [https://cardanoscan.io](https://cardanoscan.io)
- [https://pool.pm](https://pool.pm)

---

## ⚠️ 注意事项

1. **API 密钥安全**
   - 不要将 `.env.local` 文件提交到 Git
   - 不要公开分享你的 API 密钥

2. **网络选择**
   - 初学者建议使用 Preview 测试网
   - 确保钱包网络与配置一致

3. **交易费用**
   - 每次铸造 NFT 需要支付少量 ADA (约 1.5-2 ADA)
   - 确保钱包有足够余额

4. **加密照片**
   - 加密密钥基于钱包地址
   - 如果丢失钱包，将无法解密照片
   - 建议备份重要照片

---

## 📚 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **UI**: Tailwind CSS + 液态玻璃效果
- **区块链**: Lucid-Cardano SDK
- **存储**: IPFS (via NFT.Storage)
- **加密**: Web Crypto API (AES-256-GCM)
- **API**: Blockfrost

---

## 🐛 常见问题

### Q: 上传失败，提示 API 密钥错误？
A: 检查 `.env.local` 文件配置是否正确，并重启服务器。

### Q: 钱包余额不足？
A: 前往水龙头获取测试 ADA，或充值真实 ADA。

### Q: 交易一直等待确认？
A: Cardano 区块链确认时间约 20 秒，耐心等待。

### Q: 如何查看已铸造的 NFT？
A: 在钱包中查看，或使用区块链浏览器搜索 Policy ID。

---

## 📞 获取帮助

- Cardano 官方文档: [https://docs.cardano.org](https://docs.cardano.org)
- Blockfrost 文档: [https://docs.blockfrost.io](https://docs.blockfrost.io)
- NFT.Storage 文档: [https://nft.storage/docs](https://nft.storage/docs)

---

**祝你使用愉快！** 🎉
