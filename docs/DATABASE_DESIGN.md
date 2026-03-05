# MangoGo 完整数据库设计（参考小红书）

## 一、核心表结构

### 1. users（用户表）- 用户身份核心
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  
  -- 个人信息
  nickname VARCHAR(50),
  avatar_url TEXT,
  bio TEXT,
  gender ENUM('male', 'female', 'other'),
  birthday DATE,
  
  -- 地理信息
  country VARCHAR(50),
  province VARCHAR(50),
  city VARCHAR(50),
  
  -- 统计数据（冗余字段，提高查询性能）
  posts_count INT DEFAULT 0,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  likes_received_count INT DEFAULT 0,
  
  -- 状态
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  account_type ENUM('normal', 'creator', 'business') DEFAULT 'normal',
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  last_login_ip VARCHAR(50),
  
  INDEX idx_username (username),
  INDEX idx_city (city),
  INDEX idx_created_at (created_at)
);
```

---

### 2. posts（帖子表）- 内容核心
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- 内容
  title VARCHAR(255),
  content TEXT NOT NULL,
  content_type ENUM('text', 'image', 'video', 'mixed') DEFAULT 'mixed',
  
  -- 媒体文件（JSON数组）
  images JSON,  -- [{"url": "...", "width": 1080, "height": 1920, "order": 1}]
  videos JSON,  -- [{"url": "...", "cover": "...", "duration": 60}]
  
  -- 地理位置
  location_name VARCHAR(255),  -- "北京市朝阳区三里屯"
  poi_id VARCHAR(100),         -- POI（兴趣点）ID
  country VARCHAR(50),
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  latitude DECIMAL(10, 8),     -- 纬度
  longitude DECIMAL(11, 8),    -- 经度
  
  -- 标签和分类
  tags JSON,                   -- ["旅行", "美食", "打卡"]
  category VARCHAR(50),        -- "旅行", "美食", "时尚"
  
  -- 互动数据（冗余字段）
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  collects_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  
  -- 状态
  status ENUM('draft', 'published', 'deleted', 'banned') DEFAULT 'published',
  is_top BOOLEAN DEFAULT FALSE,        -- 是否置顶
  is_hot BOOLEAN DEFAULT FALSE,        -- 是否热门
  is_recommended BOOLEAN DEFAULT FALSE, -- 是否推荐
  
  -- 时间戳（关键！）
  created_at TIMESTAMP DEFAULT NOW(),  -- 发布时间
  updated_at TIMESTAMP DEFAULT NOW(),  -- 更新时间
  published_at TIMESTAMP,              -- 正式发布时间
  deleted_at TIMESTAMP,                -- 删除时间（软删除）
  
  -- 外键
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- 索引（提高查询性能）
  INDEX idx_user_id (user_id),
  INDEX idx_city (city),
  INDEX idx_created_at (created_at DESC),
  INDEX idx_likes_count (likes_count DESC),
  INDEX idx_status (status),
  INDEX idx_location (latitude, longitude)
);
```

---

### 3. comments（评论表）- 互动核心
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  
  -- 评论内容
  content TEXT NOT NULL,
  images JSON,  -- 评论可以带图片
  
  -- 回复关系
  parent_id UUID,              -- 父评论ID（一级评论为NULL）
  reply_to_user_id UUID,       -- 回复给谁
  root_comment_id UUID,        -- 根评论ID（方便查询整个评论树）
  
  -- 互动数据
  likes_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  
  -- 状态
  status ENUM('normal', 'deleted', 'banned') DEFAULT 'normal',
  
  -- 时间戳（关键！）
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  
  -- 外键
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
  
  -- 索引
  INDEX idx_post_id (post_id, created_at DESC),
  INDEX idx_user_id (user_id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_created_at (created_at DESC)
);
```

---

### 4. likes（点赞表）- 记录每一个点赞
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- 点赞目标（可以是帖子或评论）
  target_type ENUM('post', 'comment') NOT NULL,
  target_id UUID NOT NULL,
  
  -- 时间戳（关键！）
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- 外键
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- 唯一约束（防止重复点赞）
  UNIQUE KEY unique_like (user_id, target_type, target_id),
  
  -- 索引
  INDEX idx_user_id (user_id, created_at DESC),
  INDEX idx_target (target_type, target_id, created_at DESC)
);
```

---

### 5. follows（关注表）- 社交关系
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL,   -- 关注者（我）
  following_id UUID NOT NULL,  -- 被关注者（他）
  
  -- 关注状态
  status ENUM('active', 'blocked') DEFAULT 'active',
  
  -- 时间戳（关键！）
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- 外键
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- 唯一约束
  UNIQUE KEY unique_follow (follower_id, following_id),
  
  -- 索引
  INDEX idx_follower (follower_id, created_at DESC),
  INDEX idx_following (following_id, created_at DESC)
);
```

---

**继续第二部分...**
