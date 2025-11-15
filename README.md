# CardanoID - Cardano 去中心化身份 DApp

一个美观的去中心化身份平台,基于 Cardano 区块链构建,支持照片上传和 NFT 铸造。

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Cardano](https://img.shields.io/badge/Cardano-Blockchain-0033AD?style=flat-square&logo=cardano)](https://cardano.org/)

## 🚀 快速开始

### 演示模式 (无需配置)

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
http://localhost:3000
```

### 真实模式 (需要配置 API 密钥)

详见 [SETUP_GUIDE.md](./SETUP_GUIDE.md) 了解如何配置 Blockfrost 和 NFT.Storage API 密钥。

## 🌐 部署到生产环境

### 快速部署到 Vercel（推荐）

```bash
# 方法 1: 使用部署脚本
./deploy-vercel.sh

# 方法 2: 手动部署
git push origin main
# 然后在 https://vercel.com 导入项目
```

详细部署指南: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lfrangt/cardano-identity-dapp)

## ✨ 主要功能

### 已实现 ✅

**核心功能：**
- **🎨 精美 UI 设计**: 深色主题 + 液态玻璃效果,参考 Apple 设计语言
- **💳 Cardano 钱包集成**: 支持 Eternl、OKX、Yoroi、Lace 钱包 (CIP-30 标准)
- **💰 实时余额显示**: 自动转换 Lovelace 到 ADA,支持主网/测试网检测

**身份管理系统：**
- **👤 完整的身份档案**: 创建和管理去中心化身份
- **🎯 技能管理**: 4个技能等级,技能背书计数
- **🏆 成就展示**: 记录个人成就和里程碑
- **🔗 社交链接**: 支持 X, Instagram, 微信, 抖音, 小红书等 9 大平台
- **🔒 隐私控制**: 公开/私密/选择性分享三级隐私设置

**社交连接功能：**
- **🔍 用户搜索**: 通过钱包地址精确搜索或模糊搜索
- **🤝 连接管理**: 发送/接受/拒绝连接请求
- **👥 公开档案**: 查看其他用户的身份信息
- **✨ 智能推荐**: 基于共同兴趣推荐用户
- **📊 统计面板**: 连接数、请求数实时显示

**NFT 功能：**
- **📸 照片上传**: 支持图片预览,自动检测演示/真实模式
- **🔗 IPFS 集成**: 真实上传到去中心化存储(配置 NFT.Storage 后)
- **🎭 NFT 铸造**: 在 Cardano 链上铸造真实的 NFT(配置 Blockfrost 后)
- **🖼️ NFT 画廊**: 展示已铸造的 NFT
- **⚙️ 双模式运行**: 演示模式(无需配置) + 真实模式(上链铸造)

### 规划中 🚧

- **🔐 照片加密**: AES-256-GCM 加密算法
- **⭐ 声誉系统**: 通过验证背书建立声誉
- **💬 私信功能**: 加密的点对点通信
- **🏘️ 群组社区**: 创建和管理兴趣群组
- **🔔 通知系统**: 实时连接请求和活动通知
- **📱 移动端应用**: React Native 跨平台 App

## 🛠️ 技术栈

- **前端框架**: Next.js 14.2 + React 18 + TypeScript 5
- **样式**: Tailwind CSS v3 (深色主题 + 液态玻璃效果)
- **区块链**:
  - Lucid-Cardano SDK (v0.10.11)
  - Cardano CIP-30 钱包标准
  - Blockfrost API (Preview/Mainnet)
- **存储**:
  - IPFS (via NFT.Storage)
  - CIP-25 NFT Metadata 标准
- **状态管理**: Zustand v5
- **工具库**: Lucide React (图标)

## 📁 项目结构

```
cardano-identity-dapp/
├── app/                      # Next.js 14 App Router
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 首页(落地页)
│   └── app/
│       └── page.tsx         # 主应用(钱包连接 + 照片上传)
├── lib/                     # 核心库
│   ├── services/            # 区块链服务
│   │   ├── WalletService.ts # 钱包连接服务
│   │   ├── ipfs.ts          # IPFS 上传服务
│   │   ├── identity-nft.ts  # NFT Metadata 创建
│   │   └── lucid-nft.ts     # 真实 NFT 铸造(Lucid)
│   ├── types/               # TypeScript 类型定义
│   └── utils/               # 工具函数
├── .env.local               # 环境变量(API 密钥)
├── SETUP_GUIDE.md           # 详细配置指南
└── README.md                # 项目说明
```

## 🎨 设计系统

深色主题 + 液态玻璃效果,灵感来自 Apple 设计语言:

- **配色方案**:
  - 背景: `slate-900` → `purple-900` 渐变
  - 强调色: `purple-500` → `blue-600` 渐变
  - 玻璃效果: `backdrop-blur-xl` + 半透明背景
- **视觉效果**:
  - 发光阴影: `shadow-purple-500/50`
  - 边框: `border-purple-400/20` (20% 透明度)
  - 动画: `transition-all duration-300`
- **响应式设计**: 移动端优先,适配所有设备

## 📱 页面说明

### 1. 首页 (`/`)
- 产品介绍和特性展示
- 美观的渐变背景和卡片设计
- "Launch App" 按钮跳转到主应用

### 2. 主应用 (`/app`)
- **钱包连接**: 支持 Eternl/Nami/Flint
- **标签导航**:
  - 🏠 主页: 功能概览卡片
  - 📸 上传照片: 照片上传和 NFT 铸造
  - 🖼️ 我的 NFT: NFT 画廊(规划中)
- **配置指南**: 点击"配置指南"按钮查看详细教程

## 🔧 开发指南

### 本地开发

```bash
# 克隆仓库
git clone <your-repo-url>
cd cardano-identity-dapp

# 安装依赖
npm install

# 启动开发服务器(演示模式)
npm run dev
```

### 启用真实模式

1. 复制 `.env.local` 文件
2. 访问 [blockfrost.io](https://blockfrost.io) 获取 API 密钥
3. 访问 [nft.storage](https://nft.storage) 获取 IPFS 密钥
4. 更新 `.env.local`:
   ```env
   NEXT_PUBLIC_BLOCKFROST_API_KEY=preview_你的密钥
   NEXT_PUBLIC_BLOCKFROST_NETWORK=Preview
   NEXT_PUBLIC_NFT_STORAGE_API_KEY=你的NFT.Storage密钥
   ```
5. 重启开发服务器

详见 [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🌟 使用场景

- **学习 Cardano 开发**: 演示模式无需配置,适合学习
- **NFT 铸造实践**: 配置 API 后,真实铸造 NFT 到链上
- **去中心化存储**: 照片上传到 IPFS,永久保存
- **身份系统原型**: 作为去中心化身份系统的基础

## ⚠️ 注意事项

- **演示模式**: 钱包连接是真实的,但上传仅为模拟
- **真实模式**: 铸造 NFT 需要支付 ~1.5-2 ADA 交易费
- **网络选择**: 建议初学者使用 Preview 测试网
- **API 安全**: 不要将 `.env.local` 提交到 Git

## 📖 参考资源

- [Cardano 官方文档](https://docs.cardano.org)
- [Lucid-Cardano SDK](https://lucid.spacebudz.io/)
- [CIP-30 钱包标准](https://cips.cardano.org/cips/cip30/)
- [CIP-25 NFT Metadata](https://cips.cardano.org/cips/cip25/)
- [Blockfrost API 文档](https://docs.blockfrost.io)
- [NFT.Storage 文档](https://nft.storage/docs)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📄 许可证

MIT License

---

Built with ❤️ for the Cardano ecosystem | 为 Cardano 生态系统构建