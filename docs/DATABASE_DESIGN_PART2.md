# MangoGo 数据库设计 - 第二部分

## 二、辅助表结构

### 6. collections（收藏表）
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  
  -- 收藏夹分类
  folder_name VARCHAR(50) DEFAULT '默认收藏夹',
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_collect (user_id, post_id),
  INDEX idx_user_id (user_id, created_at DESC)
);
```

### 7. shares（分享表）
```sql
CREATE TABLE shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  
  -- 分享平台
  platform ENUM('wechat', 'weibo', 'qq', 'link') NOT NULL,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  
  INDEX idx_post_id (post_id, created_at DESC)
);
```

### 8. views（浏览记录表）
```sql
CREATE TABLE views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,  -- 可为空（游客）
  post_id UUID NOT NULL,
  
  -- 浏览信息
  ip_address VARCHAR(50),
  user_agent TEXT,
  duration INT,  -- 浏览时长（秒）
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  
  INDEX idx_post_id (post_id, created_at DESC),
  INDEX idx_user_id (user_id, created_at DESC)
);
```

### 9. notifications（通知表）
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,  -- 接收通知的用户
  
  -- 通知类型
  type ENUM('like', 'comment', 'follow', 'system') NOT NULL,
  
  -- 通知内容
  title VARCHAR(255),
  content TEXT,
  
  -- 关联数据
  related_user_id UUID,  -- 触发通知的用户
  related_post_id UUID,
  related_comment_id UUID,
  
  -- 状态
  is_read BOOLEAN DEFAULT FALSE,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_user_id (user_id, is_read, created_at DESC)
);
```

### 10. spots（景点表）
```sql
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息（多语言）
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_zh VARCHAR(255),
  description TEXT,
  description_en TEXT,
  
  -- 地理位置
  country VARCHAR(50) NOT NULL,
  province VARCHAR(50),
  city VARCHAR(50) NOT NULL,
  district VARCHAR(50),
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- 分类
  category VARCHAR(50),  -- "自然风光", "历史建筑", "美食街"
  tags JSON,
  
  -- 旅行信息
  best_season VARCHAR(100),  -- "春季", "秋季"
  best_time VARCHAR(100),    -- "日出", "日落", "夜晚"
  ticket_price VARCHAR(50),
  opening_hours VARCHAR(255),
  
  -- 统计数据
  posts_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  checkins_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,  -- 评分 0-5
  
  -- 状态
  status ENUM('active', 'inactive') DEFAULT 'active',
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_city (city),
  INDEX idx_location (latitude, longitude),
  INDEX idx_rating (rating DESC)
);
```

---

## 三、关键查询示例

### 查询1：获取某城市最热门的帖子（按点赞数）
```sql
SELECT 
  p.*,
  u.username,
  u.avatar_url,
  u.nickname
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.city = '北京'
  AND p.status = 'published'
ORDER BY p.likes_count DESC, p.created_at DESC
LIMIT 20;
```

### 查询2：获取某城市最新的帖子（看天气）
```sql
SELECT 
  p.*,
  u.username,
  u.avatar_url,
  DATE_FORMAT(p.created_at, '%Y-%m-%d %H:%i') as post_time
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.city = '北京'
  AND p.status = 'published'
  AND p.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)  -- 最近24小时
ORDER BY p.created_at DESC
LIMIT 20;
```

### 查询3：获取帖子的所有评论（包括回复）
```sql
SELECT 
  c.*,
  u.username,
  u.avatar_url,
  reply_user.username as reply_to_username
FROM comments c
JOIN users u ON c.user_id = u.id
LEFT JOIN users reply_user ON c.reply_to_user_id = reply_user.id
WHERE c.post_id = 'xxx'
  AND c.status = 'normal'
ORDER BY c.created_at ASC;
```

### 查询4：获取用户的所有创作
```sql
SELECT 
  p.*,
  (SELECT COUNT(*) FROM likes WHERE target_type = 'post' AND target_id = p.id) as likes_count,
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
FROM posts p
WHERE p.user_id = '123'
  AND p.status = 'published'
ORDER BY p.created_at DESC;
```

### 查询5：获取用户的关注动态
```sql
SELECT 
  p.*,
  u.username,
  u.avatar_url
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
  SELECT following_id 
  FROM follows 
  WHERE follower_id = '123'
)
  AND p.status = 'published'
ORDER BY p.created_at DESC
LIMIT 50;
```

---

**继续第三部分...**
