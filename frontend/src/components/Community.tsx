import { useState, useEffect } from 'react'
import { Heart, Clock, MapPin, Hash, Camera, Search, Shuffle, X, ChevronUp, ChevronDown, ChevronRight, MessageCircle, MoreVertical, Trash2, Bookmark, Smile, Send } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { postsAPI } from '../api/posts'
import { commentsAPI } from '../api/comments'
import Toast from './Toast'

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Vivid_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    location: '重庆 · 洪崖洞',
    city: '重庆',
    image: 'https://images.unsplash.com/photo-1558281050-8cbbeafc6007?auto=format&fit=crop&q=80&w=800',
    content: '大雨过后的洪崖洞简直是重庆版赛博朋克！给大家分享一个完全没人的倒影机位！☔️',
    tags: ['赛博朋克', '夜景', '废土风'],
    likes: 8942,
    comments: 234,
    time: '10分钟前'
  },
  {
    id: 2,
    author: 'Nomad_Leon',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
    location: '冰岛 · 维克黑沙滩',
    city: '冰岛',
    image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=800',
    content: '抽到了全球盲盒！连夜飞冰岛。外星地貌的黑沙滩，配上今天阴冷的天气，出片率极高。',
    tags: ['暗黑风', '世界尽头', '极简'],
    likes: 3210,
    comments: 89,
    time: '2小时前'
  },
  {
    id: 3,
    author: '胶片爱好者',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
    location: '镰仓 · 湘南海岸',
    city: '镰仓',
    image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800',
    content: '终于拍到了江之电！建议大家不要在十字路口扎堆，往前走200米的坡道上人少很多。',
    tags: ['胶片', '日系', '看海'],
    likes: 1540,
    time: '5小时前'
  },
  {
    id: 4,
    author: 'Urban_Explorer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    location: '北京 · 故宫',
    city: '北京',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
    content: '故宫角楼日落，等了3天终于等到完美光线！',
    tags: ['历史', '建筑', '日落'],
    likes: 2100,
    time: '1天前'
  }
]

const keywords = ['全部', '克莱因蓝', '极简', '日系', '城市漫游', '自然']

