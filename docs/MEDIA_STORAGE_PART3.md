# MangoGo 用户主页装饰系统

## 九、用户主页完整设计

### 数据库表：user_profiles（用户主页配置）
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- 主页封面
  cover_url TEXT,
  -- 示例：https://cdn.mangogo.com/users/covers/123.jpg
  
  -- 主页背景
  background_type ENUM('image', 'gradient', 'video') DEFAULT 'gradient',
  background_url TEXT,
  background_gradient JSON,  -- {"from": "#FF6B6B", "to": "#4ECDC4"}
  
  -- 装饰元素
  badge_url TEXT,           -- 徽章
  frame_url TEXT,           -- 头像框
  title_text VARCHAR(50),   -- 个性签名
  title_color VARCHAR(20),  -- 签名颜色
  
  -- 主页布局
  layout_type ENUM('grid', 'waterfall', 'timeline') DEFAULT 'waterfall',
  
  -- 主页音乐
  bgm_url TEXT,
  bgm_name VARCHAR(100),
  
  -- 主页特效
  effects JSON,  -- {"snow": true, "fireworks": false}
  
  -- 主页主题
  theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 调用示例：用户主页
```jsx
function UserProfile({ userId }) {
  const [profile, setProfile] = useState(null)
  
  useEffect(() => {
    fetch(`/api/users/${userId}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data))
  }, [userId])
  
  return (
    <div className="user-profile">
      {/* 主页封面 */}
      <div 
        className="cover"
        style={{
          backgroundImage: `url(${profile?.cover_url})`,
          backgroundSize: 'cover'
        }}
      />
      
      {/* 用户头像（带装饰框） */}
      <div className="avatar-container">
        {profile?.frame_url && (
          <img src={profile.frame_url} className="avatar-frame" />
        )}
        <img src={profile?.avatar_url} className="avatar" />
        {profile?.badge_url && (
          <img src={profile.badge_url} className="badge" />
        )}
      </div>
      
      {/* 个性签名 */}
      <h2 style={{ color: profile?.title_color }}>
        {profile?.title_text}
      </h2>
      
      {/* 背景音乐 */}
      {profile?.bgm_url && (
        <audio src={profile.bgm_url} autoPlay loop />
      )}
    </div>
  )
}
```

---

## 十、完整的文件类型支持

### 支持的文件类型
```javascript
const ALLOWED_FILE_TYPES = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  videos: ['.mp4', '.mov', '.avi'],
  audio: ['.mp3', '.wav'],
  documents: ['.pdf']
}

const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024,    // 10MB
  video: 100 * 1024 * 1024,   // 100MB
  audio: 10 * 1024 * 1024,    // 10MB
  avatar: 2 * 1024 * 1024     // 2MB
}
```

---

## 十一、总结：完整的媒体系统

### 文件存储位置
```
云存储（OSS/S3）
├── 用户头像
├── 用户封面
├── 用户装饰
├── 帖子图片
├── 帖子视频
├── 景点图片
├── 景点视频
└── 评论图片
```

### 数据库存储内容
```
只存储URL，不存储文件
- users.avatar_url
- users.cover_url
- posts.images (JSON数组)
- posts.videos (JSON数组)
- spots.main_image_url
- spots.gallery_images (JSON数组)
```

### 调用流程
```
1. 前端上传文件 → 后端API
2. 后端上传到OSS → 获取URL
3. URL保存到数据库
4. 前端通过URL显示文件
5. CDN加速访问
```

---

**老板，这样媒体存储和调用方案完整了吗？**
