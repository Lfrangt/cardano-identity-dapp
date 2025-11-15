# Cardano Identity DApp 部署指南

## 🚀 快速部署到 Vercel

### 前置要求

- GitHub 账号
- Vercel 账号（可用 GitHub 登录）
- 代码已推送到 GitHub 仓库

### 一键部署步骤

#### 方法 1：通过 Vercel Dashboard（推荐）

1. **访问 Vercel**
   ```
   https://vercel.com
   ```

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库：`cardano-identity-dapp`
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（保持默认）
   - **Build Command**: `npm run build`（自动填充）
   - **Output Directory**: `.next`（自动填充）
   - **Install Command**: `npm install`（自动填充）

4. **环境变量（可选）**
   
   如果要启用真实的 NFT 铸造功能，添加以下环境变量：

   ```env
   # Blockfrost API（用于 Cardano 区块链交互）
   NEXT_PUBLIC_BLOCKFROST_API_KEY=preview_你的密钥
   NEXT_PUBLIC_BLOCKFROST_NETWORK=Preview
   
   # NFT.Storage API（用于 IPFS 存储）
   NEXT_PUBLIC_NFT_STORAGE_API_KEY=你的NFT.Storage密钥
   ```

   **获取 API 密钥：**
   - Blockfrost: https://blockfrost.io
   - NFT.Storage: https://nft.storage

   **注意**：不添加这些变量也能正常运行，只是会使用演示模式。

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）
   - 🎉 部署成功！

6. **访问你的 DApp**
   ```
   https://your-project-name.vercel.app
   ```

#### 方法 2：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   cd /path/to/cardano-identity-dapp
   vercel
   ```

4. **首次部署配置**
   - Set up and deploy: `Y`
   - Which scope: 选择你的账号
   - Link to existing project: `N`
   - Project name: `cardano-identity-dapp`（或自定义）
   - Directory: `./`
   - Override settings: `N`

5. **生产部署**
   ```bash
   vercel --prod
   ```

#### 方法 3：通过 GitHub Actions（自动化）

1. **在项目根目录创建文件**
   ```bash
   mkdir -p .github/workflows
   ```

2. **创建部署工作流**
   
   创建 `.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to Vercel
   
   on:
     push:
       branches:
         - main
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm install
           
         - name: Build
           run: npm run build
           
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
             vercel-args: '--prod'
   ```

3. **配置 GitHub Secrets**
   
   在 GitHub 仓库设置中添加：
   - `VERCEL_TOKEN`: 从 Vercel Account Settings 获取
   - `VERCEL_ORG_ID`: 从 Vercel 项目设置获取
   - `VERCEL_PROJECT_ID`: 从 Vercel 项目设置获取

## 📦 构建优化

### 1. 检查构建

在部署前本地测试构建：

```bash
npm run build
npm start
```

访问 http://localhost:3000 测试生产版本。

### 2. 构建大小优化

项目已经进行了以下优化：

- ✅ Tree-shaking（自动移除未使用代码）
- ✅ 代码分割（动态导入）
- ✅ 图片优化（Next.js Image）
- ✅ CSS 优化（Tailwind CSS Purge）

### 3. 性能检查

使用 Lighthouse 检查性能：

```bash
# 部署后访问
https://pagespeed.web.dev/
```

输入你的部署 URL，查看性能报告。

## 🌍 自定义域名

### 添加自定义域名

1. **在 Vercel Dashboard**
   - 进入你的项目
   - 点击 "Settings" → "Domains"
   - 添加你的域名

2. **配置 DNS**
   
   在你的域名提供商添加记录：
   
   ```
   类型: A
   名称: @
   值: 76.76.21.21
   
   类型: CNAME
   名称: www
   值: cname.vercel-dns.com
   ```

3. **等待 DNS 传播**
   - 通常需要几分钟到几小时
   - 可以通过 https://dnschecker.org 检查

4. **启用 HTTPS**
   - Vercel 自动提供 SSL 证书
   - 强制 HTTPS 重定向

## 🔐 环境变量管理

### 开发环境

创建 `.env.local`（已在 .gitignore 中）：

```env
# 开发环境 - 本地使用
NEXT_PUBLIC_BLOCKFROST_API_KEY=preview_your_key
NEXT_PUBLIC_BLOCKFROST_NETWORK=Preview
NEXT_PUBLIC_NFT_STORAGE_API_KEY=your_key
```

### 生产环境

在 Vercel Dashboard 中设置：

1. 进入项目 Settings
2. 点击 "Environment Variables"
3. 添加变量（选择 Production 环境）
4. 重新部署以应用更改

### 环境变量说明

| 变量名 | 说明 | 必需 | 示例值 |
|-------|------|-----|--------|
| `NEXT_PUBLIC_BLOCKFROST_API_KEY` | Blockfrost API 密钥 | 否* | `preview_abc123...` |
| `NEXT_PUBLIC_BLOCKFROST_NETWORK` | Cardano 网络 | 否* | `Preview` 或 `Mainnet` |
| `NEXT_PUBLIC_NFT_STORAGE_API_KEY` | NFT.Storage 密钥 | 否* | `eyJ...` |

\* 不是必需，但启用真实上链功能需要配置

## 🔄 持续部署

### 自动部署触发

Vercel 自动监听 GitHub 推送：

- `main` 分支 → 生产环境
- 其他分支 → 预览环境
- Pull Request → 预览部署

### 手动触发

在 Vercel Dashboard：
1. 进入 Deployments
2. 点击最新部署右侧的 "..."
3. 选择 "Redeploy"

### 回滚部署

如果新部署有问题：
1. 在 Deployments 中找到之前的版本
2. 点击 "..." → "Promote to Production"

## 📊 监控和分析

### Vercel Analytics

1. 在项目 Settings 中启用 Analytics
2. 查看：
   - 页面访问量
   - 性能指标
   - 用户地理分布

### 错误监控

查看部署日志：
1. 进入 Deployments
2. 点击部署
3. 查看 "Build Logs" 和 "Function Logs"

## 🐛 故障排除

### 构建失败

**错误：** `Module not found`

**解决：**
```bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
```

**错误：** `Type error`

**解决：**
- 检查 TypeScript 错误
- 或在 `next.config.js` 中启用 `ignoreBuildErrors`

### 运行时错误

**错误：** `localStorage is not defined`

**解决：**
- 确保只在客户端组件中使用
- 添加 `'use client'` 指令
- 检查 SSR 兼容性

### 钱包连接问题

**错误：** 无法检测钱包

**解决：**
- 确保在 HTTPS 环境下
- Vercel 自动提供 HTTPS
- 检查浏览器扩展是否安装

## 📱 移动端适配

项目已完全响应式设计：

- ✅ 移动端友好的导航
- ✅ 触摸优化的交互
- ✅ 自适应布局
- ✅ PWA 就绪（可选）

### 启用 PWA（可选）

1. 安装依赖：
   ```bash
   npm install next-pwa
   ```

2. 配置 `next.config.js`：
   ```javascript
   const withPWA = require('next-pwa')({
     dest: 'public'
   })
   
   module.exports = withPWA({
     // 现有配置
   })
   ```

3. 添加 manifest.json 到 public 目录

## 🌐 多区域部署

### 全球边缘网络

Vercel 自动部署到全球边缘网络：
- 🌍 欧洲、美洲、亚洲
- ⚡ 低延迟访问
- 🚀 CDN 加速

### 区域设置

在 `vercel.json` 中配置：

```json
{
  "regions": ["sfo1", "hnd1", "fra1"]
}
```

## 📈 性能优化建议

### 1. 图片优化

使用 Next.js Image 组件：
```tsx
import Image from 'next/image'

