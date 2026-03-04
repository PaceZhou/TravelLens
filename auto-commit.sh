#!/bin/bash

# TravelLens 自动提交脚本
# 使用方法: ./auto-commit.sh "提交信息"

cd /Users/pacezhou/Documents/MyCode/TravelLens-Project

# 添加所有更改
git add .

# 提交
if [ -z "$1" ]; then
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M')"
else
  git commit -m "$1"
fi

# 推送到 GitHub
git push origin main

echo "✅ 已推送到 GitHub"
