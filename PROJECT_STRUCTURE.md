# TravelLens (芒果GO) 项目结构清单

**更新时间**: 2026-03-07  
**完成度**: 60%  
**技术栈**: React + TypeScript + NestJS + SQLite

---

## 📁 项目总览

```
TravelLens-Project/
├── frontend/          # 前端 (React + TypeScript + Vite)
├── backend/           # 后端 (NestJS + TypeORM + SQLite)
├── icon/              # 芒果角色素材
└── docs/              # 文档
```

---

## 🎨 前端结构 (frontend/)

### 核心文件
```
frontend/
├── package.json                    # 依赖配置
├── src/
│   ├── main.tsx                   # 入口文件
│   ├── App.tsx                    # 主应用组件 (当前使用)
│   ├── App.old.tsx                # 旧版本备份
│   └── App.new.tsx                # 新版本备份
```

### API层 (src/api/)
```
api/
├── config.ts                      # API配置 (BASE_URL)
├── auth.ts                        # 用户认证API
├── posts.ts                       # 帖子API
├── comments.ts                    # 评论API
├── likes.ts                       # 点赞API
├── collections.ts                 # 收藏API
└── tags.ts                        # 标签API
```

**API功能说明**:
- `auth.ts`: 登录、注册、获取用户信息、更新头像
- `posts.ts`: 创建/编辑/删除帖子、获取帖子列表、按城市/标签筛选
- `comments.ts`: 创建/删除评论、获取评论列表、点赞评论
- `likes.ts`: 点赞/取消点赞帖子
- `collections.ts`: 收藏/取消收藏帖子、获取收藏列表
- `tags.ts`: 获取所有标签、热门标签

---

## 📱 组件结构 (src/components/)

### 1. 页面级组件 (Page Components)

#### Community.tsx - 社区主页 ⭐核心
**功能**: 
- 帖子瀑布流展示
- 城市筛选 (北京/上海/广州/深圳/成都/杭州/西安/全部)
- 标签筛选
- 帖子详情弹窗
- 发布新帖
- 编辑帖子

**状态管理**:
- posts: 帖子列表
- selectedCity: 当前城市
- selectedTag: 当前标签
- showPublisher: 发布器显示状态
- editingPost: 编辑中的帖子

**子组件调用**:
- PostList (帖子列表)
- PostPublisher (发布/编辑)
- PostDetail (详情弹窗)

---

#### Profile.tsx - PC端个人主页
**功能**:
- 用户信息展示
- 头像编辑 (Emoji + 上传)
- 统计数据 (帖子数/获赞数)
- Tab切换 (我的帖子/我的收藏/芒一下)
- 帖子管理 (编辑/删除/更改封面)

**特性**:
- 3列网格展示
- 三点菜单操作
- 退出登录

---

#### MobileProfile.tsx - 移动端个人主页 ⭐独立设计
**功能**: 与Profile.tsx相同，但UI完全重新设计

**移动端优化**:
- 2列网格展示
- 底部弹窗菜单
- 触摸友好的按钮
- 使用MobilePostEditor编辑

**数据API**: 与PC端完全一致
- postsAPI.getAll() - 我的帖子
- collectionsAPI.getUserCollections() - 我的收藏
- GET /mango-moments/user/${userId} - 芒一下

---

#### SearchPage.tsx - 搜索页面
**功能**:
- 标签搜索
- 帖子搜索
- 搜索历史
- 热门标签推荐

---

#### Inbox.tsx - 通知中心
**功能**:
- 点赞通知
- 评论通知
- 收藏通知
- 通知聚合显示

---

#### MapView.tsx - 地图视图
**功能**:
- 地图展示帖子位置
- 城市热力图
- 点击查看帖子详情

---

### 2. 帖子相关组件

#### PostPublisher.tsx - 帖子发布器 (通用版)
**功能**:
- 发布新帖 / 编辑帖子 (双模式)
- 图片上传 (最多9张)
- 拖拽排序
- 封面选择
- 标签系统 (14个热门标签 + 自定义)
- GPS定位
- 位置显示

**Props**:
- editPost?: 编辑模式传入帖子对象
- currentCity: 当前城市