<Image 
  src="/avatar.jpg"
  width={100}
  height={100}
  alt="Avatar"
/>
```

### 2. 代码分割

动态导入大型组件：
```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

### 3. 缓存策略

在 `next.config.js` 中配置：
```javascript
{
  headers: async () => [{
    source: '/:all*(svg|jpg|png)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      }
    ],
  }]
}
```

## 🔒 安全建议

### 1. API 密钥保护

- ✅ 使用环境变量
- ✅ 不要提交到 Git
- ✅ 定期轮换密钥

### 2. CORS 配置

在 `next.config.js` 中：
```javascript
{
  headers: async () => [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' }
    ]
  }]
}
```

### 3. CSP（内容安全策略）

添加安全头：
```javascript
{
  headers: [{
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'"
  }]
}
```

## 📞 支持资源

### 官方文档

- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Cardano: https://docs.cardano.org

### 社区

- Discord: Cardano 开发者社区
- GitHub Issues: 项目问题跟踪
- Twitter: @cardano

## ✅ 部署检查清单

部署前确认：

- [ ] 所有代码已提交到 Git
- [ ] 本地构建成功 (`npm run build`)
- [ ] 环境变量已配置
- [ ] 测试所有主要功能
- [ ] 检查响应式设计
- [ ] 浏览器兼容性测试
- [ ] 钱包连接测试
- [ ] 文档已更新

部署后验证：

- [ ] 网站可访问
- [ ] 钱包可以连接
- [ ] 身份管理功能正常
- [ ] 社交连接功能正常
- [ ] 照片上传功能正常
- [ ] 移动端显示正常
- [ ] 性能指标良好

## 🎉 部署完成

恭喜！你的 Cardano Identity DApp 现在已经在线了！

**下一步：**

1. 分享你的 DApp URL
2. 收集用户反馈
3. 监控性能和错误
4. 持续改进和更新

**生产 URL 示例：**
```
https://cardano-identity-dapp.vercel.app
```

---

**需要帮助？**

- 查看 Vercel 日志
- 检查 GitHub Issues
- 加入 Cardano 开发者社区

**祝你的 DApp 成功！** 🚀✨

