import { useState, useEffect } from 'react'
import { X, Heart, MessageCircle, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import InstagramComment from './InstagramComment'

interface Post {
  id: string
  author: string
  avatar: string
  location: string
  image: string
  images?: string[]
  content: string
  tags: string[]
  likes: number
  comments: number
  time: string
  user?: { username: string }
}

interface PostDetailProps {
  post: Post | null
  onClose: () => void
  onLike: (postId: string) => void
  onCollect: (postId: string) => void
  isLiked: boolean
  isCollected: boolean
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
}

export default function PostDetail({ post, onClose, onLike, onCollect, isLiked, isCollected }: PostDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  if (!post) return null

  const images = post.images || [post.image] || []

  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-[9998]" onClick={onClose}></div>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl h-[90vh] bg-black flex rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
          
          {/* 左侧：图片区 */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {images.length > 0 && (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt="Post"
                  className="max-w-full max-h-full object-contain"
                />
                {images.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev - 1)}
                        className="absolute left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}
                    {currentImageIndex < images.length - 1 && (
                      <button
                        onClick={() => setCurrentImageIndex(prev => prev + 1)}
                        className="absolute right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* 右侧：Instagram风格内容区 */}
          <div className="w-[400px] bg-white flex flex-col">
            {/* 顶部：用户信息 */}
            <div className="flex items-center justify-between p-4 border-b">
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-75"
                onClick={() => { navigate(`/users/${post.user?.username || post.author}`); onClose(); }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-sm">
                  👤
                </div>
                <span className="font-semibold text-sm">{post.user?.username || post.author}</span>
              </div>
              <button onClick={onClose} className="hover:opacity-50">
                <X size={24} />
              </button>
            </div>

            {/* 中间：帖子内容和评论 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* 帖子内容 */}
              <div className="px-4 py-3 border-b">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-sm flex-shrink-0">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-semibold mr-2">{post.user?.username || post.author}</span>
                      <span className="text-gray-900">{post.content}</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="text-[#0095f6] text-xs">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instagram评论组件 */}
              <InstagramComment postId={post.id} />
            </div>

            {/* 底部：操作栏 */}
            <div className="border-t">
              <div className="flex items-center gap-4 px-4 py-3">
                <button onClick={(e) => { e.stopPropagation(); onLike(post.id); }} className="hover:opacity-50">
                  <Heart size={24} fill={isLiked ? '#ed4956' : 'none'} stroke={isLiked ? '#ed4956' : 'currentColor'} />
                </button>
                <button className="hover:opacity-50">
                  <MessageCircle size={24} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onCollect(post.id); }} className="ml-auto hover:opacity-50">
                  <Bookmark size={24} fill={isCollected ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="px-4 pb-3">
                <div className="font-semibold text-sm">{post.likes} 次赞</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