export default function Community({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useLanguage()
  const [feedSort, setFeedSort] = useState('latest')
  const [activeKeyword, setActiveKeyword] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [currentCity, setCurrentCity] = useState('全部')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [postContent, setPostContent] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [replyTo, setReplyTo] = useState<{ userId: string; username: string } | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }
  const [customTag, setCustomTag] = useState('')
  const [posts, setPosts] = useState(COMMUNITY_POSTS)

  // 从数据库加载帖子
  useEffect(() => {
    postsAPI.getAll().then(dbPosts => {
      if (dbPosts.length > 0) {
        const formattedPosts = dbPosts.map((p: any) => ({
          id: p.id,
          author: p.user?.username || '未知用户',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          location: p.location || '未知位置',
          city: p.city || '北京',
          image: p.images?.[0] || '',
          content: p.content,
          tags: p.tags || [],
          likes: p.likes || 0,
          comments: p.comments || 0,
          time: new Date(p.createdAt).toLocaleString('zh-CN')
        }))
        setPosts([...formattedPosts, ...COMMUNITY_POSTS])
      }
    }).catch(() => {})
  }, [])

  // 从数据库加载帖子
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    postsAPI.getAll().then(dbPosts => {
      const formattedPosts = dbPosts.map((p: any) => ({
        id: p.id,
        author: p.user?.username || '未知用户',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        location: p.location || '未知位置',
        city: p.city || '未知',
        image: p.images?.[0] || '',
        images: p.images || [],
        content: p.content,
        tags: p.tags || [],
        likes: p.likes || 0,
        comments: p.comments || 0,
        time: new Date(p.createdAt).toLocaleString('zh-CN')
      }))
      setPosts([...formattedPosts, ...COMMUNITY_POSTS])
    }).catch(() => {})
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('确定删除这条帖子吗？')) return
    try {
      await postsAPI.delete(postId)
      setOpenMenuId(null)
      loadPosts()
      showToast('删除成功', 'success')
    } catch (error) {
      showToast('删除失败', 'error')
    }
  }

  // ESC键退出功能
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showUpload) {
          setShowUpload(false)
        } else if (selectedPost !== null) {
          setSelectedPost(null)
        }
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showUpload, selectedPost])
      {/* 帖子详情浮窗 */}
      {selectedPost !== null && (() => {
        const post = posts[selectedPost]
        const images = post.images || [post.image] || []
        return (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="flex bg-white rounded-3xl overflow-hidden shadow-2xl w-[1200px] h-[800px]">
              <div className="flex-1 flex items-center justify-center relative">
                <div className="relative w-full h-full flex items-center justify-center"
                  onWheel={(e) => {
                    e.preventDefault()
                    if (e.deltaY > 0 && currentImageIndex < images.length - 1) {
                      setCurrentImageIndex(currentImageIndex + 1)
                    } else if (e.deltaY < 0 && currentImageIndex > 0) {
                      setCurrentImageIndex(currentImageIndex - 1)
                    }
                  }}>
                  <img src={images[currentImageIndex]} alt="Post" className="w-full h-full object-contain" />
                  {images.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_: any, idx: number) => (
                        <div key={idx} className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-[400px] bg-white flex flex-col">
                <div className="p-6 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                    <div>
                      <div className="font-bold">{post.author}</div>
                      <div className="text-sm text-gray-500">{post.time}</div>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedPost(null); setCurrentImageIndex(0); }} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <p className="text-gray-900 mb-4">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag: string) => <span key={tag} className="text-[#0055FF] text-sm">#{tag}</span>)}
                  </div>
                  <div className="text-gray-500 text-sm">暂无评论</div>
                </div>
                <div className="p-6 border-t flex items-center gap-6">
                  <button onClick={async (e) => { e.stopPropagation(); try { await postsAPI.like(post.id); loadPosts(); } catch (error) { console.error('点赞失败', error); }}} className="flex items-center gap-2 text-gray-700 hover:text-red-500">
                    <Heart size={24} /><span className="font-medium">{post.likes}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); showToast('评论功能开发中', 'info'); }} className="flex items-center gap-2 text-gray-700 hover:text-[#0055FF]">
                    <MessageCircle size={24} /><span className="font-medium">{post.comments}</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); showToast('收藏功能开发中', 'info'); }} className="flex items-center gap-2 text-gray-700 hover:text-[#FFB800]">
                    <Bookmark size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}



  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    const newImages: string[] = []
    Array.from(files).slice(0, 9 - uploadedImages.length).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string)
          if (newImages.length === Math.min(files.length, 9 - uploadedImages.length)) {
            setUploadedImages([...uploadedImages, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // 删除图片
  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  // 移动图片位置
  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...uploadedImages]
    const [moved] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, moved)
    setUploadedImages(newImages)
  }

  // 发布内容
  const handlePublish = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
      return
    }
    if (!postContent.trim() && uploadedImages.length === 0) {
      setToast({ type: 'warning', message: '请添加内容或图片' })
      return
    }
    
    try {
      // 获取当前用户ID
      const savedUser = localStorage.getItem('user')
      const userId = savedUser ? JSON.parse(savedUser).id : ''
      
      // 保存到数据库
      const savedPost = await postsAPI.create(userId, {
        content: postContent,
        images: uploadedImages,
        tags: selectedTags,
        location: '未知位置',
        city: currentCity === '全部' ? '北京' : currentCity,
      })
      
      // 添加到本地列表
      const newPost = {
        id: savedPost.id,
        author: '我',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        location: savedPost.location,
        city: savedPost.city,
        image: uploadedImages[0] || '',
        content: postContent,
        tags: selectedTags,
        likes: 0,
        comments: 0,
        time: '刚刚'
      }
      
      setPosts([newPost, ...posts])
      setToast({ type: 'success', message: '发布成功！' })
      setShowUpload(false)
      setUploadedImages([])
      setPostContent('')
      setSelectedTags([])
    } catch (err) {
      setToast({ type: 'error', message: '发布失败，请重试' })
    }
  }

  const cities = ['全部', '同城', '北京', '重庆', '冰岛', '镰仓']

  const handleRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * COMMUNITY_POSTS.length)
    setSelectedPost(randomIndex)
  }

  const handleSwipe = (direction: 'up' | 'down') => {
    if (selectedPost === null) return
    
    if (direction === 'up' && selectedPost < COMMUNITY_POSTS.length - 1) {
      setSelectedPost(selectedPost + 1)
    } else if (direction === 'down' && selectedPost > 0) {
      setSelectedPost(selectedPost - 1)
    }
  }




  return (
    <div className="flex-1 bg-[#F8F9FA] px-4 py-8 min-h-screen max-w-7xl mx-auto w-full">
      
      {/* 频道头部 */}
      <div className="mb-8 sticky top-20 z-30 bg-[#F8F9FA]/90 backdrop-blur-xl pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-gray-900">
              世界频道 <span className="bg-[#CCFF00] text-gray-900 text-sm px-2 py-1 rounded-sm font-bold shadow-sm">LIVE</span>
            </h2>
            <p className="text-gray-500 text-base mt-2 font-medium">全球玩家正在这些坐标出没，交流前沿出片情报。</p>
          </div>
          
          {/* 排序按钮 */}
          <div className="flex gap-2">
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
              <button 
                onClick={() => setFeedSort('latest')} 
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'latest' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500'}`}
              >
                最新
              </button>
              <button 
                onClick={() => setFeedSort('hot')} 
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'hot' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500'}`}
              >
                热门
              </button>
              <button 
                onClick={() => setFeedSort('city')} 
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'city' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500'}`}
              >
                城市
              </button>
            </div>
            
            <button 
              onClick={handleRandomPick}
              className="px-4 py-2 bg-[#CCFF00] rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-[#b8e600] transition-colors"
            >
              <Shuffle size={16} /> 随机
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索地点、标签或用户..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl font-medium focus:outline-none focus:border-[#0055FF]"
            />
          </div>
        </div>

        {/* 城市筛选 */}
        {feedSort === 'city' && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
            {cities.map(city => (
              <button 
                key={city}
                onClick={() => setCurrentCity(city)}
                className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-bold transition-all ${currentCity === city ? 'border-[#0055FF] bg-[#0055FF]/5 text-[#0055FF]' : 'border-gray-200 bg-white text-gray-600'}`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {/* 关键词滚动栏 */}
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {keywords.map(kw => (
            <button 
              key={kw}
              onClick={() => setActiveKeyword(kw)}
              className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-bold transition-all flex items-center ${activeKeyword === kw ? 'border-[#0055FF] bg-[#0055FF]/5 text-[#0055FF]' : 'border-gray-200 bg-white text-gray-600'}`}
            >
              {kw !== '全部' && <Hash size={14} className="mr-1 opacity-50" />}
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* 瀑布流 - 4列布局，居中对齐 */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 max-w-[1400px] mx-auto">
        {posts
          .filter(post => {
            if (currentCity !== '全部' && post.city !== currentCity) return false
            if (activeKeyword !== '全部' && !post.tags.includes(activeKeyword)) return false
            if (searchQuery && !post.content.includes(searchQuery)) return false
            return true
          })
          .map((post, index) => {
            // 获取第一张图片
            const imageUrl = post.image || (post.images && post.images[0]) || ''
            
            return (
          <div 
            key={post.id} 
            onClick={() => setSelectedPost(index)}
            className="break-inside-avoid bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2rem] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,85,255,0.08)] transition-all duration-300 group cursor-pointer"
          >
            <div className="relative p-2 pb-0">
              <div className="relative rounded-[1.5rem] overflow-hidden">
                <img src={imageUrl} alt="Post" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center text-xs font-black text-gray-900 shadow-sm">
                  <MapPin size={12} className="mr-1 text-[#0055FF]" /> {post.location}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-900 text-base leading-relaxed mb-4 font-bold">
                {post.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[#0055FF] bg-blue-50 px-2 py-1 rounded-md text-xs font-bold">#{tag}</span>
                ))}
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-gray-200" />
                  <span className="text-sm text-gray-900 font-bold">{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation()
                      try {
                        await postsAPI.like(post.id)
                        loadPosts()
                      } catch (error) {
                        console.error('点赞失败', error)
                      }
                    }}
                    className="flex items-center hover:text-[#0055FF] transition-colors bg-gray-50 px-3 py-1.5 rounded-lg"
                  >
                    <Heart size={16} className="mr-1.5" /> {post.likes}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      showToast('评论功能开发中', 'info')
                    }}
                    className="flex items-center hover:text-[#0055FF] transition-colors bg-gray-50 px-3 py-1.5 rounded-lg"
                  >
                    <MessageCircle size={16} className="mr-1.5" /> {post.comments}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      showToast('收藏功能开发中', 'info')
                    }}
                    className="flex items-center hover:text-[#FFB800] transition-colors bg-gray-50 px-3 py-1.5 rounded-lg"
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
            )
          }
        )}
      </div>
      
      {/* 悬浮发布按钮 - 右下角 */}
      <button 
        onClick={() => setShowUpload(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#0055FF] rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 hover:scale-110 hover:-translate-y-2 transition-all z-40"
      >
        <Camera size={26} className="text-white" />
      </button>

      {/* 上传浮窗 - 优化尺寸和样式 */}
      {showUpload && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[9998]" onClick={() => setShowUpload(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1400px] max-w-[90vw] h-[85vh] bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-3xl rounded-[2rem] z-[9999] overflow-y-auto shadow-2xl border border-white/50">
            <div className="p-6">
              {/* 顶部标题 */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4">
                <h2 className="text-2xl font-black">📸 发布内容</h2>
                <button onClick={() => setShowUpload(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* 上传选项 - 文件上传 */}
              <div className="mb-6">
                <input 
                  type="file" 
                  id="photo-upload" 
                  accept="image/*,video/*" 
                  multiple 
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadedImages.length >= 9}
                />
                <label 
                  htmlFor="photo-upload"
                  className={`block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl hover:scale-[1.02] transition-transform ${uploadedImages.length >= 9 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">🖼️</span>
                    <span className="font-bold text-lg">{t.community.selectPhoto} ({uploadedImages.length}/9)</span>
                  </div>
                </label>
              </div>

              {/* 图片预览网格 */}
              {uploadedImages.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">已选择的图片</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group aspect-square w-[120px] h-[120px]">
                        <img src={img} alt={`上传图片 ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                          {index > 0 && (
                            <button onClick={() => moveImage(index, index - 1)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              ←
                            </button>
                          )}
                          <button onClick={() => removeImage(index)} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                            ✕
                          </button>
                          {index < uploadedImages.length - 1 && (
                            <button onClick={() => moveImage(index, index + 1)} className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              →
                            </button>
                          )}
                        </div>
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#0055FF] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 文字内容输入 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-700">分享你的故事</label>
                  <button className="text-xs font-bold text-[#0055FF] px-3 py-1 bg-blue-50 rounded-full">
                    ✨ AI润色 (即将上线)
                  </button>
                </div>
                <textarea 
                  placeholder="记录这一刻的美好..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-[#0055FF] transition-colors"
                ></textarea>
              </div>

              {/* 快捷标签 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">添加标签</h3>
                  <button className="text-xs font-bold text-purple-500 px-3 py-1 bg-purple-50 rounded-full">
                    🤖 AI推荐 (即将上线)
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['打卡', '美食', '风景', '建筑', '人像', '日落', '街拍', '旅行'].map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag))
                        } else {
                          setSelectedTags([...selectedTags, tag])
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        selectedTags.includes(tag) 
                          ? 'bg-[#0055FF] text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="自定义标签..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0055FF]"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && customTag.trim()) {
                        setSelectedTags([...selectedTags, customTag.trim()])
                        setCustomTag('')
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (customTag.trim()) {
                        setSelectedTags([...selectedTags, customTag.trim()])
                        setCustomTag('')
                      }
                    }}
                    className="px-6 py-2 bg-[#0055FF] text-white rounded-xl font-bold hover:bg-[#0044DD]"
                  >
                    添加
                  </button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#0055FF] text-white rounded-full text-sm font-bold flex items-center gap-2">
                        #{tag}
                        <button onClick={() => setSelectedTags(selectedTags.filter((_, i) => i !== idx))} className="hover:text-red-300">✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 定位信息 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">位置信息</h3>
                <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-[#0055FF]" />
                    <span className="font-bold text-gray-600">添加位置</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>

              {/* 照片信息读取 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">照片信息</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">📍 拍摄地点</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📷 相机型号</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⚙️ 曝光参数</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🕐 拍摄时间</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                </div>
              </div>

              {/* 图像美化 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">图像美化</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['自动增强', '滤镜', '裁剪'].map(option => (
                    <button key={option} className="p-3 bg-gray-100 rounded-xl text-sm font-bold hover:bg-[#CCFF00] transition-colors">
                      {option}
                      <div className="text-xs text-gray-500 mt-1">即将上线</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 发布按钮 */}
              <button 
                onClick={handlePublish}
                className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black text-lg rounded-2xl hover:shadow-xl transition-all"
              >
                {t.community.publish}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 登录提示弹窗 */}
      {showLoginPrompt && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[10000]" onClick={() => setShowLoginPrompt(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-3xl z-[10001] p-8 shadow-2xl text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-black mb-4">需要登录</h2>
            <p className="text-gray-600 mb-6">登录后即可发布内容</p>
            <button 
              onClick={() => {
                setShowLoginPrompt(false)
                window.dispatchEvent(new CustomEvent('openAuth', { detail: 'login' }))
              }}
              className="w-full py-3 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black rounded-xl hover:shadow-xl transition-all"
            >
              立即登录
            </button>
          </div>
        </>
      )}

      {/* Toast提示 */}
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}
