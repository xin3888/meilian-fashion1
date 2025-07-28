#!/bin/bash

# WhatsApp API 启动脚本

echo "🚀 启动 WhatsApp Business API..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18 或更高版本"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查.env文件是否存在
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，从示例文件创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑配置您的 WhatsApp API 凭据"
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
fi

# 创建logs目录
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo "📁 已创建 logs 目录"
fi

# 启动服务器
echo "🌟 启动服务器..."
if [ "$1" = "dev" ]; then
    echo "🔧 开发模式启动"
    npm run dev
else
    echo "🚀 生产模式启动"
    npm start
fi