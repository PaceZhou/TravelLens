## 后端目录结构 (Node.js + NestJS)

```
backend/
├── src/
│   ├── main.ts                         # 应用入口
│   ├── app.module.ts                   # 根模块
│   │
│   ├── config/
│   │   ├── database.config.ts          # 数据库配置
│   │   ├── redis.config.ts             # Redis 配置
│   │   └── app.config.ts               # 应用配置
│   │
│   ├── modules/
│   │   ├── spot/
│   │   │   ├── spot.module.ts
│   │   │   ├── spot.controller.ts
│   │   │   ├── spot.service.ts
│   │   │   ├── spot.repository.ts
│   │   │   ├── entities/
│   │   │   │   ├── spot.entity.ts
│   │   │   │   ├── photo-spot.entity.ts
│   │   │   │   └── spot-food.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-spot.dto.ts
│   │   │       └── nearby-spots.dto.ts
│   │   │
│   │   ├── user/
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       └── update-user.dto.ts
│   │   │
│   │   ├── community/
│   │   │   ├── community.module.ts
│   │   │   ├── post.controller.ts
│   │   │   ├── post.service.ts
│   │   │   ├── post.repository.ts
│   │   │   ├── entities/
│   │   │   │   ├── post.entity.ts
│   │   │   │   └── comment.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-post.dto.ts
│   │   │       └── post-list.dto.ts
│   │   │
│   │   └── auth/
│   │       ├── auth.module.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── strategies/
│   │       │   ├── jwt.strategy.ts
│   │       │   └── local.strategy.ts
│   │       └── guards/
│   │           └── jwt-auth.guard.ts
│   │
│   ├── common/
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── decorators/
│   │   │   └── user.decorator.ts
│   │   └── utils/
│   │       ├── postgis.util.ts         # PostGIS 工具
│   │       └── distance.util.ts        # 距离计算
│   │
│   └── database/
│       ├── migrations/                 # 数据库迁移
│       └── seeds/                      # 初始数据
│
├── prisma/
│   ├── schema.prisma                   # Prisma Schema
│   └── migrations/
│
├── test/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── .eslintrc.js
├── tsconfig.json
├── package.json
└── README.md
```
