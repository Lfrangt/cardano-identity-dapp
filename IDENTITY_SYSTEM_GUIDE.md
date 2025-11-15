# 身份管理系统使用指南

## 概述

CardanoID 的身份管理系统让您可以在 Cardano 区块链上创建和管理完整的去中心化身份档案。

## 功能特性

### ✨ 已实现功能

1. **个人档案创建**
   - 显示名称和个人简介
   - 位置和个人网站
   - 兴趣标签管理
   - 头像和封面图（规划中）

2. **技能管理**
   - 添加和管理技能
   - 四个技能等级：初学者、中级、高级、专家
   - 技能进度可视化
   - 技能背书计数

3. **成就管理**
   - 记录个人成就和里程碑
   - 自定义成就图标
   - 添加日期和证明链接
   - 成就验证状态

4. **档案展示**
   - 精美的档案卡片设计
   - 统计数据展示
   - 钱包地址显示
   - 验证徽章

5. **数据存储**
   - 本地存储（LocalStorage）
   - IPFS 上传（演示模式）
   - 链上存储（规划中）

### 🚧 规划中功能

- **社交连接**：与其他用户建立连接
- **技能背书**：为他人的技能提供背书
- **声誉系统**：基于背书的声誉分数
- **隐私控制**：选择性公开档案信息
- **NFT 铸造**：将档案铸造为 NFT
- **跨平台身份**：在其他 DApp 中使用身份

## 使用流程

### 1. 连接钱包

首先在主应用页面连接您的 Cardano 钱包（或使用模拟连接）。

### 2. 创建身份档案

1. 点击"身份管理"标签
2. 填写基本信息：
   - 显示名称（必填）
   - 个人简介（必填）
   - 位置（可选）
   - 个人网站（可选）
3. 添加兴趣标签
4. 点击"创建档案"

### 3. 添加技能

1. 在档案概览页面，点击"管理"进入技能管理
2. 点击"+ 添加技能"
3. 输入技能名称（如：Cardano, React, Plutus）
4. 选择技能水平
5. 点击"添加"

您可以随时调整技能等级或删除技能。

### 4. 添加成就

1. 在档案概览页面，点击"管理"进入成就管理
2. 点击"+ 添加成就"
3. 填写成就信息：
   - 标题（必填）
   - 描述（必填）
   - 日期
   - 图标
   - 证明链接（可选）
4. 点击"添加"

### 5. 查看和编辑档案

- 点击"📋 概览"查看完整档案
- 点击"编辑档案"修改基本信息
- 在技能和成就页面管理相关内容

## 技术架构

### 数据类型

```typescript
// 身份档案
interface IdentityProfile {
  id: string
  walletAddress: string
  displayName: string
  bio: string
  skills: Skill[]
  achievements: Achievement[]
  interests: string[]
  // ... 其他字段
}

// 技能
interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  endorsements: number
  verified: boolean
}

// 成就
interface Achievement {
  id: string
  title: string
  description: string
  date: string
  icon: string
  verified: boolean
  proofUrl?: string
}
```

### 核心服务

```typescript
// 档案管理服务
import {
  createProfile,
  saveProfileLocally,
  getProfileByWallet,
  updateProfile,
  updateSkills,
  updateAchievements,
  uploadProfileToIPFS
} from '@/lib/services/identity-profile'
```

### 组件结构

```
components/identity/
├── IdentityManager.tsx      # 主管理组件
├── ProfileForm.tsx          # 档案表单
├── ProfileCard.tsx          # 档案展示卡片
├── SkillsManager.tsx        # 技能管理
├── AchievementsManager.tsx  # 成就管理
└── PhotoUpload.tsx          # 照片上传
```

## 数据存储

### 本地存储

档案数据保存在浏览器的 LocalStorage 中：

```javascript
// 存储键
const STORAGE_KEY = 'identity_profiles'
const CURRENT_PROFILE_KEY = 'current_profile'

// 数据结构
{
  "identity_profiles": [
    {
      "id": "profile_1234567890",
      "walletAddress": "addr_...",
      "displayName": "张三",
      // ... 其他数据
    }
  ],
  "current_profile": "profile_1234567890"
}
```

### IPFS 上传（规划中）

档案可以上传到 IPFS 进行去中心化存储：

1. 准备档案数据（移除敏感信息）
2. 上传到 IPFS（使用 NFT.Storage 或 Pinata）
3. 获取 CID（内容标识符）
4. 将 CID 保存到档案

### 链上存储（规划中）

将档案 IPFS CID 存储在 Cardano 区块链上：

1. 创建 Policy Script
2. 铸造身份 NFT
3. 附加档案 Metadata（包含 IPFS CID）
4. 提交交易到链上

## 最佳实践

### 1. 档案完整性

- 填写完整的个人信息
- 添加真实的技能和成就
- 提供证明链接增强可信度

### 2. 技能管理

- 准确评估技能水平
- 定期更新技能列表
- 寻求他人的技能背书

### 3. 成就记录

- 记录重要的里程碑
- 添加时间和证明
- 使用合适的图标

### 4. 隐私保护

- 不要分享敏感个人信息
- 谨慎添加联系方式
- 了解公开信息的范围

## 故障排除

### 档案未保存

**原因**：浏览器 LocalStorage 被禁用或已满

**解决**：
1. 检查浏览器设置，启用 LocalStorage
2. 清除浏览器缓存释放空间
3. 使用隐私模式可能导致数据丢失

### 找不到档案

**原因**：使用了不同的钱包地址

**解决**：
1. 确保使用创建档案时的钱包地址
2. 检查是否切换了钱包账户
3. 档案与钱包地址绑定

### 图标显示异常

**原因**：浏览器不支持某些 Emoji

**解决**：
1. 更新浏览器到最新版本
2. 选择其他图标
3. 使用通用的图标

## 开发者指南

### 添加新字段

1. 更新类型定义 (`lib/types/identity.ts`)
2. 修改表单组件
3. 更新存储服务
4. 测试数据迁移

### 自定义样式

所有组件使用 Tailwind CSS，可以通过修改 className 自定义样式：

```tsx
// 示例：修改卡片背景
<div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10">
  {/* 内容 */}
</div>
```

### 扩展功能

```typescript
// 示例：添加社交链接
export interface SocialLink {
  platform: string
  url: string
  verified: boolean
}

// 在 IdentityProfile 中添加
interface IdentityProfile {
  // ... 其他字段
  socialLinks: SocialLink[]
}
```

## 未来路线图

### 短期（1-2 月）

- [ ] 头像和封面图上传
- [ ] 社交链接管理
- [ ] 档案导出/导入
- [ ] 真实 IPFS 上传集成

### 中期（3-6 月）

- [ ] 技能背书系统
- [ ] 社交连接功能
- [ ] 声誉分数计算
- [ ] NFT 铸造集成

### 长期（6+ 月）

- [ ] 跨平台身份验证
- [ ] 去中心化身份标准（DID）
- [ ] 隐私增强技术
- [ ] 移动端应用

## 支持与反馈

如有问题或建议，请：

1. 查看本指南
2. 检查控制台日志
3. 提交 Issue 到 GitHub
4. 加入社区讨论

---

**构建于 Cardano 区块链 | 为去中心化未来赋能**

