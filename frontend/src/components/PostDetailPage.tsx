import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, Heart, MessageCircle, Bookmark } from 'lucide-react'
import { postsAPI } from '../api/posts'
import { likesAPI } from '../api/likes'
import { collectionsAPI } from '../api/collections'

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!postId) return
    
    // 加载帖子详情
    postsAPI.getAll(1, 1000).then(result => {
      const foundPost = result.posts.find((p: any) => p.id === postId)
      if (foundPost) {
        setPost({
          id: foundPost.id,
          author: foundPost.user?.username || '未知用户',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
          location: foundPost.location || '未知位置',
          image: foundPost.images?.[0] || '',
          images: foundPost.images || [],
          content: foundPost.content,
          tags: foundPost.tags || [],
          likes: foundPost.likes || 0,
          comments: foundPost.comments || 0,
          time: new Date(foundPost.createdAt).toLocaleString('zh-CN')
        })
        
        // 检查用户是否已点赞/收藏
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user.id) {
          likesAPI.check(user.id, postId).then(res => setIsLiked(res.liked))
          collectionsAPI.check(user.id, postId).then(res => setIsCollected(res.collected))
        }
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [postId])

  const handleLike = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      alert('请先登录')
      return
    }
    
    const result = await likesAPI.toggle(user.id, postId!)
    setIsLiked(result.liked)
    if (post) {
      setPost({ ...post, likes: post.likes + (result.liked ? 1 : -1) })
    }
  }

  const handleCollect = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) {
      alert('请先登录')
      return
    }
    
    const result = await collectionsAPI.toggle(user.id, postId!)
    setIsCollected(result.collected)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>加载中...</p></div>
  }

  if (!post) {
    return <div className="flex items-center justify-center min-h-screen"><p>帖子不存在</p></div>
  }

  const images = post.images || [post.image] || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 flex items-center gap-2">
          <X size={20} /> 返回
        </button>
        
        <div className="flex bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex-1 flex items-center justify-center bg-black">
            <div className="relative w-full h-[800px] flex items-center justify-center" onWheel={(e) => {
              e.preventDefault()
              if (e.deltaY > 0 && currentImageIndex < images.length - 1) {
                setCurrentImageIndex(currentImageIndex + 1)
              } else if (e.deltaY < 0 && currentImageIndex > 0) {
                setCurrentImageIndex(currentImageIndex - 1)
              }
            }}>
              <img src={images[currentImageIndex]} alt="Post" className="max-w-full max-h-full object-contain" />
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
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                <div>
                  <div className="font-bold">{post.author}</div>
                  <div className="text-sm text-gray-500">{post.time}</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-gray-900 mb-4">{post.content}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-[#0055FF] text-sm">#{tag}</span>
                ))}
              </div>
              <div className="text-gray-500 text-sm">暂无评论</div>
            </div>
            
            <div className="p-6 border-t flex items-center gap-6">
              <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}>
                <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-[#0055FF]">
                <MessageCircle size={24} />
                <span className="font-medium">{post.comments}</span>
              </button>
              <button onClick={handleCollect} className={`flex items-center gap-2 transition-colors ${isCollected ? 'text-[#FFB800]' : 'text-gray-700 hover:text-[#FFB800]'}`}>
                <Bookmark size={24} fill={isCollected ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
