import { useState, useEffect } from 'react'
import { Camera, Search, Shuffle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { postsAPI } from '../api/posts'
import { likesAPI } from '../api/likes'
import { collectionsAPI } from '../api/collections'
import Toast from './Toast'
import PostPublisher from './PostPublisher'
import PostDetail from './PostDetail'
import PostList from './PostList'

const keywords = ['全部', '克莱因蓝', '极简', '日系', '城市漫游', '自然']

export default function Community({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useLanguage()
  const [feedSort, setFeedSort] = useState('latest')
  const [activeKeyword, setActiveKeyword] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [currentCity, setCurrentCity] = useState('全部')
  const [showUpload, setShowUpload] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [collectedPosts, setCollectedPosts] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const loadPosts = async (pageNum: number = 1) => {
    if (isLoading) return
    setIsLoading(true)
    
    try {
      const result = await postsAPI.getAll(pageNum, 50)
      const formattedPosts = result.posts.map((p: any) => ({
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
      
      if (pageNum === 1) {
        setPosts(formattedPosts)
      } else {
        setPosts(prev => [...prev, ...formattedPosts])
      }
      
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('加载失败', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPosts(1)
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPosts(nextPage)
  }

  const handleLike = async (postId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      showToast('请先登录', 'error')
      return
    }
    
    try {
      const result = await likesAPI.toggle(user.id, postId)
      if (result.liked) {
        setLikedPosts(prev => new Set(prev).add(postId))
      } else {
        setLikedPosts(prev => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          return newSet
        })
      }
      loadPosts(1)
      setPage(1)
    } catch (error) {
      showToast('操作失败', 'error')
    }
  }

  const handleCollect = async (postId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      showToast('请先登录', 'error')
      return
    }
    
    try {
      const result = await collectionsAPI.toggle(user.id, postId)
      if (result.collected) {
        setCollectedPosts(prev => new Set(prev).add(postId))
        showToast('收藏成功', 'success')
      } else {
        setCollectedPosts(prev => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          return newSet
        })
        showToast('取消收藏', 'info')
      }
    } catch (error) {
      showToast('操作失败', 'error')
    }
  }

  const handlePublishClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true)
    } else {
      setShowUpload(true)
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
          <button
            onClick={handlePublishClick}
            className="px-8 py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-2xl font-black text-lg hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Camera size={24} />
            发布新帖
          </button>
        </div>

        {/* 筛选器 */}
        <div className="flex flex-wrap gap-3 mb-4">
          {keywords.map(keyword => (
            <button
              key={keyword}
              onClick={() => setActiveKeyword(keyword)}
              className={`px-6 py-3 rounded-full font-bold transition-all ${
                activeKeyword === keyword
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {keyword}
            </button>
          ))}
        </div>

        {/* 搜索栏 */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索地点、标签、用户..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-[#0055FF] outline-none transition-colors font-medium"
            />
          </div>
          <button className="px-6 py-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-bold">
            <Shuffle size={20} />
            随机
          </button>
        </div>
      </div>

      {/* 帖子列表 */}
      <PostList
        posts={posts}
        onPostClick={(index) => setSelectedPost(index)}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />

      {/* 发布弹窗 */}
      <PostPublisher
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onPublishSuccess={() => {
          loadPosts(1)
          setPage(1)
        }}
        showToast={showToast}
        currentCity={currentCity}
      />

      {/* 详情浮窗 */}
      {selectedPost !== null && (
        <PostDetail
          post={posts[selectedPost]}
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
          onCollect={handleCollect}
          isLiked={likedPosts.has(posts[selectedPost]?.id)}
          isCollected={collectedPosts.has(posts[selectedPost]?.id)}
          showToast={showToast}
        />
      )}

      {/* 登录提示 */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <h3 className="text-2xl font-black mb-4">需要登录</h3>
            <p className="text-gray-600 mb-6">登录后即可发布精彩内容</p>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-2xl font-black text-lg"
            >
              知道了
            </button>
          </div>
        </div>
      )}

      {/* Toast通知 */}
      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  )
}
