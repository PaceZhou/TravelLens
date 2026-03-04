# TravelLens - 前端优先开发计划

## 一、开发策略

**核心思路**: 前端先做 Demo → 后端根据前端功能扩展

**优势**:
- ✅ 快速验证产品形态
- ✅ 视觉效果优先呈现
- ✅ 便于测试和迭代
- ✅ 后端按需开发

---

## 二、前端 Demo 开发计划

### Week 1: 基础框架 + 地图

**目标**: 搭建项目 + 地图展示

```bash
# Day 1-2: 项目初始化
npm create vite@latest web -- --template react-ts
cd web
npm install react-router-dom zustand @tanstack/react-query
npm install tailwindcss framer-motion lucide-react
npm install leaflet react-leaflet

# Day 3-5: 地图模块
- 集成 Leaflet 地图
- Mock 景点数据
- 标记点展示
- 底部卡片滚动
```

**交付物**: 可交互的地图页面

---

### Week 2: 盲盒功能 (核心亮点)

**目标**: 完成盲盒抽取 Demo

```bash
# Day 1-2: UI 组件
- 盲盒按钮
- 弹窗组件
- 3D 动画效果

# Day 3-4: 抽取逻辑
- Mock 算法 (前端随机)
- 结果展示
- 推荐理由生成

# Day 5: 优化
- 动画流畅度
- 交互细节
```

**交付物**: 完整的盲盒功能 Demo

---

### Week 3: 景点详情 + 社区

**目标**: 完善核心页面

```bash
# Day 1-3: 景点详情
- 图片轮播
- Tab 切换
- 机位展示
- 美食推荐

# Day 4-5: 社区瀑布流
- 双列布局
- 图片懒加载
- 点赞交互
```

**交付物**: 完整的前端 Demo

---

## 三、Mock 数据结构

### spots.mock.ts

```typescript
export const MOCK_SPOTS = [
  {
    id: 1,
    title: "故宫博物院",
    location: { lat: 39.916, lng: 116.397 },
    distance: 2.1,
    tags: ["历史", "建筑"],
    coverImage: "https://...",
    bestTime: "春秋季节",
    reason: "根据你的历史文化偏好，这里最适合你"
  }
];
```

---

## 四、后端跟进计划

### Week 4: 后端基础

**根据前端 Demo 确定的功能开发**:

```bash
# 1. 初始化 NestJS
nest new backend

# 2. 数据库设计
- 根据前端数据结构设计表
- 创建 Prisma Schema

# 3. 核心 API
POST /api/v1/blind-box/draw
GET /api/v1/spots/nearby
GET /api/v1/spots/:id
```

---

## 五、前后端联调

### Week 5: 集成测试

```bash
# 1. 替换 Mock 数据
- 前端接入真实 API
- 错误处理

# 2. 盲盒算法优化
- 后端实现评分系统
- 前端展示优化

# 3. 性能优化
- 图片 CDN
- API 缓存
```

---

## 六、立即可启动的任务

### @Dan - 前端开发

```bash
# 今天就可以开始
cd /Users/pacezhou/Documents/MyCode
npm create vite@latest TravelLens-web -- --template react-ts
cd TravelLens-web
npm install
npm run dev
```

### @Arc - 准备 Mock 数据

创建 `src/mocks/spots.ts` 包含:
- 10 个北京景点
- 完整的字段结构
- 图片 URL

### @Story - 撰写推荐理由模板

为盲盒功能准备 20 条推荐理由模板。
