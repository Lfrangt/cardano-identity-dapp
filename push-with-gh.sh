#!/bin/bash

echo "🚀 使用 GitHub CLI 推送代码..."
echo ""

# 检查 gh 是否已安装
if ! command -v gh &> /dev/null; then
    echo "📦 安装 GitHub CLI..."
    brew install gh
fi

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo "🔐 请登录 GitHub..."
    gh auth login
fi

# 推送代码
echo "📤 推送到 GitHub..."
git push origin main

echo ""
echo "✅ 推送成功！"
echo ""
echo "📱 下一步："
echo "1. 访问 https://vercel.com"
echo "2. 用 GitHub 登录"
echo "3. Import Project → 选择 cardano-identity-dapp"
echo "4. 点击 Deploy"
echo ""