**使用场景**: PC端Community组件

---

#### PostEditor.tsx - 帖子编辑器 (独立组件)
**功能**: 只负责编辑帖子

**特性**:
- 标题: "编辑帖子"
- 按钮: "更新"
- 无GPS定位
- 显示现有位置
- 完整标签系统

**Props**:
- post: 必传，要编辑的帖子

**使用场景**: 独立调用编辑功能

---

#### PostCreator.tsx - 帖子创建器 (独立组件)
**功能**: 只负责发布新帖

**特性**:
- 标题: "发布新帖"
- 按钮: "发布"
- GPS定位功能
- 完整标签系统

**Props**:
- currentCity: 当前城市

**使用场景**: 独立调用发布功能

---

#### MobilePostEditor.tsx - 移动端编辑器 ⭐移动端专属
**功能**: 移动端编辑帖子

**移动端优化**:
- 简化标签系统 (只显示10个热门标签)
- 横向滚动标签
- fontSize: 16px (防止iOS放大)
- 无自定义标签输入
- 无GPS定位

**Props**:
- post: 要编辑的帖子

**使用场景**: MobileProfile组件

---

#### PostList.tsx - 帖子列表
**功能**:
- 瀑布流布局
- 懒加载
- 点击查看详情

---

#### PostDetail.tsx - PC端帖子详情弹窗
**功能**:
- 图片轮播
- 内容展示
- 点赞/收藏
- 评论区
- 作者信息

---

#### PostDetailPage.tsx - 独立详情页
**功能**: 单独页面展示帖子详情

---

#### MobilePostDetail.tsx - 移动端详情页
**功能**: 移动端优化的详情展示

---

### 3. 评论系统组件

#### CommentSection.tsx - 评论区 (旧版)
**功能**: 基础评论功能

---

#### InstagramComment.tsx - Instagram风格评论 ⭐当前使用
**功能**:
- 两层评论结构 (顶层评论 + 回复)
- Instagram排序 (点赞数 + 时间)
- 评论点赞
- @用户名标签 (MentionTag)
- 长文本折叠 (>100字)
- 作者标识
- 折叠展开 (默认显示2条回复)

**数据结构**:
```typescript
{
  id: string
  content: string
  userId: string
  username: string
  postId: string
  parentCommentId: string | null  // 顶层评论为null
  replyToUserId: string | null
  replyToUsername: string | null
  createdAt: Date
  likesCount: number
  isLiked: boolean
  replies: Comment[]  // 嵌套回复
}
```

---

#### MobileCommentDrawer.tsx - 移动端评论抽屉
**功能**:
- 底部抽屉展示
- 使用InstagramComment
- 触摸友好

---

#### MentionTag.tsx - @用户名标签
**功能**:
- 蓝色块状显示
- 退格键删除整块
- 不可编辑

---

### 4. 封面选择器

#### CoverSelector.tsx - PC端封面选择器
**功能**:
- 选择封面
- 拖拽排序
- 4列网格
- 居中弹窗

---

#### MobileCoverSelector.tsx - 移动端封面选择器 ⭐移动端专属
**功能**:
- 选择封面
- 拖拽排序
- 3列网格
- 底部弹窗

**移动端优化**:
- 从底部滑出
- 圆角顶部
- 触摸友好

---

### 5. 头像系统

#### AvatarSelector.tsx - Emoji头像选择器
**功能**:
- 预设Emoji选择
- 分类展示

---

#### AvatarEditorModal.tsx - 高级头像编辑器 ⭐核心功能
**功能**:
- 双模式系统:
  - 系统头像: 9个芒果旅行者角色
  - 上传模式: react-avatar-editor

**高级自定义**:
- 背景颜色 (6预设 + 自定义)
- 缩放滑块 (0.5x-2.0x)
- 位置滑块 (X/Y: 0-100%)
- 滤镜效果 (原图/黑白/复古/小清新)
- 装饰徽章 (VIP/Press/✈️/📷/🎨)

**技术**:
- Canvas导出Base64
- 实时预览

---

### 6. 移动端导航

#### MobileTopBar.tsx - 顶部导航栏
**功能**:
- Logo
- 搜索按钮
- 通知按钮

