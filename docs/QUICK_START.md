# TravelLens - 快速启动指南

## 一、环境准备

### 1.1 必需工具

**前端开发**:
- Flutter SDK >= 3.16.0
- Dart >= 3.2.0
- Android Studio / Xcode
- VS Code + Flutter 插件

**后端开发**:
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- Redis >= 6.0
- Docker (可选)

---

## 二、项目初始化

### 2.1 克隆仓库

```bash
git clone https://github.com/your-org/TravelLens.git
cd TravelLens
```

### 2.2 后端初始化

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入数据库连接信息

# 启用 PostGIS
psql -U postgres -d travellens -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# 运行数据库迁移
npx prisma migrate dev

# 导入初始数据
npm run seed

# 启动开发服务器
npm run start:dev
```

### 2.3 前端初始化

```bash
cd frontend

# 安装依赖
flutter pub get

# 生成代码
flutter pub run build_runner build

# 运行应用
flutter run
```

---

## 三、开发规范

### 3.1 代码提交规范

使用 Conventional Commits:

```
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

**示例**:
```bash
git commit -m "feat(map): 添加景点聚合功能"
git commit -m "fix(api): 修复距离计算错误"
```

### 3.2 分支管理

```bash
# 创建功能分支
git checkout -b feature/map-clustering

# 开发完成后
git add .
git commit -m "feat(map): 实现地图标记聚合"
git push origin feature/map-clustering

# 在 GitHub 创建 Pull Request
```

---

## 四、API 测试

### 4.1 获取附近景点

```bash
curl -X GET "http://localhost:3000/api/v1/spots/nearby?lat=39.916&lng=116.397&radius=5000"
```

### 4.2 获取景点详情

```bash
curl -X GET "http://localhost:3000/api/v1/spots/1"
```

### 4.3 创建帖子

```bash
curl -X POST "http://localhost:3000/api/v1/posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "故宫一日游",
    "content": "超级美！",
    "spot_id": 1,
    "images": ["url1", "url2"]
  }'
```
