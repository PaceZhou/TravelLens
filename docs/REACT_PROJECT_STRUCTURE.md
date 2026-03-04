## 四、项目结构 (React + Capacitor)

```
TravelLens/
├── web/                              # React Web 应用
│   ├── src/
│   │   ├── main.tsx                  # 入口文件
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── MapExplore/           # 地图探索
│   │   │   ├── SpotDetail/           # 景点详情
│   │   │   ├── Community/            # 社区
│   │   │   └── Profile/              # 个人中心
│   │   ├── components/
│   │   │   ├── Map/
│   │   │   │   ├── MapContainer.tsx
│   │   │   │   ├── SpotMarker.tsx
│   │   │   │   └── ClusterMarker.tsx
│   │   │   ├── SpotCard/
│   │   │   └── PostCard/
│   │   ├── services/
│   │   │   ├── api.service.ts        # API 封装
│   │   │   ├── map.service.ts        # 地图服务
│   │   │   └── storage.service.ts    # 本地存储
│   │   ├── stores/
│   │   │   ├── spotStore.ts          # 景点状态
│   │   │   ├── userStore.ts          # 用户状态
│   │   │   └── mapStore.ts           # 地图状态
│   │   ├── hooks/
│   │   │   ├── useGeolocation.ts     # 定位 Hook
│   │   │   ├── useNearbySpots.ts     # 附近景点
│   │   │   └── useInfiniteScroll.ts  # 无限滚动
│   │   ├── utils/
│   │   │   ├── distance.ts           # 距离计算
│   │   │   └── format.ts             # 格式化
│   │   └── types/
│   │       ├── spot.ts
│   │       ├── post.ts
│   │       └── user.ts
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── ios/                              # iOS 项目 (Capacitor 生成)
├── android/                          # Android 项目 (Capacitor 生成)
├── harmony/                          # 鸿蒙项目 (手动配置)
│
├── backend/                          # Node.js 后端 (保持不变)
└── README.md
```

---

## 五、核心依赖

### package.json

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@capacitor/core": "^5.5.0",
    "@capacitor/ios": "^5.5.0",
    "@capacitor/android": "^5.5.0",
    "@capacitor/geolocation": "^5.0.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.3.0",
    "@capacitor/cli": "^5.5.0"
  }
}
```
