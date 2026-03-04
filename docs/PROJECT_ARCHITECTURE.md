# TravelLens - 完整项目架构设计

## 一、项目概览

**项目定位**: 地图优先的旅行出片指南平台  
**核心差异化**: 精准机位 + 距离感知 + 社区分享  
**目标平台**: iOS / Android / Web / Desktop

---

## 二、技术架构全景图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
├─────────────────────────────────────────────────────────────┤
│  Flutter App (iOS/Android)  │  Web App (React)  │  Desktop  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway 层                          │
├─────────────────────────────────────────────────────────────┤
│  Nginx / Kong  (负载均衡 + 限流 + 鉴权)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      业务服务层                              │
├─────────────────────────────────────────────────────────────┤
│  Spot Service  │  User Service  │  Community Service        │
│  (景点服务)    │  (用户服务)    │  (社区服务)               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据存储层                              │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL+PostGIS  │  Redis  │  OSS (图片存储)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、前端架构 (Flutter)

### 3.1 目录结构

```
lib/
├── main.dart
├── app/
│   ├── routes/              # 路由配置
│   ├── theme/               # 主题配置
│   └── config/              # 全局配置
├── core/
│   ├── network/             # 网络请求封装
│   ├── storage/             # 本地存储
│   ├── utils/               # 工具类
│   └── constants/           # 常量定义
├── data/
│   ├── models/              # 数据模型
│   ├── repositories/        # 数据仓库
│   └── providers/           # API 提供者
├── domain/
│   ├── entities/            # 业务实体
│   └── usecases/            # 业务用例
└── presentation/
    ├── pages/               # 页面
    │   ├── map/             # 地图页
    │   ├── spot_detail/     # 景点详情
    │   ├── community/       # 社区页
    │   └── profile/         # 个人中心
    ├── widgets/             # 通用组件
    └── controllers/         # 状态管理 (GetX/Riverpod)
```

### 3.2 核心技术栈

- **状态管理**: Riverpod / GetX
- **地图**: google_maps_flutter / amap_flutter_map
- **网络**: Dio + Retrofit
- **本地存储**: Hive / SharedPreferences
- **图片加载**: cached_network_image
- **路由**: go_router
- **国际化**: flutter_localizations

---

## 四、后端架构

### 4.1 技术选型

**推荐方案**: Node.js + Express / Nest.js

**理由**:
- 团队熟悉度高
- 生态丰富 (PostGIS 驱动完善)
- 适合快速迭代

### 4.2 目录结构

```
backend/
├── src/
│   ├── config/              # 配置文件
│   ├── modules/
│   │   ├── spot/            # 景点模块
│   │   │   ├── spot.controller.ts
│   │   │   ├── spot.service.ts
│   │   │   ├── spot.repository.ts
│   │   │   └── spot.entity.ts
│   │   ├── user/            # 用户模块
│   │   ├── community/       # 社区模块
│   │   └── auth/            # 认证模块
│   ├── common/
│   │   ├── filters/         # 异常过滤器
│   │   ├── guards/          # 守卫
│   │   ├── interceptors/    # 拦截器
│   │   └── pipes/           # 管道
│   └── main.ts
├── prisma/                  # 数据库 Schema
│   └── schema.prisma
├── test/
└── package.json
```
