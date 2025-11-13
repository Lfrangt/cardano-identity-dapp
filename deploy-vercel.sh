#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🚀 CardanoID - Vercel 部署脚本                          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1: 提交代码到 Git"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 显示状态
echo "📋 当前 Git 状态："
git status --short

echo ""
read -p "是否提交这些更改到 Git？(y/n): " commit_changes

if [ "$commit_changes" = "y" ]; then
    echo ""
    echo "📝 添加文件..."
    git add .
    
    echo ""
    read -p "输入提交信息（直接回车使用默认）: " commit_msg
    
    if [ -z "$commit_msg" ]; then
        commit_msg="🚀 部署到 Vercel - $(date '+%Y-%m-%d %H:%M')"
    fi
    
    echo ""
    echo "💾 提交中..."
    git commit -m "$commit_msg"
    
    echo ""
    echo "🔄 推送到 GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 代码已成功推送到 GitHub${NC}"
    else
        echo "❌ 推送失败，请检查 Git 配置"
        exit 1
    fi
else
    echo "⚠️  跳过 Git 提交"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Step 2: 检查 Vercel CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查 Vercel CLI 是否安装
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI 未安装"
    read -p "是否现在安装？(y/n): " install_vercel
    
    if [ "$install_vercel" = "y" ]; then
        echo "📥 安装 Vercel CLI..."
        npm install -g vercel
    else
        echo "❌ 需要 Vercel CLI 才能部署"
        echo "手动安装: npm install -g vercel"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Vercel CLI 已安装${NC}"
fi

# 检查是否已登录
echo ""
echo "🔐 检查 Vercel 登录状态..."
vercel whoami &> /dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  未登录 Vercel"
    echo ""
    echo "正在打开登录页面..."
    vercel login
else
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✅ 已登录: $VERCEL_USER${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Step 3: 部署到 Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "请选择部署类型："
echo ""
echo "  1. 🧪 预览部署（Preview）- 用于测试"
echo "  2. 🚀 生产部署（Production）- 正式上线"
echo ""
read -p "选择 (1 或 2): " deploy_type

echo ""
if [ "$deploy_type" = "1" ]; then
    echo -e "${BLUE}🧪 开始预览部署...${NC}"
    vercel
elif [ "$deploy_type" = "2" ]; then
    echo -e "${BLUE}🚀 开始生产部署...${NC}"
    vercel --prod
else
    echo "❌ 无效选择"
    exit 1
fi

# 检查部署结果
if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ 部署成功！${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 你的应用已成功部署到 Vercel！"
    echo ""
    echo "📝 下一步："
    echo "  • 访问上面显示的 URL 查看你的应用"
    echo "  • 在 Vercel 仪表板查看部署详情"
    echo "  • 配置自定义域名（可选）"
    echo "  • 设置环境变量（如果需要）"
    echo ""
    echo "🔗 Vercel 仪表板: https://vercel.com/dashboard"
    echo ""
else
    echo ""
    echo "❌ 部署失败"
    echo ""
    echo "常见问题："
    echo "  • 检查网络连接"
    echo "  • 确保 Git 仓库已推送"
    echo "  • 查看 Vercel 日志"
    echo ""
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