---

#### MobileBottomBar.tsx - 底部导航栏
**功能**:
- 首页
- 地图
- 发布 (中间大按钮)
- 盲盒
- 我的

**特性**:
- 未登录拦截
- 渐变色发布按钮

---

### 7. 其他组件

#### BlindBox.tsx - 盲盒抽奖
**功能**:
- 随机推荐帖子
- 动画效果
- 未登录拦截

---

#### Toast.tsx - 消息提示
**功能**:
- 成功/错误/警告/信息提示
- 自动消失

---

#### ConfirmDialog.tsx - 确认对话框
**功能**:
- 删除确认
- 操作确认

---

## 🌍 国际化 (src/locales/)

```
locales/
├── translations.json              # 中英文翻译
├── ar.json                        # 阿拉伯语
├── it.json                        # 意大利语
└── ru.json                        # 俄语
```

**支持语言**: 中文、英文、阿拉伯语、意大利语、俄语

---

## 🎣 Hooks (src/hooks/)

```
hooks/
└── useLanguage.ts                 # 语言切换Hook
```

---

## 🌐 Context (src/contexts/)

```
contexts/
└── LanguageContext.tsx            # 语言上下文
```

---

## 🔧 后端结构 (backend/)

### 核心文件
```
backend/
├── package.json                   # 依赖配置
└── src/
    ├── main.ts                    # 入口文件
    ├── app.module.ts              # 主模块
    ├── init-tags.ts               # 初始化标签脚本
    └── recount-tags.ts            # 重新统计标签脚本
```

---

### 模块结构

#### 1. 用户认证模块 (auth/)
```
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
└── user.entity.ts
```

**功能**:
- POST /auth/register - 注册
- POST /auth/login - 登录
- GET /auth/user/:username - 获取用户信息
- POST /auth/avatar - 更新头像
- GET /auth/stats/:username - 获取统计数据

**User实体**:
```typescript
{
  id: string
  username: string
  password: string (加密)
  bio: string
  avatar: string
  createdAt: Date
}
```

---

#### 2. 帖子模块 (posts/)
```
posts/
├── posts.module.ts
├── posts.controller.ts
├── posts.service.ts
└── post.entity.ts
```

**功能**:
- POST /posts - 创建帖子
- GET /posts - 获取帖子列表
- GET /posts/:id - 获取单个帖子
- PUT /posts/:id - 更新帖子
- DELETE /posts/:id - 删除帖子
- GET /posts/city/:city - 按城市筛选
- GET /posts/tag/:tag - 按标签筛选

**Post实体**:
```typescript
{
  id: string
  userId: string
  content: string
  images: string[]
  coverIndex: number
  tags: string[]
  location: string
  city: string
  likesCount: number
  commentsCount: number
  collectionsCount: number
  createdAt: Date
}
```

---

#### 3. 评论模块 (comments/)
```
comments/
├── comments.module.ts
├── comments.controller.ts
├── comments.service.ts
├── comment.entity.ts
└── comment-like.entity.ts
```

**功能**:
- POST /comments - 创建评论
- GET /comments/post/:postId - 获取帖子评论
- DELETE /comments/:id - 删除评论
- POST /comments/:id/like - 点赞评论
- DELETE /comments/:id/like - 取消点赞

**Comment实体**:
```typescript
{
  id: string
  postId: string
  userId: string
  content: string
  parentCommentId: string | null
  replyToUserId: string | null
  likesCount: number
  createdAt: Date
}
```

**CommentLike实体**:
```typescript
{
  id: string
  commentId: string
  userId: string
  createdAt: Date
}
```

---

#### 4. 点赞模块 (likes/)
```
likes/
├── likes.module.ts
├── likes.controller.ts
├── likes.service.ts
└── like.entity.ts
```

**功能**:
- POST /likes - 点赞帖子
- DELETE /likes/:postId - 取消点赞
- GET /likes/post/:postId - 获取帖子点赞列表

**Like实体**:
```typescript
{
  id: string
  postId: string
  userId: string
  createdAt: Date
}
```

---

