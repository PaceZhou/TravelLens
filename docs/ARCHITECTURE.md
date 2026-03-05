# MangoGo 系统架构树状图

## 一、用户层级结构

```
用户系统
├── 游客用户 (Guest)
│   ├── 可浏览内容（限50条）
│   ├── 可查看地图
│   ├── 可使用盲盒（无限制）
│   └── 不可发布/点赞/评论
│
└── 注册用户 (Registered)
    ├── 完整浏览权限
    ├── 发布内容
    ├── 点赞/评论
    ├── 保存盲盒结果
    └── 个人空间管理
```

## 二、前端功能树

```
MangoGo 前端
│
├── 1. 芒一下 (BlindBox)
│   ├── 功能
│   │   ├── 随机推荐景点
│   │   ├── 4个范围选择（城市/省份/全国/全球）
│   │   ├── 生成5个打卡点
│   │   └── 保存到日历（需登录）
│   │
│   └── 数据流
│       ├── 输入：用户选择范围
│       ├── 处理：随机算法
│       └── 输出：景点列表 → 保存到 blindbox_history 表
│
├── 2. 芒GO MAP (MapView)
│   ├── 功能
│   │   ├── 地图展示景点
│   │   ├── 4级导航（国家→省份→城市→区域）
│   │   ├── 景点详情（图片/美食/拍照攻略）
│   │   └── 筛选（随机/附近/热门）
│   │
│   └── 数据流
│       ├── 读取：spots 表
│       ├── 关联：spot_images, spot_foods, photo_guides
│       └── 输出：地图标记 + 详情浮窗
│
├── 3. 芒GO Show (Community)
│   ├── 功能
│   │   ├── 瀑布流展示帖子
│   │   ├── 发布内容（图片/视频/文字）
│   │   ├── 标签筛选
│   │   ├── 点赞/评论
│   │   └── 城市筛选
│   │
│   └── 数据流
│       ├── 读取：posts 表 + users 表
│       ├── 写入：新帖子 → posts 表
│       ├── 更新：点赞 → posts.likes++
│       └── 关联：comments 表（待实现）
│
└── 4. 我的 (Profile)
    ├── 功能
    │   ├── 芒一下日历（保存的盲盒）
    │   ├── 我的创作（发布的帖子）
    │   ├── 关注/粉丝
    │   └── 收藏
    │
    └── 数据流
        ├── 读取：user_calendar 表
        ├── 统计：posts 表（按 userId）
        └── 关联：follows 表（待实现）
```

## 三、后端API树

```
后端 API (NestJS)
│
├── /auth (认证模块)
│   ├── POST /register
│   │   ├── 输入：username, password
│   │   ├── 处理：bcrypt加密
│   │   └── 输出：user对象 → users 表
│   │
│   ├── POST /login
│   │   ├── 输入：username, password
│   │   ├── 验证：bcrypt.compare
│   │   └── 输出：user对象 + JWT（待实现）
│   │
│   └── GET /stats/:username
│       ├── 查询：posts, follows, likes
│       └── 输出：统计数据
│
├── /posts (帖子模块)
│   ├── POST /posts
│   │   ├── 输入：userId, content, images, tags, city
│   │   ├── 写入：posts 表
│   │   └── 输出：新帖子对象
│   │
│   ├── GET /posts
│   │   ├── 查询：posts 表 + 关联 users
│   │   ├── 排序：createdAt DESC
│   │   └── 输出：帖子列表
│   │
│   └── PUT /posts/:id/like
│       ├── 更新：posts.likes++
│       └── 输出：更新后的帖子
│
├── /spots (景点模块 - 待实现)
│   ├── GET /spots
│   ├── GET /spots/:id
│   ├── GET /spots/nearby
│   └── GET /spots/random
│
├── /blindbox (盲盒模块 - 待实现)
│   ├── POST /blindbox/draw
│   └── POST /blindbox/save
│
└── /comments (评论模块 - 待实现)
    ├── POST /comments
    ├── GET /comments/:postId
    └── DELETE /comments/:id
```

## 四、数据库结构树

```
SQLite 数据库 (mangogo.db)
│
├── users (用户表)
│   ├── id (UUID, PK)
│   ├── username (唯一)
│   ├── password_hash
│   ├── avatar_url
│   ├── bio
│   ├── created_at
│   └── 关联：posts, blindbox_history, user_calendar
│
├── posts (帖子表)
│   ├── id (UUID, PK)
│   ├── userId (FK → users.id)
│   ├── content (文本)
│   ├── images (JSON数组)
│   ├── tags (JSON数组)
│   ├── location (字符串)
│   ├── city (字符串)
│   ├── likes (整数)
│   ├── comments (整数)
│   ├── createdAt (时间戳)
│   └── 关联：users, comments, likes
│
├── spots (景点表 - 待创建)
│   ├── id (UUID, PK)
│   ├── name (多语言)
│   ├── description (多语言)
│   ├── location (地理坐标)
│   ├── country, province, city, area
│   ├── best_time
│   ├── likes_count
│   ├── posts_count
│   └── 关联：spot_images, spot_foods, photo_guides
│
├── spot_images (景点图片 - 待创建)
│   ├── id (UUID, PK)
│   ├── spot_id (FK)
│   ├── image_url
│   └── order_index
│
├── spot_foods (美食推荐 - 待创建)
│   ├── id (UUID, PK)
│   ├── spot_id (FK)
│   ├── name
│   └── description
│
├── photo_guides (拍照攻略 - 待创建)
│   ├── id (UUID, PK)
│   ├── spot_id (FK)
│   ├── title
│   └── tip
│
├── blindbox_history (盲盒历史 - 待创建)
│   ├── id (UUID, PK)
│   ├── user_id (FK)
│   ├── scope (范围)
│   ├── result_city
│   ├── result_spots (JSON)
│   └── is_saved
│
├── user_calendar (用户日历 - 待创建)
│   ├── id (UUID, PK)
│   ├── user_id (FK)
│   ├── blindbox_id (FK)
│   ├── title
│   ├── spots (JSON)
│   ├── scheduled_date
│   └── status
│
├── comments (评论表 - 待创建)
│   ├── id (UUID, PK)
│   ├── post_id (FK)
│   ├── user_id (FK)
│   ├── content
│   └── created_at
│
├── likes (点赞表 - 待创建)
│   ├── id (UUID, PK)
│   ├── user_id (FK)
│   ├── target_type (spot/post)
│   ├── target_id
│   └── created_at
│
└── follows (关注表 - 待创建)
    ├── id (UUID, PK)
    ├── follower_id (FK)
    ├── following_id (FK)
    └── created_at
```

---

**文档已创建，继续第二部分...**
