### 4.3 数据库设计优化

#### 核心表结构

**1. spots (景点表)**
```sql
CREATE TABLE spots (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  subtitle VARCHAR(200),
  location_name VARCHAR(100),
  city VARCHAR(50),
  country VARCHAR(50),
  geom GEOMETRY(Point, 4326),
  tags JSONB,
  cover_image TEXT,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_spots_geom ON spots USING GIST(geom);
CREATE INDEX idx_spots_city ON spots(city);
```

**2. photo_spots (机位表)**
```sql
CREATE TABLE photo_spots (
  id BIGSERIAL PRIMARY KEY,
  spot_id BIGINT REFERENCES spots(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  best_time VARCHAR(100),
  best_season VARCHAR(50),
  pose_guide TEXT,
  equipment_tips TEXT,
  difficulty VARCHAR(20),
  geom GEOMETRY(Point, 4326),
  images JSONB,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**3. spot_foods (美食表)**
```sql
CREATE TABLE spot_foods (
  id BIGSERIAL PRIMARY KEY,
  spot_id BIGINT REFERENCES spots(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  price_range VARCHAR(20),
  address TEXT,
  geom GEOMETRY(Point, 4326),
  images JSONB,
  rating DECIMAL(2,1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**4. users (用户表)**
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  avatar TEXT,
  bio TEXT,
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  post_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**5. posts (帖子表)**
```sql
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  spot_id BIGINT REFERENCES spots(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  images JSONB,
  tags JSONB,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_spot ON posts(spot_id);
```

---

## 五、核心功能模块设计

### 5.1 地图探索模块

**功能点**:
- 实时定位用户位置
- 显示附近景点标记 (聚合显示)
- 地图拖动时动态加载新区域景点
- 点击标记显示景点卡片预览
- 底部横向滚动卡片与地图标记联动

**技术实现**:
```dart
// 地图聚合算法
class MapClusterManager {
  List<Cluster> clusterSpots(List<Spot> spots, double zoomLevel) {
    // 根据缩放级别动态聚合
    // zoom < 10: 城市级聚合
    // zoom 10-14: 区域级聚合  
    // zoom > 14: 显示单个景点
  }
}
```

**API 接口**:
```
GET /api/v1/spots/map
Query: 
  - bounds: "39.9,116.3,40.0,116.5" (地图边界)
  - zoom: 12 (缩放级别)
Response:
{
  "clusters": [
    {"lat": 39.9, "lng": 116.4, "count": 5, "spot_ids": [1,2,3,4,5]}
  ],
  "spots": [
    {"id": 1, "title": "故宫", "lat": 39.916, "lng": 116.397}
  ]
}
```