#### 5. 收藏模块 (collections/)
```
collections/
├── collections.module.ts
├── collections.controller.ts
├── collections.service.ts
└── collection.entity.ts
```

**功能**:
- POST /collections - 收藏帖子
- DELETE /collections/:postId - 取消收藏
- GET /collections/user/:userId - 获取用户收藏

**Collection实体**:
```typescript
{
  id: string
  postId: string
  userId: string
  createdAt: Date
}
```

---

#### 6. 标签模块 (tags/)
```
tags/
├── tags.module.ts
├── tags.controller.ts
├── tags.service.ts
├── tag.entity.ts
└── travel-tags.ts
```

**功能**:
- GET /tags - 获取所有标签
- GET /tags/hot - 获取热门标签
- POST /tags/recount - 重新统计标签数量

**Tag实体**:
```typescript
{
  id: string
  name: string
  count: number
  createdAt: Date
}
```

**预设标签** (travel-tags.ts):
- 克莱因蓝、极简、日系、城市漫游、自然
- 建筑、人文、美食、夜景、胶片
- 街拍、咖啡、书店、博物馆、艺术
- 海边、山景、古镇、寺庙、公园
- 等共50+个旅行标签

---

#### 7. 通知模块 (notifications/)
```
notifications/
├── notifications.module.ts
├── notifications.controller.ts
├── notifications.service.ts
└── notification.entity.ts
```

**功能**:
- GET /notifications/user/:userId - 获取用户通知
- PUT /notifications/:id/read - 标记已读
- DELETE /notifications/:id - 删除通知

**Notification实体**:
```typescript
{
  id: string
  userId: string
  type: 'like' | 'comment' | 'collection'
  postId: string
  fromUserId: string
  content: string
  isRead: boolean
  createdAt: Date
}
```

---

#### 8. 芒一下模块 (mango-moments/)
```
mango-moments/
├── mango-moments.module.ts
├── mango-moments.controller.ts
├── mango-moments.service.ts
└── mango-moment.entity.ts
```

**功能**:
- POST /mango-moments - 创建芒一下
- GET /mango-moments/user/:userId - 获取用户芒一下
- DELETE /mango-moments/:id - 删除芒一下

**MangoMoment实体**:
```typescript
{
  id: string
  userId: string
  destination: string
  description: string
  createdAt: Date
}
```

---

## 🎨 芒果角色素材 (icon/)

```
icon/
├── extract_mangos.py              # Python抠图脚本
├── mango_traveller_1.png          # 芒果旅行者1 (透明背景)
├── mango_traveller_2.png          # 芒果旅行者2
├── mango_traveller_3.png          # 芒果旅行者3
├── mango_traveller_4.png          # 芒果旅行者4
├── mango_traveller_5.png          # 芒果旅行者5
├── mango_traveller_6.png          # 芒果旅行者6
├── mango_traveller_7.png          # 芒果旅行者7
├── mango_traveller_8.png          # 芒果旅行者8
└── mango_traveller_9.png          # 芒果旅行者9
```

**技术**: Pillow + rembg (U2-Net AI抠图)

---

## 📊 数据库结构 (SQLite)

**数据库文件**: `backend/database.sqlite`

**表结构**:
1. user - 用户表
2. post - 帖子表
3. comment - 评论表
4. comment_like - 评论点赞表
5. like - 帖子点赞表
6. collection - 收藏表
7. tag - 标签表
8. notification - 通知表
9. mango_moment - 芒一下表

---

## 🔑 核心功能实现状态

### ✅ 已完成 (60%)

**用户系统**:
- ✅ 注册/登录
- ✅ 头像系统 (Emoji + 上传 + 高级编辑)
- ✅ 个人主页 (PC + 移动端)
- ✅ 统计数据

**帖子系统**:
- ✅ 发布帖子 (图片 + 文字)
- ✅ 编辑帖子
- ✅ 删除帖子
- ✅ 图片上传 (最多9张)
- ✅ 拖拽排序
- ✅ 封面选择
- ✅ GPS定位
- ✅ 城市筛选
- ✅ 标签系统
- ✅ 瀑布流展示

**评论系统**:
- ✅ Instagram风格两层评论
- ✅ 评论点赞
- ✅ @用户名标签
- ✅ 长文本折叠
- ✅ 作者标识
- ✅ 回复功能

