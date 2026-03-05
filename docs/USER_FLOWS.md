# MangoGo 用户交互流程图

## 五、用户行为流程树

### 5.1 游客用户流程

```
游客访问
│
├── 进入首页
│   └── 看到"芒一下"按钮
│
├── 点击"芒一下"
│   ├── 选择范围（城市/省份/全国/全球）
│   ├── 生成5个景点
│   ├── 点击"保存到日历"
│   └── 弹出登录提示 ❌
│
├── 浏览"芒GO MAP"
│   ├── 查看地图上的景点
│   ├── 点击景点查看详情
│   └── 浏览图片/美食/攻略 ✅
│
├── 浏览"芒GO Show"
│   ├── 查看前50条帖子 ✅
│   ├── 点击"发布"按钮
│   ├── 弹出登录提示 ❌
│   ├── 点击"点赞"
│   └── 弹出登录提示 ❌
│
└── 点击"我的"
    └── 显示"需要登录" ❌
```

### 5.2 注册用户流程

```
注册用户登录
│
├── 点击"注册"
│   ├── 输入用户名
│   ├── 输入密码
│   ├── 提交 → POST /auth/register
│   ├── 密码加密 → users表
│   ├── 自动登录
│   └── 保存到localStorage ✅
│
├── 使用"芒一下"
│   ├── 选择范围
│   ├── 生成5个景点
│   ├── 点击"保存到日历"
│   ├── 写入 user_calendar 表
│   └── 在"我的"页面显示 ✅
│
├── 发布内容
│   ├── 点击"发布"按钮
│   ├── 上传图片/视频（最多9张）
│   ├── 输入文字
│   ├── 选择标签
│   ├── 点击"发布"
│   ├── POST /posts → posts表
│   ├── 显示成功提示
│   └── 立即在世界频道显示 ✅
│
├── 点赞互动
│   ├── 点击❤️图标
│   ├── PUT /posts/:id/like
│   ├── posts.likes++
│   └── 实时更新数字 ✅
│
├── 评论互动（待实现）
│   ├── 点击💬图标
│   ├── 输入评论
│   ├── POST /comments
│   └── 显示在帖子下方
│
└── 个人空间
    ├── 查看"芒一下日历"
    ├── 查看"我的创作"
    ├── 查看统计数据
    └── 管理关注/粉丝 ✅
```

## 六、数据流向图

### 6.1 发布帖子流程

```
用户操作
    ↓
[前端] Community组件
    ↓ handlePublish()
获取localStorage中的userId
    ↓
调用 postsAPI.create()
    ↓
[HTTP] POST /posts
    ↓
[后端] PostsController.create()
    ↓
PostsService.create()
    ↓
[数据库] INSERT INTO posts
    ↓
返回新帖子对象
    ↓
[前端] 添加到posts数组顶部
    ↓
[UI] 立即显示在世界频道
```

### 6.2 点赞流程

```
用户点击❤️
    ↓
[前端] 调用 postsAPI.like(postId)
    ↓
[HTTP] PUT /posts/:id/like
    ↓
[后端] PostsController.like()
    ↓
PostsService.like()
    ↓
[数据库] UPDATE posts SET likes = likes + 1
    ↓
返回更新后的帖子
    ↓
[前端] 更新UI显示
```

### 6.3 登录流程

```
用户输入用户名密码
    ↓
[前端] 调用 authAPI.login()
    ↓
[HTTP] POST /auth/login
    ↓
[后端] AuthController.login()
    ↓
AuthService.login()
    ↓
[数据库] SELECT * FROM users WHERE username = ?
    ↓
bcrypt.compare(密码, password_hash)
    ↓
验证成功 → 返回user对象
    ↓
[前端] 保存到localStorage
    ↓
[UI] 显示用户名 + 解锁所有功能
```

## 七、数据关联图

```
users (用户)
  ├─→ posts (1对多)
  │     ├─→ comments (1对多)
  │     └─→ likes (多对多)
  │
  ├─→ blindbox_history (1对多)
  │     └─→ user_calendar (1对1)
  │
  ├─→ comments (1对多)
  ├─→ likes (1对多)
  └─→ follows (多对多)
        ├─→ followers (关注我的人)
        └─→ following (我关注的人)

spots (景点)
  ├─→ spot_images (1对多)
  ├─→ spot_foods (1对多)
  ├─→ photo_guides (1对多)
  ├─→ posts (1对多) - 用户在此景点发布
  └─→ likes (多对多)
```

---

**继续第三部分...**
