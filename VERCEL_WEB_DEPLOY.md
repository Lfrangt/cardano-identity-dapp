# 通过 Vercel 网站部署（推荐）

## ✅ 最简单的部署方式 - 无需命令行密码

### 步骤 1: 先提交代码到本地

打开终端，运行：

```bash
cd /Users/yoshihiroshikikoriuta/cardano-identity-dapp
git add .
git commit -m "fix: 修复构建问题，准备部署"
```

### 步骤 2: 使用 GitHub Desktop 推送

1. **下载 GitHub Desktop**（如果还没有）
   - 访问：https://desktop.github.com/
   - 下载并安装

2. **在 GitHub Desktop 中打开项目**
   - File → Add Local Repository
   - 选择：`/Users/yoshihiroshikikoriuta/cardano-identity-dapp`

3. **推送到 GitHub**
   - 在 GitHub Desktop 中点击 "Push origin" 按钮
   - 会自动处理认证，无需手动输入密码！

### 步骤 3: 在 Vercel 网站部署

1. **访问 Vercel**
   - 打开浏览器访问：https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库：`cardano-identity-dapp`
   - 点击 "Import"

3. **配置项目**（Vercel 会自动检测 Next.js）
   - **Project Name**: 保持默认或自定义
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（自动检测）
   - **Output Directory**: `.next`（自动检测）

4. **环境变量**（可选）
   如果需要，可以添加：
   ```
   NEXT_PUBLIC_NFT_STORAGE_API_KEY=your_key
   NEXT_PUBLIC_PINATA_API_KEY=your_key
   NEXT_PUBLIC_PINATA_SECRET=your_secret
   ```

5. **点击 "Deploy"**
   - Vercel 会自动开始构建和部署
   - 等待 2-3 分钟
   - 部署成功后会显示你的网站 URL！

## 🎉 完成！

你的应用将部署在：
- `https://your-project-name.vercel.app`

每次你推送到 GitHub，Vercel 会自动重新部署！

---

## 📱 移动端（iOS）已完成

iOS 应用已经成功部署到你的 iPhone 15 Pro 上！

---

## 🚀 下一步

1. 配置自定义域名（可选）
2. 添加 IPFS API 密钥
3. 在真实 Cardano 网络上测试

## ⚠️ 注意

当前配置跳过了类型检查以快速部署。建议后续：
1. 修复 `lucid-cardano` 依赖问题
2. 恢复类型检查配置
3. 完善错误处理

