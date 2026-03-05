# MangoGo 数据库设计 - 第三部分

## 四、数据完整性保证

### 触发器1：发帖后更新用户统计
```sql
CREATE TRIGGER after_post_insert
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
  UPDATE users 
  SET posts_count = posts_count + 1 
  WHERE id = NEW.user_id;
END;
```

### 触发器2：点赞后更新帖子统计
```sql
CREATE TRIGGER after_like_insert
AFTER INSERT ON likes
FOR EACH ROW
BEGIN
  IF NEW.target_type = 'post' THEN
    UPDATE posts 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.target_id;
    
    UPDATE users 
    SET likes_received_count = likes_received_count + 1 
    WHERE id = (SELECT user_id FROM posts WHERE id = NEW.target_id);
  END IF;
END;
```

### 触发器3：评论后更新帖子统计
```sql
CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
  UPDATE posts 
  SET comments_count = comments_count + 1 
  WHERE id = NEW.post_id;
END;
```

### 触发器4：关注后更新用户统计
```sql
CREATE TRIGGER after_follow_insert
AFTER INSERT ON follows
FOR EACH ROW
BEGIN
  UPDATE users 
  SET following_count = following_count + 1 
  WHERE id = NEW.follower_id;
  
  UPDATE users 
  SET followers_count = followers_count + 1 
  WHERE id = NEW.following_id;
END;
```

---

## 五、业务逻辑示例

### 场景1：用户A发布帖子
```
1. 前端提交数据：
   {
     userId: "123",
     content: "北京故宫真美！",
     images: ["img1.jpg", "img2.jpg"],
     city: "北京",
     latitude: 39.9163,
     longitude: 116.3972,
     tags: ["旅行", "打卡", "故宫"]
   }

2. 后端处理：
   - 验证userId是否存在
   - 验证图片是否上传成功
   - 插入posts表
   - 触发器自动更新users.posts_count

3. 数据库记录：
   posts表：
   {
     id: "post-001",
     user_id: "123",
     content: "北京故宫真美！",
     images: ["img1.jpg", "img2.jpg"],
     city: "北京",
     latitude: 39.9163,
     longitude: 116.3972,
     tags: ["旅行", "打卡", "故宫"],
     likes_count: 0,
     comments_count: 0,
     created_at: "2026-03-04 13:00:00"
   }
   
   users表：
   {
     id: "123",
     posts_count: 1  ← 自动+1
   }
```

### 场景2：用户B点赞用户A的帖子
```
1. 前端提交：
   {
     userId: "456",
     postId: "post-001"
   }

2. 后端处理：
   - 检查是否已点赞（防止重复）
   - 插入likes表
   - 触发器自动更新posts.likes_count
   - 触发器自动更新users.likes_received_count
   - 创建通知

3. 数据库记录：
   likes表：
   {
     id: "like-001",
     user_id: "456",
     target_type: "post",
     target_id: "post-001",
     created_at: "2026-03-04 13:05:00"
   }
   
   posts表：
   {
     id: "post-001",
     likes_count: 1  ← 自动+1
   }
   
   users表（用户A）：
   {
     id: "123",
     likes_received_count: 1  ← 自动+1
   }
   
   notifications表：
   {
     user_id: "123",  ← 通知用户A
     type: "like",
     related_user_id: "456",  ← 用户B点赞了
     related_post_id: "post-001",
     created_at: "2026-03-04 13:05:00"
   }
```

### 场景3：用户C评论用户A的帖子
```
1. 前端提交：
   {
     userId: "789",
     postId: "post-001",
     content: "太美了！我也想去！"
   }

2. 后端处理：
   - 插入comments表
   - 触发器自动更新posts.comments_count
   - 创建通知

3. 数据库记录：
   comments表：
   {
     id: "comment-001",
     post_id: "post-001",
     user_id: "789",
     content: "太美了！我也想去！",
     parent_id: NULL,  ← 一级评论
     created_at: "2026-03-04 13:10:00"
   }
   
   posts表：
   {
     id: "post-001",
     comments_count: 1  ← 自动+1
   }
   
   notifications表：
   {
     user_id: "123",  ← 通知用户A
     type: "comment",
     related_user_id: "789",  ← 用户C评论了
     related_post_id: "post-001",
     related_comment_id: "comment-001",
     created_at: "2026-03-04 13:10:00"
   }
```

---

## 六、数据一致性保证

### 1. 事务处理
```sql
-- 发帖事务
START TRANSACTION;
  INSERT INTO posts (...) VALUES (...);
  UPDATE users SET posts_count = posts_count + 1 WHERE id = ?;
COMMIT;
```

### 2. 软删除
```sql
-- 删除帖子（软删除）
UPDATE posts 
SET status = 'deleted', deleted_at = NOW() 
WHERE id = 'post-001';

-- 查询时排除已删除
SELECT * FROM posts WHERE status != 'deleted';
```

### 3. 数据校验
```sql
-- 检查点赞是否重复
SELECT COUNT(*) FROM likes 
WHERE user_id = '456' 
  AND target_type = 'post' 
  AND target_id = 'post-001';
```

---

**继续第四部分...**
