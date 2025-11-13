#!/bin/bash

# 自动同步共享代码脚本
# 当 Web 端代码更新时，自动同步到 iOS 端

set -e

echo "🔄 开始同步共享代码..."

# 1. 构建共享包
echo "📦 构建 shared-core..."
cd "$(dirname "$0")/../shared-core"
npm run build

# 2. 更新 mobile 依赖
echo "📱 更新 mobile 依赖..."
cd ../mobile
npm install

echo "✅ 同步完成！"
echo ""
echo "现在你可以："
echo "  - Web: npm run dev (自动使用最新共享代码)"
echo "  - iOS: npm run ios (使用相同的共享代码)"
