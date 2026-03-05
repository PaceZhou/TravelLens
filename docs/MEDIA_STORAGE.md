# MangoGo 媒体存储与调用方案

## 一、文件存储架构

### 存储方案：阿里云OSS / AWS S3
```
为什么不存数据库？
- 图片/视频文件太大（几MB到几百MB）
- 数据库存储成本高
- 查询速度慢
- 无法CDN加速

正确方案：
- 文件存储到云存储（OSS/S3）
- 数据库只存储文件URL
- 通过URL调用文件
```

---

## 二、文件存储结构

### OSS目录结构
```
mangogo-bucket/
├── users/                    # 用户相关
│   ├── avatars/             # 头像
│   │   ├── 123.jpg
│   │   └── 456.jpg
│   ├── covers/              # 主页封面
│   │   ├── 123.jpg
│   │   └── 456.jpg
│   └── decorations/         # 主页装饰
│       ├── 123_badge.png
│       └── 456_frame.png
│
├── posts/                    # 帖子相关
│   ├── images/              # 帖子图片
│   │   ├── 2026/03/04/
│   │   │   ├── post-001-1.jpg
│   │   │   ├── post-001-2.jpg
│   │   │   └── post-002-1.jpg
│   │   └── thumbnails/      # 缩略图
│   │       ├── post-001-1_thumb.jpg
│   │       └── post-001-2_thumb.jpg
│   │
│   └── videos/              # 帖子视频
│       ├── 2026/03/04/
│       │   ├── post-003.mp4
│       │   └── post-003_cover.jpg  # 视频封面
│       └── transcoded/      # 转码后的视频
│           └── post-003_720p.mp4
│
├── spots/                    # 景点相关
│   ├── images/              # 景点图片
│   │   ├── spot-001/
│   │   │   ├── main.jpg     # 主图
│   │   │   ├── gallery-1.jpg
│   │   │   ├── gallery-2.jpg
│   │   │   └── gallery-3.jpg
│   │   └── thumbnails/
│   │       └── spot-001_thumb.jpg
│   │
│   └── videos/              # 景点视频
│       ├── spot-001-intro.mp4
│       └── spot-001-intro_cover.jpg
│
└── comments/                 # 评论图片
    └── images/
        ├── comment-001.jpg
        └── comment-002.jpg
```

---

## 三、数据库存储URL

### users表（用户头像和装饰）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50),
  
  -- 头像URL
  avatar_url TEXT,  
  -- 示例：https://cdn.mangogo.com/users/avatars/123.jpg
  
  -- 主页封面URL
  cover_url TEXT,
  -- 示例：https://cdn.mangogo.com/users/covers/123.jpg
  
  -- 主页装饰（JSON）
  decorations JSON,
  -- 示例：{
  --   "badge": "https://cdn.mangogo.com/users/decorations/123_badge.png",
  --   "frame": "https://cdn.mangogo.com/users/decorations/123_frame.png"
  -- }
  
  ...
);
```

### posts表（帖子图片和视频）
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID,
  content TEXT,
  
  -- 图片URL数组（JSON）
  images JSON,
  -- 示例：[
  --   {
  --     "url": "https://cdn.mangogo.com/posts/images/2026/03/04/post-001-1.jpg",
  --     "thumbnail": "https://cdn.mangogo.com/posts/images/thumbnails/post-001-1_thumb.jpg",
  --     "width": 1080,
  --     "height": 1920,
  --     "order": 1
  --   },
  --   {
  --     "url": "https://cdn.mangogo.com/posts/images/2026/03/04/post-001-2.jpg",
  --     "thumbnail": "https://cdn.mangogo.com/posts/images/thumbnails/post-001-2_thumb.jpg",
  --     "width": 1080,
  --     "height": 1920,
  --     "order": 2
  --   }
  -- ]
  
  -- 视频URL数组（JSON）
  videos JSON,
  -- 示例：[
  --   {
  --     "url": "https://cdn.mangogo.com/posts/videos/2026/03/04/post-003.mp4",
  --     "cover": "https://cdn.mangogo.com/posts/videos/2026/03/04/post-003_cover.jpg",
  --     "duration": 60,
  --     "width": 1080,
  --     "height": 1920,
  --     "transcoded": {
  --       "720p": "https://cdn.mangogo.com/posts/videos/transcoded/post-003_720p.mp4",
  --       "480p": "https://cdn.mangogo.com/posts/videos/transcoded/post-003_480p.mp4"
  --     }
  --   }
  -- ]
  
  ...
);
```

### spots表（景点图片和视频）
```sql
CREATE TABLE spots (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  
  -- 主图URL
  main_image_url TEXT,
  -- 示例：https://cdn.mangogo.com/spots/images/spot-001/main.jpg
  
  -- 图片库（JSON）
  gallery_images JSON,
  -- 示例：[
  --   {
  --     "url": "https://cdn.mangogo.com/spots/images/spot-001/gallery-1.jpg",
  --     "thumbnail": "https://cdn.mangogo.com/spots/images/thumbnails/spot-001_thumb.jpg",
  --     "caption": "日出时分的故宫",
  --     "order": 1
  --   }
  -- ]
  
  -- 视频URL
  intro_video_url TEXT,
  -- 示例：https://cdn.mangogo.com/spots/videos/spot-001-intro.mp4
  
  video_cover_url TEXT,
  -- 示例：https://cdn.mangogo.com/spots/videos/spot-001-intro_cover.jpg
  
  ...
);
```

---

## 四、文件上传流程

### 流程1：用户上传头像
```
1. 前端选择图片
2. 压缩图片（前端）
3. 调用后端API：POST /upload/avatar
4. 后端接收文件
5. 生成唯一文件名：{userId}_{timestamp}.jpg
6. 上传到OSS：users/avatars/123_1709568000.jpg
7. 获取CDN URL：https://cdn.mangogo.com/users/avatars/123_1709568000.jpg
8. 更新数据库：UPDATE users SET avatar_url = 'https://...' WHERE id = 123
9. 返回URL给前端
10. 前端显示新头像
```

### 流程2：用户发布帖子（带图片）
```
1. 前端选择多张图片（最多9张）
2. 压缩图片 + 生成缩略图
3. 调用后端API：POST /upload/post-images
4. 后端接收文件数组
5. 批量上传到OSS：
   - posts/images/2026/03/04/post-001-1.jpg
   - posts/images/2026/03/04/post-001-2.jpg
   - posts/images/thumbnails/post-001-1_thumb.jpg
6. 获取所有URL
7. 创建帖子：POST /posts
   {
     userId: 123,
     content: "...",
     images: [
       {url: "https://...", thumbnail: "https://...", order: 1},
       {url: "https://...", thumbnail: "https://...", order: 2}
     ]
   }
8. 保存到数据库
9. 返回帖子数据
10. 前端显示新帖子
```

### 流程3：用户发布视频
```
1. 前端选择视频文件
2. 提取视频封面（第1帧）
3. 调用后端API：POST /upload/post-video
4. 后端接收视频
5. 上传原视频到OSS
6. 后台异步转码（720p, 480p）
7. 上传转码后的视频
8. 更新数据库：
   videos: [{
     url: "原视频URL",
     cover: "封面URL",
     transcoded: {
       "720p": "转码URL",
       "480p": "转码URL"
     }
   }]
9. 返回视频数据
10. 前端显示视频（自动选择合适清晰度）
```

---

**继续第二部分...**
