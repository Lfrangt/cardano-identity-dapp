# 🚀 Vercel 部署指南

## 📋 部署前检查

### 1. 确保代码已提交到 Git

```bash
cd /Users/yoshihiroshikikoriuta/cardano-identity-dapp

# 查看状态
git status

# 添加所有文件
git add .

# 提交
git commit -m "准备部署到 Vercel"

# 推送到 GitHub
git push origin main
```

## 🌐 部署到 Vercel

### 方法 1: 使用 Vercel CLI（推荐）

#### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

会打开浏览器，选择登录方式：
- GitHub
- GitLab
- Bitbucket
- Email

#### 步骤 3: 部署

```bash
cd /Users/yoshihiroshikikoriuta/cardano-identity-dapp

# 第一次部署
vercel

# 按提示回答：
# - Set up and deploy? [Y/n]: Y
# - Which scope?: 选择你的账户
# - Link to existing project? [y/N]: N
# - What's your project's name?: cardano-identity-dapp
# - In which directory is your code located?: ./
# - Want to override the settings? [y/N]: N
```

#### 步骤 4: 部署到生产环境

```bash
# 部署到生产环境
vercel --prod
```

---

### 方法 2: 通过 Vercel 网站部署

#### 步骤 1: 访问 Vercel

1. 打开 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"
3. 使用 GitHub 账户登录

#### 步骤 2: 导入项目

1. 点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 找到你的 `cardano-identity-dapp` 仓库
4. 点击 "Import"

#### 步骤 3: 配置项目

**Framework Preset**: Next.js（应该自动检测到）

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Root Directory**: `./`（保持默认）

#### 步骤 4: 环境变量（可选）

如果需要配置 API 密钥：

```
NEXT_PUBLIC_BLOCKFROST_API_KEY=你的密钥
NEXT_PUBLIC_BLOCKFROST_NETWORK=Preview
NEXT_PUBLIC_NFT_STORAGE_API_KEY=你的密钥
```

**注意**: 
- 演示模式不需要配置这些
- 真实模式需要在 Vercel 项目设置中添加

#### 步骤 5: 部署

点击 "Deploy" 按钮！

等待 2-3 分钟，部署完成！

---

## ✅ 部署成功后

### 你会得到：

1. **生产环境 URL**
   ```
   https://cardano-identity-dapp.vercel.app
   ```

2. **预览 URL**（每次 Git 推送）
   ```
   https://cardano-identity-dapp-xxx.vercel.app
   ```

3. **自动部署**
   - 每次推送到 main 分支
   - 自动触发部署
   - 几分钟后更新上线

---

## 🔧 Vercel 配置文件（可选）

### 创建 vercel.json

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["hnd1"],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

## 🌍 自定义域名（可选）

### 在 Vercel 添加自定义域名

1. 进入项目设置
2. 选择 "Domains"
3. 添加你的域名
4. 按照指示配置 DNS

**支持的域名：**
- `yourdomain.com`
- `www.yourdomain.com`
- `cardano.yourdomain.com`

---

## 🔐 环境变量管理

### 在 Vercel 配置环境变量

1. 进入项目
2. Settings → Environment Variables
3. 添加变量：

```
NEXT_PUBLIC_BLOCKFROST_API_KEY
NEXT_PUBLIC_BLOCKFROST_NETWORK
NEXT_PUBLIC_NFT_STORAGE_API_KEY
```

**Environment**: 
- Production
- Preview
- Development

---

## 📊 部署状态监控

### 查看部署日志

```bash
# CLI 方式
vercel logs

# 或在 Vercel 网站
项目 → Deployments → 选择部署 → View Logs
```

### 分析性能

Vercel 提供：
- Analytics（分析）
- Speed Insights（速度洞察）
- Web Vitals（核心指标）

---

## 🔄 更新部署

### 自动部署（推荐）

```bash
# 修改代码后
git add .
git commit -m "更新功能"
git push origin main

# Vercel 会自动部署！
```

### 手动部署

```bash
# 使用 CLI
vercel --prod
```

---

## 🐛 常见问题

### 问题 1: 构建失败

**检查：**
```bash
# 本地测试构建
npm run build

# 如果本地成功，检查 Vercel 日志
```

### 问题 2: 环境变量不生效

**解决：**
- 确保变量名以 `NEXT_PUBLIC_` 开头
- 重新部署项目

### 问题 3: 404 错误

**解决：**
- 检查路由配置
- 确保 `vercel.json` 配置正确

### 问题 4: API 调用失败

**检查：**
- CORS 配置
- API 密钥是否正确
- 网络环境

---

## 📱 移动端适配

确保响应式设计：

```typescript
// 在组件中
const isMobile = typeof window !== 'undefined' 
  ? window.innerWidth < 768 
  : false;
```

Vercel 会自动优化：
- 图片压缩
- 代码分割
- 缓存策略

---

## 🚀 性能优化

### Vercel 自动提供：

1. **CDN 加速**
   - 全球边缘节点
   - 自动缓存静态资源

2. **图片优化**
   - Next.js Image 组件
   - 自动 WebP 转换
   - 懒加载

3. **代码分割**
   - 自动代码分割
   - 按需加载

4. **压缩**
   - Gzip 压缩
   - Brotli 压缩

---

## 📊 监控和分析

### 启用 Analytics

1. 进入项目设置
2. Analytics → Enable
3. 查看访问数据：
   - 页面浏览量
   - 访客来源
   - 设备类型

### 性能监控

```typescript
// 在 _app.tsx 添加
export function reportWebVitals(metric) {
  console.log(metric);
}
```

---

## 🔒 安全配置

### 添加安全头

在 `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

---

## ✅ 部署检查清单

- [ ] 代码已提交到 Git
- [ ] 本地构建成功（`npm run build`）
- [ ] 环境变量已配置（如果需要）
- [ ] vercel.json 已配置（如果需要）
- [ ] 已登录 Vercel
- [ ] 项目已导入到 Vercel
- [ ] 部署成功
- [ ] 生产环境 URL 可访问
- [ ] 功能测试通过
- [ ] 响应式设计正常

---

## 🎉 完成！

部署完成后，你会得到：
- ✅ 生产环境 URL
- ✅ 自动部署流程
- ✅ CDN 加速
- ✅ HTTPS 加密
- ✅ 性能优化
- ✅ 分析数据

---

## 📚 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)

---

**享受你的在线应用！** 🚀

