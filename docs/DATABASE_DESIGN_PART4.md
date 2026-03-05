# MangoGo 数据库设计 - 第四部分（性能优化）

## 七、索引策略（关键！）

### 为什么需要索引？
- 10000个用户，每人每天发1个帖子 = 每天10000条数据
- 1个月 = 300000条帖子
- 没有索引：查询需要扫描全表（慢）
- 有索引：直接定位数据（快）

### 核心索引
```sql
-- posts表索引（最重要）
CREATE INDEX idx_posts_user_time ON posts(user_id, created_at DESC);
CREATE INDEX idx_posts_city_likes ON posts(city, likes_count DESC);
CREATE INDEX idx_posts_city_time ON posts(city, created_at DESC);
CREATE INDEX idx_posts_status ON posts(status);

-- comments表索引
CREATE INDEX idx_comments_post_time ON comments(post_id, created_at ASC);
CREATE INDEX idx_comments_user ON comments(user_id, created_at DESC);

-- likes表索引
CREATE INDEX idx_likes_user_time ON likes(user_id, created_at DESC);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- follows表索引
CREATE INDEX idx_follows_follower ON follows(follower_id, created_at DESC);
CREATE INDEX idx_follows_following ON follows(following_id, created_at DESC);
```

---

## 八、性能优化查询

### 优化前（慢）
```sql
-- 查询北京最热门帖子（全表扫描）
SELECT * FROM posts 
WHERE city = '北京' 
ORDER BY likes_count DESC;
-- 耗时：2000ms（扫描30万条数据）
```

### 优化后（快）
```sql
-- 使用索引 idx_posts_city_likes
SELECT * FROM posts 
WHERE city = '北京' 
  AND status = 'published'
ORDER BY likes_count DESC 
LIMIT 20;
-- 耗时：50ms（直接定位）
```

---

## 九、缓存策略

### Redis缓存热门数据
```javascript
// 缓存热门帖子（1小时）
const hotPosts = await redis.get('hot_posts:北京')
if (!hotPosts) {
  const posts = await db.query('SELECT * FROM posts WHERE city = ? ORDER BY likes_count DESC LIMIT 20', ['北京'])
  await redis.setex('hot_posts:北京', 3600, JSON.stringify(posts))
}
```

### 缓存用户统计
```javascript
// 缓存用户统计（10分钟）
const userStats = await redis.get('user_stats:123')
if (!userStats) {
  const stats = await db.query('SELECT posts_count, followers_count FROM users WHERE id = ?', ['123'])
  await redis.setex('user_stats:123', 600, JSON.stringify(stats))
}
```

---

## 十、数据归档策略

### 冷热数据分离
```sql
-- 热数据表（最近3个月）
CREATE TABLE posts_hot LIKE posts;

-- 冷数据表（3个月以前）
CREATE TABLE posts_archive LIKE posts;

-- 定期归档（每月执行）
INSERT INTO posts_archive 
SELECT * FROM posts_hot 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 MONTH);

DELETE FROM posts_hot 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 3 MONTH);
```

---

## 十一、总结：严谨的数据库设计

### 核心原则
1. **用户ID是一切的核心** - 所有表都关联user_id
2. **时间戳必须精确** - created_at, updated_at, deleted_at
3. **地理位置必须完整** - 国家/省份/城市/经纬度
4. **统计数据冗余存储** - likes_count, comments_count（提高性能）
5. **软删除保留数据** - status字段，不真正删除
6. **索引优化查询** - 为常用查询建立索引
7. **触发器保证一致性** - 自动更新统计数据
8. **事务保证原子性** - 多表操作用事务包裹

### 数据完整闭环
```
用户注册 → 获得ID
    ↓
发帖 → posts表（带user_id, 时间, 地点）
    ↓
点赞 → likes表（带user_id, post_id, 时间）
    ↓
评论 → comments表（带user_id, post_id, 时间, 内容）
    ↓
关注 → follows表（带follower_id, following_id, 时间）
    ↓
所有数据通过user_id关联
    ↓
可以查询任何维度的数据
    ↓
完美闭环 ✅
```

---

**老板，这样的数据库设计够严谨了吗？**
