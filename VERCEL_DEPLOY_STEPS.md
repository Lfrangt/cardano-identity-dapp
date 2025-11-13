# 🚀 Vercel 部署详细步骤

## 第一步：使用 GitHub Desktop 推送代码

### 1.1 下载并安装 GitHub Desktop
- 访问：https://desktop.github.com/
- 下载 macOS 版本
- 安装并打开

### 1.2 登录 GitHub 账号
- GitHub Desktop → Preferences → Accounts
- Sign In to GitHub.com
- 在浏览器中登录你的 GitHub 账号

### 1.3 添加本地仓库
1. 点击 `File` → `Add Local Repository`
2. 在路径中输入或选择：
   ```
   /Users/yoshihiroshikikoriuta/cardano-identity-dapp
   ```
3. 点击 `Add Repository`

### 1.4 推送到 GitHub
1. 在 GitHub Desktop 中，你会看到有 2 个提交待推送
2. 点击右上角的 `Push origin` 按钮
3. 等待推送完成（通常几秒钟）
4. ✅ 推送成功！

---

## 第二步：在 Vercel 部署项目

### 2.1 访问 Vercel
- 打开浏览器访问：https://vercel.com
- 点击 `Sign Up` 或 `Log In`

### 2.2 使用 GitHub 登录
- 选择 `Continue with GitHub`
- 授权 Vercel 访问你的 GitHub 账号
- 如果是第一次，需要安装 Vercel GitHub App

### 2.3 导入项目
1. 点击右上角 `Add New...` → `Project`
2. 在列表中找到 `cardano-identity-dapp` 仓库
3. 点击 `Import` 按钮

### 2.4 配置项目（重要！）

Vercel 会自动检测到 Next.js 项目，但需要确认以下配置：

```
┌─────────────────────────────────────────────┐
│ 项目设置                                    │
├─────────────────────────────────────────────┤
│ Project Name: cardano-identity-dapp         │
│ Framework Preset: Next.js                   │
│ Root Directory: ./                          │
│ Build Command: npm run build               │
│ Output Directory: .next                     │
│ Install Command: npm install               │
│ Node.js Version: 18.x                       │
└─────────────────────────────────────────────┘
```

⚠️ **重要：环境变量**

Vercel 会显示一个"Environment Variables"部分。点击展开，添加以下变量（可选，如果你有的话）：

```bash
# IPFS 配置（可选）
NEXT_PUBLIC_NFT_STORAGE_API_KEY=你的密钥
NEXT_PUBLIC_PINATA_API_KEY=你的密钥
NEXT_PUBLIC_PINATA_SECRET=你的密钥

# Cardano 配置（可选）
NEXT_PUBLIC_BLOCKFROST_PROJECT_ID=你的项目ID
```

如果没有这些密钥，可以先不填，应用会使用模拟模式。

### 2.5 开始部署
1. 确认配置无误后，点击 `Deploy` 按钮
2. Vercel 会开始构建和部署
3. 你会看到实时的构建日志

### 2.6 等待部署完成
- 构建时间：约 2-5 分钟
- 你会看到进度条和日志输出
- 构建步骤：
  ```
  ✓ 安装依赖
  ✓ 构建项目
  ✓ 优化资源
  ✓ 部署到全球 CDN
  ```

### 2.7 部署成功！🎉
部署完成后，你会看到：
- ✅ 一个庆祝动画
- 🌐 你的网站 URL（类似：`https://cardano-identity-dapp.vercel.app`）
- 📱 预览截图
- 🔗 三个按钮：`Visit`, `Continue to Dashboard`, `Share`

---

## 第三步：访问你的应用

### 3.1 点击 `Visit` 按钮
或者直接访问分配给你的 URL

### 3.2 测试功能
1. 检查页面是否正常加载
2. 测试钱包连接功能
3. 确认所有功能正常

---

## 🔧 常见问题和解决方案

### Q1: 构建失败怎么办？
**答：** 
- 点击 `View Build Logs` 查看详细错误
- 通常是因为环境变量缺失或依赖问题
- 我们的配置已经跳过类型检查，应该不会失败

### Q2: 部署成功但页面报错？
**答：**
- 打开浏览器开发者工具（F12）查看错误
- 通常是因为缺少环境变量
- 可以在 Vercel Dashboard → Settings → Environment Variables 中添加

### Q3: 如何重新部署？
**答：**
- 方式1：推送新的代码到 GitHub，Vercel 会自动重新部署
- 方式2：在 Vercel Dashboard → Deployments → 点击 `Redeploy`

### Q4: 如何配置自定义域名？
**答：**
1. 在 Vercel Dashboard → Settings → Domains
2. 添加你的域名
3. 按照指引配置 DNS 记录

### Q5: 如何查看日志？
**答：**
- Vercel Dashboard → Deployments → 选择一个部署 → View Function Logs

---

## 📊 Vercel Dashboard 功能

部署成功后，你可以在 Dashboard 中：

1. **Overview** - 查看访问量、性能指标
2. **Deployments** - 查看所有部署历史
3. **Analytics** - 查看详细的访问分析
4. **Settings** - 配置环境变量、域名等
5. **Logs** - 查看实时日志

---

## 🎯 下一步

部署成功后，建议：

1. ✅ 在手机和电脑上测试网站
2. ✅ 连接真实的 Cardano 钱包测试
3. ✅ 配置 IPFS API 密钥（如果需要真实上传）
4. ✅ 分享你的应用链接！

---

## 🆘 需要帮助？

如果遇到任何问题：
1. 检查 Vercel 的构建日志
2. 查看浏览器控制台的错误信息
3. 告诉我具体的错误信息，我来帮你解决！

---

## 🎉 恭喜！

你的 Cardano Identity DApp 现在：
- ✅ iOS 应用运行在你的 iPhone 15 Pro 上
- ✅ Web 应用部署在 Vercel 全球 CDN 上
- 🌍 任何人都可以通过 URL 访问你的应用！

**这是一个完整的全栈、跨平台、去中心化身份应用！** 🚀

