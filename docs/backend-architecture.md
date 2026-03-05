# MangoGo 后端架构设计

## 技术栈
- **框架**: NestJS (TypeScript)
- **数据库**: PostgreSQL 15 + PostGIS
- **缓存**: Redis
- **文件存储**: AWS S3 / 阿里云OSS
- **认证**: JWT + Passport
- **API文档**: Swagger

---

## 数据库设计

### 1. 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  language VARCHAR(10) DEFAULT 'zh'
);
```

### 2. 景点表 (spots)
```sql
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ru VARCHAR(255),
  name_it VARCHAR(255),
  name_ar VARCHAR(255),
  description TEXT NOT NULL,
  description_en TEXT,
  description_ru TEXT,
  description_it TEXT,
  description_ar TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  country VARCHAR(100) NOT NULL,
  province VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  area VARCHAR(100),
  best_time VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  likes_count INT DEFAULT 0,
  posts_count INT DEFAULT 0,
  checkins_count INT DEFAULT 0
);

CREATE INDEX idx_spots_location ON spots USING GIST(location);
CREATE INDEX idx_spots_city ON spots(city);
CREATE INDEX idx_spots_country ON spots(country);
```

### 3. 景点图片表 (spot_images)
```sql
CREATE TABLE spot_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  order_index INT DEFAULT 0,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. 美食推荐表 (spot_foods)
```sql
CREATE TABLE spot_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price_range VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. 拍照攻略表 (photo_guides)
```sql
CREATE TABLE photo_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tip TEXT,
  best_time VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. 用户帖子表 (posts)
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES spots(id),
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  tags VARCHAR(50)[] DEFAULT '{}',
  location GEOGRAPHY(POINT, 4326),
  exif_data JSONB,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_spot ON posts(spot_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
```

### 7. 点赞表 (likes)
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(20) NOT NULL, -- 'spot' or 'post'
  target_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);
```

### 8. 打卡记录表 (checkins)
```sql
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326),
  note TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, spot_id, DATE(created_at))
);
```

### 9. 盲盒历史表 (blindbox_history)
```sql
CREATE TABLE blindbox_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  scope VARCHAR(20) NOT NULL, -- 'city', 'province', 'national', 'global'
  result_city VARCHAR(100) NOT NULL,
  result_spots JSONB NOT NULL,
  is_saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 10. 用户日历表 (user_calendar)
```sql
CREATE TABLE user_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blindbox_id UUID REFERENCES blindbox_history(id),
  title VARCHAR(255) NOT NULL,
  spots JSONB NOT NULL,
  scheduled_date DATE,
  status VARCHAR(20) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API端点设计

### 认证模块 (/api/auth)
- POST /register - 用户注册
- POST /login - 用户登录
- POST /logout - 用户登出
- GET /profile - 获取用户信息
- PUT /profile - 更新用户信息

### 景点模块 (/api/spots)
- GET /spots - 获取景点列表（支持筛选）
- GET /spots/:id - 获取景点详情
- GET /spots/nearby - 获取附近景点
- GET /spots/random - 随机推荐景点

### 盲盒模块 (/api/blindbox)
- POST /draw - 抽取盲盒
- POST /save - 保存到日历
- GET /history - 获取历史记录

### 社区模块 (/api/community)
- GET /posts - 获取帖子列表
- POST /posts - 发布帖子
- GET /posts/:id - 获取帖子详情
- POST /posts/:id/like - 点赞
- DELETE /posts/:id - 删除帖子

### 上传模块 (/api/upload)
- POST /image - 上传图片
- POST /images - 批量上传

---

## 下一步
1. 创建NestJS项目结构
2. 配置数据库连接
3. 实现认证中间件
4. 开发核心API
