#!/bin/bash

echo "欢迎使用魅恋奇趣时尚电商应用！"
echo "================================"
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装。请先安装 Node.js 16.0 或更高版本。"
    exit 1
fi

echo "正在检查 Node.js 版本..."
node --version
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装项目依赖..."
    npm install
    echo ""
fi

echo "正在启动开发服务器..."
echo "应用将在 http://localhost:3000 运行"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"
echo ""

npm run dev