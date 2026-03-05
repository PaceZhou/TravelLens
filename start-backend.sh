#!/bin/bash
echo "🥭 启动 MangoGo 后端..."

# 检查PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL 未安装，请先安装 PostgreSQL"
    exit 1
fi

# 创建数据库
psql -U postgres -c "CREATE DATABASE mangogo;" 2>/dev/null || echo "数据库已存在"

# 安装依赖
cd backend
npm install

# 启动后端
npm run start:dev
