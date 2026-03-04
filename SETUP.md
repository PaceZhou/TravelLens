# 🛠️ 开发环境配置指南

## GitHub 仓库

**地址**: https://github.com/PaceZhou/TravelLens

---

## 📦 克隆项目

```bash
git clone https://github.com/PaceZhou/TravelLens.git
cd TravelLens
```

---

## 🚀 前端环境

```bash
cd frontend
npm install
npm run dev
```

访问: http://localhost:5173

---

## 🔧 后端环境

```bash
cd backend
npm install

# 配置数据库
createdb travellens
psql -d travellens -c "CREATE EXTENSION postgis;"

# 启动
npm run start:dev
```

访问: http://localhost:3000

---

## 📤 自动提交

```bash
# 使用自动提交脚本
./auto-commit.sh "feat: 添加地图功能"

# 或手动提交
git add .
git commit -m "提交信息"
git push
```

---

## 🔄 每小时更新

团队成员每小时提交一次代码，确保进度同步。
