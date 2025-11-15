#!/bin/bash

# Cardano Identity DApp - Vercel 部署脚本
# 使用方法: ./deploy-vercel.sh

echo "🚀 Cardano Identity DApp 部署脚本"
echo "=================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请访问 https://nodejs.org 安装 Node.js"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 检查 Git 状态
echo "📋 检查 Git 状态..."
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  警告: 有未提交的更改"
    echo ""
    read -p "是否要提交这些更改? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📝 提交更改..."
        git add -A
        read -p "请输入提交信息: " commit_message
        git commit -m "$commit_message"
        echo "✅ 更改已提交"
    fi
fi

# 推送到 GitHub
echo ""
echo "📤 推送到 GitHub..."
if git push origin main; then
    echo "✅ 代码已推送到 GitHub"
else
    echo "❌ 推送失败，请检查网络连接和 Git 配置"
    exit 1
fi

# 检查是否安装了 Vercel CLI
echo ""
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI 未安装"
    read -p "是否要安装 Vercel CLI? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 安装 Vercel CLI..."
        npm install -g vercel
    else
        echo ""
        echo "✅ 代码已推送到 GitHub"
        echo ""
        echo "🌐 现在你可以："
        echo "1. 访问 https://vercel.com"
        echo "2. 使用 GitHub 账号登录"
        echo "3. 点击 'New Project'"
        echo "4. 选择 'cardano-identity-dapp' 仓库"
        echo "5. 点击 'Deploy'"
        echo ""
        echo "📖 详细步骤请查看: DEPLOYMENT_GUIDE.md"
        exit 0
    fi
fi

# Vercel 部署
echo ""
echo "🚀 开始部署到 Vercel..."
echo ""

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请登录 Vercel..."
    vercel login
fi

echo ""
read -p "部署到生产环境? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 部署到生产环境..."
    vercel --prod
else
    echo "🔍 创建预览部署..."
    vercel
fi

echo ""
echo "=================================="
echo "✨ 部署完成！"
echo ""
echo "📝 下一步："
echo "1. 访问 Vercel 提供的 URL"
echo "2. 测试所有功能"
echo "3. 配置自定义域名（可选）"
echo ""
echo "📖 更多信息请查看: DEPLOYMENT_GUIDE.md"
echo "=================================="
