---
title: TravelLens 项目结构
tags: [项目管理, 架构]
created: 2026-03-04
---

# TravelLens 项目目录结构

## 📁 根目录

```
TravelLens-Project/
├── frontend/          # 前端代码 (React + Vite)
├── backend/           # 后端代码 (NestJS)
├── content/           # 内容资源 (景点数据 + 图片)
├── docs/              # 项目文档
└── design/            # 设计资源
```

---

## 🌐 Frontend (前端)

```
frontend/
├── src/
│   ├── pages/              # 页面组件
│   │   ├── MapExplore/     # 地图探索页
│   │   ├── SpotDetail/     # 景点详情页
│   │   ├── Community/      # 社区页
│   │   └── Profile/        # 个人中心
│   ├── components/         # 通用组件
│   │   ├── Map/            # 地图组件
│   │   ├── BlindBox/       # 盲盒组件
│   │   ├── SpotCard/       # 景点卡片
│   │   └── PostCard/       # 帖子卡片
│   ├── services/           # API 服务
│   │   ├── api.service.ts
│   │   ├── map.service.ts
│   │   └── auth.service.ts
│   ├── stores/             # 状态管理 (Zustand)
│   │   ├── spotStore.ts
│   │   ├── userStore.ts
│   │   └── mapStore.ts
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useGeolocation.ts
│   │   └── useNearbySpots.ts
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型
│   └── assets/             # 静态资源
└── public/                 # 公共资源
```

---

## 🔧 Backend (后端)

```
backend/
├── src/
│   ├── modules/            # 业务模块
│   │   ├── spot/           # 景点模块
│   │   ├── user/           # 用户模块
│   │   ├── community/      # 社区模块
│   │   ├── blind-box/      # 盲盒模块
│   │   └── auth/           # 认证模块
│   ├── common/             # 公共模块
│   │   ├── filters/        # 异常过滤器
│   │   ├── guards/         # 守卫
│   │   └── interceptors/   # 拦截器
│   ├── config/             # 配置文件
│   └── database/           # 数据库相关
└── prisma/                 # Prisma Schema
```

---

## 📝 Content (内容)

```
content/
├── spots/                  # 景点数据
│   ├── beijing/            # 按城市分类
│   ├── shanghai/
│   └── templates/          # Excel 模板
├── images/                 # 图片资源
│   ├── covers/             # 封面图
│   ├── photos/             # 机位图
│   └── foods/              # 美食图
└── templates/              # 内容模板
    ├── spot_template.xlsx
    └── import_script.js
```

---

## 📚 Docs (文档)

```
docs/
├── architecture/           # 架构文档
├── api/                    # API 文档
└── guides/                 # 开发指南
```

---

## 🎨 Design (设计)

```
design/
├── figma/                  # Figma 设计稿
└── assets/                 # 设计资源
```
