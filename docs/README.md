# TravelLens 旅拍指南

> 地图优先的旅行出片指南平台

## 🌟 项目愿景

TravelLens 不仅告诉你"去哪玩"，更告诉你"怎么拍好看"、"去哪吃特色美食"、"距离多远"。

**核心差异化**:
- 📍 地图优先交互
- 📷 精准拍照机位指南
- 🍜 周边美食推荐
- 📱 跨平台支持 (iOS/Android/Web/Desktop)

---

## 🏗️ 技术架构

```
React + Capacitor (前端) → API Gateway → NestJS (后端) → PostgreSQL + PostGIS
```

**核心技术**:
- **前端**: React 18 + TypeScript + Vite
- **跨平台**: Capacitor 5.x
- **后端**: Node.js 18+ / NestJS
- **数据库**: PostgreSQL 14+ / PostGIS
- **缓存**: Redis 6+
- **地图**: 高德地图 / HMS Core

**平台支持**:
- 🌐 Web (Vercel/Netlify)
- 📱 iOS (App Store)
- 🤖 Android (Google Play)
- 🔶 鸿蒙 (华为应用市场)

---

## 📂 项目结构

```
TravelLens/
├── frontend/          # Flutter 应用
├── backend/           # NestJS 后端
├── docs/              # 项目文档
│   ├── PROJECT_ARCHITECTURE.md
│   ├── DATABASE_AND_MODULES.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── TEAM_AND_RISKS.md
│   ├── PROJECT_STRUCTURE.md
│   ├── BACKEND_STRUCTURE.md
│   ├── QUICK_START.md
│   └── WORKFLOW_SUMMARY.md
└── README.md
```

---

## 🚀 快速开始

### 后端

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev
```

### 前端

```bash
cd frontend
flutter pub get
flutter run
```

详细步骤见 [QUICK_START.md](./QUICK_START.md)

---

## 📖 文档导航

| 文档 | 说明 |
|------|------|
| [多端方案总结](./MULTI_PLATFORM_SUMMARY.md) | **⭐ 多端技术方案概览** |
| [架构设计](./PROJECT_ARCHITECTURE.md) | 技术架构全景图 |
| [React 项目结构](./REACT_PROJECT_STRUCTURE.md) | Web 端目录结构 |
| [数据库设计](./DATABASE_AND_MODULES.md) | 表结构 + 核心模块 |
| [部署指南](./DEPLOYMENT_GUIDE.md) | Web/iOS/Android 部署 |
| [鸿蒙部署](./HARMONY_DEPLOYMENT.md) | 鸿蒙适配方案 |
| [开发流程](./DEVELOPMENT_WORKFLOW.md) | Git 工作流 + 阶段划分 |
| [团队协作](./TEAM_AND_RISKS.md) | 分工 + 风险评估 |
| [快速启动](./QUICK_START.md) | 环境配置 + 初始化 |
| [工作流程](./WORKFLOW_SUMMARY.md) | 完整流程总结 |

---

## 👥 团队

- **总指挥**: @BB
- **前端团队**: 6人
- **后端团队**: 4人
- **产品设计**: 3人
- **测试团队**: 2人

---

## 📅 开发计划

- **Week 1-2**: 基础架构搭建
- **Week 3-5**: 核心功能开发
- **Week 6-7**: 社区功能开发
- **Week 8**: 测试优化上线

---

## 📄 License

MIT
