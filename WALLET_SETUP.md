# 🔗 真实钱包连接设置指南

## 📝 概述
你的应用现在具备了真正的 Cardano 钱包连接功能！以下是设置和测试指南。

## 🚀 快速开始

### 1. 安装 Eternl 钱包
1. 打开 Chrome 浏览器
2. 访问 [Eternl 钱包扩展](https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka)
3. 点击 "添加至 Chrome"
4. 创建新钱包或导入现有钱包

### 2. 设置预览网络
1. 打开 Eternl 钱包扩展
2. 点击设置 ⚙️
3. 选择 "Preview Testnet" 网络
4. 确认切换到预览网络

### 3. 获取测试 ADA
1. 复制你的钱包地址
2. 访问 [Cardano 测试网水龙头](https://docs.cardano.org/cardano-testnets/tools/faucet/)
3. 粘贴地址并请求测试 ADA
4. 等待几分钟接收资金

### 4. 设置 Blockfrost API（可选）
1. 访问 [Blockfrost.io](https://blockfrost.io/)
2. 创建免费账户
3. 创建新项目，选择 "Preview" 网络
4. 复制 API 密钥
5. 在 `.env.local` 文件中替换 `preview_test_key`

## 🧪 测试钱包连接

### 步骤 1: 启动应用
```bash
npm run dev
```

### 步骤 2: 访问应用
打开浏览器访问 `http://localhost:3000/app`

### 步骤 3: 连接钱包
1. 页面会自动检测已安装的钱包
2. 点击 "Eternl" 钱包选项
3. Eternl 扩展会弹出授权请求
4. 点击 "Connect" 确认连接
5. 选择要连接的账户
6. 确认授权

### 步骤 4: 验证连接
连接成功后，你会看到：
- ✅ 钱包名称显示
- 🏠 真实的钱包地址
- 💰 真实的 ADA 余额
- 🌐 网络状态 (preview)

## 🔧 技术特性

### 真实功能
- **钱包检测**: 自动检测浏览器中的 Cardano 钱包
- **授权流程**: 真实的 CIP-30 钱包连接标准
- **地址获取**: 显示真实的 Cardano 地址
- **余额查询**: 从区块链查询真实余额
- **网络验证**: 确保钱包在正确网络上
- **状态持久化**: 连接状态在页面刷新后保持

### 支持的钱包
- 🏖️ Nami
- ♾️ Eternl  
- 🔥 Flint
- ⚡ GeroWallet
- 🌊 Typhon

### 错误处理
- 钱包未安装检测
- 用户拒绝连接处理
- 网络不匹配警告
- 连接超时重试

## 🎯 下一步功能

连接钱包后，你可以扩展以下功能：
1. **身份创建**: 在区块链上创建去中心化身份
2. **交易签名**: 签署身份相关交易
3. **数据存储**: 将个人资料存储到 IPFS
4. **社交连接**: 与其他用户建立链上连接
5. **声誉系统**: 基于区块链的技能认证

## 🔍 调试

### 常见问题
1. **钱包未检测到**: 确保 Eternl 扩展已安装并启用
2. **连接失败**: 检查钱包是否在 Preview 网络
3. **余额为 0**: 从测试网水龙头获取 ADA
4. **API 错误**: 更新 Blockfrost API 密钥

### 开发者工具
打开浏览器开发者工具查看：
- Console 日志显示连接过程
- Network 标签显示 API 请求
- Application > LocalStorage 显示钱包状态

## 🎉 成功！
你现在拥有一个完全功能的 Cardano DApp，支持真实的钱包连接！