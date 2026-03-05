# MangoGo 核心逻辑 - 以用户ID为中心

## 一、核心理念：一切围绕用户ID

```
用户A (ID: 123)
    │
    ├─ 发布帖子 → posts表 (userId: 123)
    │   ├─ 帖子1 (postId: 001, userId: 123, likes: 50, createdAt: 2026-03-04 10:00)
    │   ├─ 帖子2 (postId: 002, userId: 123, likes: 30, createdAt: 2026-03-04 11:00)
    │   └─ 帖子3 (postId: 003, userId: 123, likes: 80, createdAt: 2026-03-04 12:00)
    │
    ├─ 点赞别人的帖子 → likes表 (userId: 123, postId: xxx)
    │
    ├─ 评论别人的帖子 → comments表 (userId: 123, postId: xxx)
    │
    ├─ 关注其他用户 → follows表 (followerId: 123, followingId: 456)
    │
    └─ 抽盲盒保存 → user_calendar表 (userId: 123, spots: [...])
```

---

## 二、真实场景举例

### 场景1：用户A发布帖子
```
1. 用户A (ID: 123) 点击"发布"
2. 上传照片 + 文字 + 标签
3. 保存到数据库：
   posts表插入：
   {
     id: "post-001",
     userId: 123,           ← 关键！绑定用户ID
     content: "北京故宫真美",
     images: ["img1.jpg"],
     city: "北京",
     likes: 0,
     comments: 0,
     createdAt: "2026-03-04 10:00:00"
   }
```

### 场景2：用户B点赞用户A的帖子
```
1. 用户B (ID: 456) 看到用户A的帖子
2. 点击❤️
3. 数据库操作：
   
   likes表插入：
   {
     userId: 456,          ← 谁点的赞
     postId: "post-001"    ← 点的哪个帖子
   }
   
   posts表更新：
   UPDATE posts 
   SET likes = likes + 1 
   WHERE id = "post-001"
   
   结果：post-001的likes从0变成1
```

### 场景3：查看北京最热门的帖子
```
SQL查询：
SELECT * FROM posts 
WHERE city = "北京" 
ORDER BY likes DESC 
LIMIT 10

结果：
1. 帖子A (likes: 1000) - 用户123发布
2. 帖子B (likes: 800)  - 用户456发布
3. 帖子C (likes: 500)  - 用户789发布
```

### 场景4：查看北京最新的帖子（看天气）
```
SQL查询：
SELECT * FROM posts 
WHERE city = "北京" 
ORDER BY createdAt DESC 
LIMIT 10

结果：
1. 帖子X (2026-03-04 12:00) - 用户999发布 "今天下雨"
2. 帖子Y (2026-03-04 11:30) - 用户888发布 "天气晴朗"
3. 帖子Z (2026-03-04 11:00) - 用户777发布 "有点冷"
```

---

## 三、完整数据闭环

### 用户注册 → 获得ID → 所有操作都带ID

```
第1步：注册
用户输入：username: "张三", password: "123456"
数据库插入：
users表 → { id: 123, username: "张三", password_hash: "xxx" }

第2步：登录
验证密码 → 返回 userId: 123
前端保存：localStorage.setItem("userId", 123)

第3步：发帖
前端获取：userId = localStorage.getItem("userId")  // 123
发送到后端：{ userId: 123, content: "...", images: [...] }
数据库插入：posts表 → { userId: 123, ... }

第4步：点赞
前端获取：userId = localStorage.getItem("userId")  // 123
发送到后端：{ userId: 123, postId: "post-001" }
数据库插入：likes表 → { userId: 123, postId: "post-001" }

第5步：查看"我的创作"
SQL查询：SELECT * FROM posts WHERE userId = 123
结果：显示用户123发布的所有帖子
```

---

## 四、10000个用户的数据管理

### 假设：10000个用户，每人每天发1个帖子

```
posts表数据：
┌────────┬────────┬─────────┬───────┬──────────────────┐
│ postId │ userId │ content │ likes │ createdAt        │
├────────┼────────┼─────────┼───────┼──────────────────┤
│ 1      │ 123    │ 故宫    │ 50    │ 2026-03-04 10:00 │
│ 2      │ 456    │ 长城    │ 30    │ 2026-03-04 10:05 │
│ 3      │ 789    │ 天坛    │ 80    │ 2026-03-04 10:10 │
│ ...    │ ...    │ ...     │ ...   │ ...              │
│ 10000  │ 9999   │ 颐和园  │ 100   │ 2026-03-04 23:59 │
└────────┴────────┴─────────┴───────┴──────────────────┘

查询用户123的所有帖子：
SELECT * FROM posts WHERE userId = 123

查询北京最热门的帖子：
SELECT * FROM posts WHERE city = "北京" ORDER BY likes DESC

查询最新发布的帖子：
SELECT * FROM posts ORDER BY createdAt DESC LIMIT 20
```

---

## 五、当前问题诊断

### ❌ 问题1：用户注册后无法验证
**原因**：前端没有正确保存userId到localStorage
**解决**：登录成功后保存完整用户信息

### ❌ 问题2：发帖后刷新消失
**原因**：前端只保存到内存，没有调用后端API
**解决**：已修复，现在会保存到数据库

### ❌ 问题3：点赞数据不持久
**原因**：点赞只更新前端，没有保存到数据库
**解决**：需要实现likes表

### ❌ 问题4：无法按赞数排序
**原因**：前端写死了假数据
**解决**：需要从数据库读取并排序

---

## 六、正确的数据流

### 发帖流程（完整闭环）
```
用户操作
    ↓
前端获取 userId (从localStorage)
    ↓
调用 POST /posts { userId: 123, content: "...", city: "北京" }
    ↓
后端保存到 posts表
    ↓
返回新帖子数据
    ↓
前端添加到列表顶部
    ↓
刷新页面 → 从数据库读取 → 帖子还在 ✅
```

### 点赞流程（完整闭环）
```
用户点击❤️
    ↓
前端获取 userId (从localStorage)
    ↓
调用 PUT /posts/:id/like { userId: 123 }
    ↓
后端操作：
  1. likes表插入 { userId: 123, postId: "xxx" }
  2. posts表更新 likes = likes + 1
    ↓
返回新的点赞数
    ↓
前端更新显示 ✅
```

---

**继续下一部分...**
