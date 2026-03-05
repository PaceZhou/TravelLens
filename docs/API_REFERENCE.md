# MangoGo 数据库ER图与API完整文档

## 十三、数据库ER关系图

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │◄─────┐
│ username        │      │
│ password_hash   │      │
│ avatar_url      │      │
│ bio             │      │
│ created_at      │      │
└─────────────────┘      │
         │               │
         │ 1:N           │
         ▼               │
┌─────────────────┐      │
│     posts       │      │
│─────────────────│      │
│ id (PK)         │      │
│ userId (FK)     │──────┘
│ content         │
│ images (JSON)   │
│ tags (JSON)     │
│ location        │
│ city            │
│ likes           │
│ comments        │
│ createdAt       │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    comments     │
│─────────────────│
│ id (PK)         │
│ post_id (FK)    │
│ user_id (FK)    │
│ content         │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│     spots       │
│─────────────────│
│ id (PK)         │◄─────┐
│ name            │      │
│ description     │      │
│ location (GEO)  │      │
│ country         │      │
│ province        │      │
│ city            │      │
│ area            │      │
│ best_time       │      │
│ likes_count     │      │
│ posts_count     │      │
└─────────────────┘      │
         │               │
         │ 1:N           │
         ├───────────────┤
         │               │
         ▼               │
┌─────────────────┐      │
│  spot_images    │      │
│─────────────────│      │
│ id (PK)         │      │
│ spot_id (FK)    │──────┘
│ image_url       │
│ order_index     │
└─────────────────┘

┌─────────────────┐
│ blindbox_history│
│─────────────────│
│ id (PK)         │
│ user_id (FK)    │
│ scope           │
│ result_city     │
│ result_spots    │
│ is_saved        │
│ created_at      │
└─────────────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│ user_calendar   │
│─────────────────│
│ id (PK)         │
│ user_id (FK)    │
│ blindbox_id (FK)│
│ title           │
│ spots (JSON)    │
│ scheduled_date  │
│ status          │
└─────────────────┘
```

---

## 十四、完整API文档

### 认证模块 (Auth)

#### POST /auth/register
注册新用户

**请求体：**
```json
{
  "username": "string (3-20字符)",
  "password": "string (6-20字符)"
}
```

**响应：**
```json
{
  "id": "uuid",
  "username": "string",
  "createdAt": "timestamp"
}
```

**错误码：**
- 400: 用户名已存在
- 400: 密码格式错误

---

#### POST /auth/login
用户登录

**请求体：**
```json
{
  "username": "string",
  "password": "string"
}
```

**响应：**
```json
{
  "id": "uuid",
  "username": "string"
}
```

**错误码：**
- 401: 用户名或密码错误
- 404: 用户不存在

---

#### GET /auth/stats/:username
获取用户统计数据

**响应：**
```json
{
  "posts": 42,
  "following": 128,
  "followers": 356,
  "likes": 1234
}
```

---

### 帖子模块 (Posts)

#### POST /posts
创建新帖子

**请求体：**
```json
{
  "userId": "uuid",
  "content": "string",
  "images": ["url1", "url2"],
  "tags": ["标签1", "标签2"],
  "location": "string",
  "city": "string"
}
```

**响应：**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "content": "string",
  "images": ["url1", "url2"],
  "tags": ["标签1", "标签2"],
  "location": "string",
  "city": "string",
  "likes": 0,
  "comments": 0,
  "createdAt": "timestamp"
}
```

---

#### GET /posts
获取所有帖子

**查询参数：**
- city: string (可选)
- tag: string (可选)
- limit: number (默认20)
- offset: number (默认0)

**响应：**
```json
[
  {
    "id": "uuid",
    "user": {
      "id": "uuid",
      "username": "string",
      "avatar_url": "string"
    },
    "content": "string",
    "images": ["url1"],
    "tags": ["标签1"],
    "location": "string",
    "city": "string",
    "likes": 100,
    "comments": 20,
    "createdAt": "timestamp"
  }
]
```

---

#### PUT /posts/:id/like
点赞帖子

**响应：**
```json
{
  "id": "uuid",
  "likes": 101
}
```

---

### 景点模块 (Spots - 待实现)

#### GET /spots
获取景点列表

**查询参数：**
- country: string
- province: string
- city: string
- limit: number

**响应：**
```json
[
  {
    "id": "uuid",
    "name": "故宫",
    "description": "...",
    "location": {"lat": 39.9, "lng": 116.4},
    "city": "北京",
    "images": ["url1", "url2"],
    "likes_count": 1000
  }
]
```

---

#### GET /spots/:id
获取景点详情

**响应：**
```json
{
  "id": "uuid",
  "name": "故宫",
  "description": "...",
  "location": {"lat": 39.9, "lng": 116.4},
  "images": [
    {"url": "...", "order": 1}
  ],
  "foods": [
    {"name": "烤鸭", "description": "..."}
  ],
  "photo_guides": [
    {"title": "最佳机位", "tip": "..."}
  ]
}
```

---

### 盲盒模块 (BlindBox - 待实现)

#### POST /blindbox/draw
抽取盲盒

**请求体：**
```json
{
  "scope": "city|province|national|global",
  "currentCity": "北京"
}
```

**响应：**
```json
{
  "id": "uuid",
  "city": "北京",
  "spots": [
    {"id": "uuid", "name": "故宫", "image": "..."},
    {"id": "uuid", "name": "天坛", "image": "..."}
  ]
}
```

---

#### POST /blindbox/save
保存盲盒到日历

**请求体：**
```json
{
  "userId": "uuid",
  "blindboxId": "uuid",
  "scheduledDate": "2026-03-20"
}
```

**响应：**
```json
{
  "id": "uuid",
  "title": "北京5日游",
  "spots": [...],
  "scheduledDate": "2026-03-20",
  "status": "planned"
}
```

---

### 评论模块 (Comments - 待实现)

#### POST /comments
发表评论

**请求体：**
```json
{
  "postId": "uuid",
  "userId": "uuid",
  "content": "string"
}
```

**响应：**
```json
{
  "id": "uuid",
  "user": {
    "username": "string",
    "avatar_url": "string"
  },
  "content": "string",
  "createdAt": "timestamp"
}
```

---

#### GET /comments/:postId
获取帖子评论

**响应：**
```json
[
  {
    "id": "uuid",
    "user": {...},
    "content": "string",
    "createdAt": "timestamp"
  }
]
```

---

**文档完成！**