**互动系统**:
- ✅ 点赞帖子
- ✅ 收藏帖子
- ✅ 评论帖子

**移动端**:
- ✅ 响应式设计
- ✅ 底部导航栏
- ✅ 移动端专属组件
- ✅ 触摸优化

**其他**:
- ✅ 盲盒抽奖
- ✅ 国际化 (5种语言)
- ✅ Toast提示

---

### 🚧 进行中 (20%)

**通知系统**:
- 🚧 通知聚合
- 🚧 实时推送
- 🚧 通知中心UI

**搜索功能**:
- 🚧 搜索页面完善
- 🚧 搜索历史
- 🚧 热门搜索

**地图功能**:
- 🚧 地图视图完善
- 🚧 城市热力图
- 🚧 位置标记

---

### ⏳ 待开发 (20%)

**社交功能**:
- ⏳ 关注/粉丝系统
- ⏳ 私信功能
- ⏳ 用户主页访问

**内容增强**:
- ⏳ 视频上传
- ⏳ 话题系统
- ⏳ 热门推荐算法

**性能优化**:
- ⏳ 图片CDN
- ⏳ 懒加载优化
- ⏳ 缓存策略

**管理功能**:
- ⏳ 后台管理系统
- ⏳ 内容审核
- ⏳ 数据统计

---

## 🎯 技术亮点

1. **Instagram风格评论系统**
   - 两层评论结构
   - 智能排序算法
   - @用户名标签块

2. **高级头像编辑器**
   - 双模式系统
   - 实时预览
   - Canvas导出
   - 滤镜 + 徽章

3. **移动端独立设计**
   - 完全独立的移动端组件
   - 触摸优化
   - 底部弹窗设计

4. **AI抠图技术**
   - rembg自动背景去除
   - 9个芒果角色素材

5. **组件化架构**
   - PC/移动端组件分离
   - 功能组件独立
   - 易于维护和扩展

---

## 📝 开发规范

**命名规范**:
- 组件: PascalCase (PostEditor.tsx)
- 文件: kebab-case (post-editor.tsx) 或 PascalCase
- 变量: camelCase (showEditor)
- 常量: UPPER_CASE (API_URL)

**组件规范**:
- PC端组件: 直接命名 (Profile.tsx)
- 移动端组件: Mobile前缀 (MobileProfile.tsx)
- 通用组件: 无前缀 (Toast.tsx)

**API规范**:
- RESTful风格
- 统一错误处理
- 统一返回格式

---

## 🚀 启动命令

**前端**:
```bash
cd frontend
npm install
npm run dev
```

**后端**:
```bash
cd backend
npm install
npm run start:dev
```

**访问地址**:
- 前端: http://localhost:5173
- 后端: http://localhost:3000

---

## 📦 依赖包

**前端主要依赖**:
- react: ^18.3.1
- react-router-dom: ^6.x
- lucide-react: 图标库
- react-avatar-editor: 头像编辑
- tailwindcss: CSS框架

**后端主要依赖**:
- @nestjs/core: ^10.x
- @nestjs/typeorm: ORM
- sqlite3: 数据库
- bcrypt: 密码加密
- class-validator: 数据验证

---

## 🎨 设计系统

**主色调**:
- 主蓝色: #0055FF
- 芒果黄: #FFB800
- 青绿色: #00D4AA

**渐变色**:
- 按钮渐变: from-[#0055FF] to-[#00D4AA]
- 头像渐变: from-[#FFB800] to-[#00D4AA]

**圆角**:
- 小圆角: rounded-lg (8px)
- 中圆角: rounded-xl (12px)
- 大圆角: rounded-2xl (16px)
- 超大圆角: rounded-3xl (24px)

---

## 📅 发布计划

**目标发布日期**: 2026-03-18

**剩余任务**:
1. 完善通知系统
2. 优化搜索功能
3. 完善地图视图
4. 性能优化
5. 测试和修复BUG

---

**文档生成时间**: 2026-03-07  
**项目完成度**: 60%  
**下一个里程碑**: 通知系统完成 (预计2026-03-10)
