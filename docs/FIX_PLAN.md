# MangoGo 立即修复方案

## 七、需要立即修复的问题

### 修复1：用户ID持久化
**当前问题**：登录后刷新页面，userId丢失

**解决方案**：
```javascript
// 前端 App.tsx - 登录成功后
const result = await authAPI.login(user, pass)
localStorage.setItem('userId', result.id)      // ← 新增
localStorage.setItem('username', result.username)
localStorage.setItem('user', JSON.stringify(result))
```

### 修复2：发帖时使用真实userId
**当前问题**：发帖时userId可能为空

**解决方案**：
```javascript
// 前端 Community.tsx - handlePublish
const userId = localStorage.getItem('userId')
if (!userId) {
  setToast({ type: 'error', message: '请先登录' })
  return
}

await postsAPI.create(userId, { ... })
```

### 修复3：实现likes表（独立点赞记录）
**当前问题**：点赞没有记录是谁点的

**解决方案**：
```sql
-- 后端创建likes表
CREATE TABLE likes (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL,
  postId UUID NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, postId)  -- 防止重复点赞
);
```

### 修复4：按赞数排序
**当前问题**：帖子列表无法按赞数排序

**解决方案**：
```javascript
// 前端 Community.tsx - 添加排序选项
const sortedPosts = posts.sort((a, b) => {
  if (feedSort === 'hot') return b.likes - a.likes
  if (feedSort === 'latest') return new Date(b.createdAt) - new Date(a.createdAt)
  return 0
})
```

### 修复5：显示发帖时间
**当前问题**：时间显示不准确

**解决方案**：
```javascript
// 前端显示相对时间
function getRelativeTime(timestamp) {
  const now = new Date()
  const past = new Date(timestamp)
  const diff = (now - past) / 1000  // 秒
  
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff/60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff/3600)}小时前`
  return `${Math.floor(diff/86400)}天前`
}
```

---

## 八、完整的数据验证流程

### 用户注册验证
```
1. 前端输入用户名密码
2. 后端检查用户名是否存在
3. 密码加密存储
4. 返回userId
5. 前端保存userId到localStorage ✅
```

### 用户登录验证
```
1. 前端输入用户名密码
2. 后端查询users表
3. 验证密码
4. 返回userId + username
5. 前端保存到localStorage ✅
6. 刷新页面 → 从localStorage读取 → 保持登录 ✅
```

### 发帖验证
```
1. 前端检查localStorage中的userId
2. 如果没有 → 提示登录
3. 如果有 → 发送到后端
4. 后端验证userId是否存在
5. 保存到posts表（带userId）✅
6. 返回新帖子
7. 前端显示 ✅
```

---

## 九、数据查询示例

### 查询1：用户的所有帖子
```sql
SELECT * FROM posts 
WHERE userId = '123' 
ORDER BY createdAt DESC;
```

### 查询2：某城市最热门帖子
```sql
SELECT p.*, u.username, u.avatar_url
FROM posts p
JOIN users u ON p.userId = u.id
WHERE p.city = '北京'
ORDER BY p.likes DESC
LIMIT 10;
```

### 查询3：某城市最新帖子
```sql
SELECT p.*, u.username, u.avatar_url
FROM posts p
JOIN users u ON p.userId = u.id
WHERE p.city = '北京'
ORDER BY p.createdAt DESC
LIMIT 10;
```

### 查询4：用户点赞过的帖子
```sql
SELECT p.*, u.username
FROM posts p
JOIN likes l ON p.id = l.postId
JOIN users u ON p.userId = u.id
WHERE l.userId = '123'
ORDER BY l.createdAt DESC;
```

### 查询5：用户的统计数据
```sql
-- 发帖数
SELECT COUNT(*) FROM posts WHERE userId = '123';

-- 获赞数
SELECT SUM(likes) FROM posts WHERE userId = '123';

-- 关注数
SELECT COUNT(*) FROM follows WHERE followerId = '123';

-- 粉丝数
SELECT COUNT(*) FROM follows WHERE followingId = '123';
```

---

## 十、总结：一切围绕userId

```
用户ID (123)
    ↓
所有操作都带上userId
    ↓
数据库所有表都关联userId
    ↓
查询时通过userId找到所有相关数据
    ↓
完美闭环 ✅
```

### 核心原则
1. **注册时**：生成userId，保存到users表
2. **登录时**：返回userId，前端保存到localStorage
3. **发帖时**：带上userId，保存到posts表
4. **点赞时**：带上userId，保存到likes表
5. **查询时**：通过userId查找所有相关数据

### 数据不是独立的，是完整闭环
- 用户 → 帖子 → 点赞 → 评论 → 关注
- 所有数据通过userId串联
- 可以随时查询任何用户的所有数据
- 可以按任何维度排序（时间/热度/城市）

---

**这样解释清楚了吗？老板！**
