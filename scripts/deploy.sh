#!/bin/bash

# WhatsApp API 部署脚本

echo "🚀 部署 WhatsApp Business API..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查docker-compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose 未安装，请先安装 docker-compose"
    exit 1
fi

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，从示例文件创建..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请编辑配置您的 WhatsApp API 凭据"
    echo "❌ 请配置 .env 文件后重新运行部署脚本"
    exit 1
fi

# 创建logs目录
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo "📁 已创建 logs 目录"
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up --build -d

# 检查服务状态
echo "🔍 检查服务状态..."
sleep 10
docker-compose ps

# 显示日志
echo "📋 显示服务日志..."
docker-compose logs --tail=50

echo "✅ 部署完成！"
echo "📍 API 地址: http://localhost:3000"
echo "🏥 健康检查: http://localhost:3000/health"
echo "📖 查看完整日志: docker-compose logs -f"