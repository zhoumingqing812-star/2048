#!/bin/bash

# 2048 AI Game 启动脚本
# 此脚本用于安装依赖并启动开发服务器

echo "================================"
echo "  2048 AI Game 启动中..."
echo "================================"
echo ""

# 检查是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到 Node.js，请先安装 Node.js (https://nodejs.org/)"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装项目依赖..."
    echo "================================"
    npm install
    echo ""
    echo "✓ 依赖安装完成"
    echo ""
fi

# 启动开发服务器
echo "正在启动开发服务器..."
echo "================================"
echo ""
echo "项目将在浏览器中自动打开："
echo "- 本地地址: http://localhost:5173"
echo "- 网络地址: http://[your-ip]:5173"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"
echo ""

npm run dev
