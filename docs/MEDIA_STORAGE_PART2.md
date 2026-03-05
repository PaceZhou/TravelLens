# MangoGo 媒体调用方案 - 第二部分

## 五、前端调用示例

### 调用1：显示用户头像
```jsx
// 用户头像组件
function UserAvatar({ userId }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
  }, [userId])
  
  return (
    <img 
      src={user?.avatar_url || '/default-avatar.jpg'} 
      alt={user?.username}
      className="w-12 h-12 rounded-full"
    />
  )
}
```

### 调用2：显示帖子图片（多图）
```jsx
// 帖子图片组件
function PostImages({ images }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((img, index) => (
        <img 
          key={index}
          src={img.thumbnail}  // 先显示缩略图（快）
          data-full={img.url}  // 点击后显示原图
          alt={`图片${index + 1}`}
          className="w-full h-full object-cover rounded-lg cursor-pointer"
          onClick={() => openLightbox(img.url)}
        />
      ))}
    </div>
  )
}
```

### 调用3：显示帖子视频
```jsx
// 帖子视频组件
function PostVideo({ video }) {
  return (
    <video 
      poster={video.cover}  // 封面图
      controls
      className="w-full rounded-lg"
    >
      <source src={video.transcoded['720p']} type="video/mp4" />
      <source src={video.transcoded['480p']} type="video/mp4" />
      您的浏览器不支持视频播放
    </video>
  )
}
```

### 调用4：显示景点图片
```jsx
// 景点详情页
function SpotDetail({ spotId }) {
  const [spot, setSpot] = useState(null)
  
  useEffect(() => {
    fetch(`/api/spots/${spotId}`)
      .then(res => res.json())
      .then(data => setSpot(data))
  }, [spotId])
  
  return (
    <div>
      {/* 主图 */}
      <img src={spot?.main_image_url} alt={spot?.name} />
      
      {/* 图片库 */}
      <div className="gallery">
        {spot?.gallery_images?.map((img, index) => (
          <img key={index} src={img.thumbnail} alt={img.caption} />
        ))}
      </div>
      
      {/* 介绍视频 */}
      {spot?.intro_video_url && (
        <video poster={spot.video_cover_url} controls>
          <source src={spot.intro_video_url} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
```

---

## 六、后端API实现

### API 1：上传头像
```javascript
// POST /api/upload/avatar
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

async function uploadAvatar(req, res) {
  const { userId } = req.body
  const file = req.file  // multer中间件处理
  
  // 生成唯一文件名
  const fileName = `${userId}_${Date.now()}.jpg`
  const filePath = `users/avatars/${fileName}`
  
  // 上传到S3/OSS
  const s3 = new S3Client({ region: 'us-east-1' })
  await s3.send(new PutObjectCommand({
    Bucket: 'mangogo-bucket',
    Key: filePath,
    Body: file.buffer,
    ContentType: 'image/jpeg'
  }))
  
  // 生成CDN URL
  const cdnUrl = `https://cdn.mangogo.com/${filePath}`
  
  // 更新数据库
  await db.query(
    'UPDATE users SET avatar_url = ? WHERE id = ?',
    [cdnUrl, userId]
  )
  
  res.json({ url: cdnUrl })
}
```

### API 2：上传帖子图片
```javascript
// POST /api/upload/post-images
async function uploadPostImages(req, res) {
  const files = req.files  // 多文件上传
  const urls = []
  
  for (const file of files) {
    // 生成文件名
    const fileName = `post-${Date.now()}-${Math.random()}.jpg`
    const filePath = `posts/images/${new Date().toISOString().split('T')[0]}/${fileName}`
    
    // 上传原图
    await uploadToS3(filePath, file.buffer)
    const url = `https://cdn.mangogo.com/${filePath}`
    
    // 生成缩略图
    const thumbnail = await generateThumbnail(file.buffer)
    const thumbPath = `posts/images/thumbnails/${fileName.replace('.jpg', '_thumb.jpg')}`
    await uploadToS3(thumbPath, thumbnail)
    const thumbUrl = `https://cdn.mangogo.com/${thumbPath}`
    
    urls.push({
      url,
      thumbnail: thumbUrl,
      width: file.width,
      height: file.height
    })
  }
  
  res.json({ images: urls })
}
```

---

## 七、CDN加速配置

### 为什么需要CDN？
```
用户在北京访问：
- 直接访问OSS（上海）：延迟 50ms
- 通过CDN（北京节点）：延迟 5ms

10倍速度提升！
```

### CDN配置
```javascript
// 阿里云CDN配置
const cdnDomain = 'cdn.mangogo.com'
const ossBucket = 'mangogo-bucket.oss-cn-shanghai.aliyuncs.com'

// 所有文件URL自动走CDN
function getCdnUrl(ossPath) {
  return `https://${cdnDomain}/${ossPath}`
}
```

---

## 八、图片优化策略

### 1. 自动压缩
```javascript
// 前端上传前压缩
import imageCompression from 'browser-image-compression'

async function compressImage(file) {
  const options = {
    maxSizeMB: 1,          // 最大1MB
    maxWidthOrHeight: 1920, // 最大宽高
    useWebWorker: true
  }
  return await imageCompression(file, options)
}
```

### 2. 响应式图片
```jsx
// 根据屏幕尺寸加载不同大小
<img 
  srcSet={`
    ${image.thumbnail} 300w,
    ${image.url} 1920w
  `}
  sizes="(max-width: 768px) 300px, 1920px"
  src={image.url}
/>
```

### 3. 懒加载
```jsx
// 只加载可见区域的图片
<img 
  src={image.thumbnail}
  loading="lazy"
  alt="..."
/>
```

---

**继续第三部分...**
