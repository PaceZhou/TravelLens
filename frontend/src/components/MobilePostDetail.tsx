import { useState } from 'react'
import { X, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'

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
  user?: { username: string }
}

interface MobilePostDetailProps {
  post: Post | null
  onClose: () => void
  onLike: (postId: string) => void
  onCollect: (postId: string) => void
  isLiked: boolean
  isCollected: boolean
}

/**
 * 移动端全屏帖子详情
 * 类似Instagram Reels风格
 */
export default function MobilePostDetail({ post, onClose, onLike, onCollect, isLiked, isCollected }: MobilePostDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!post) return null

  const images = post.images || [post.image] || []

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* 顶部关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center"
      >
        <X size={24} className="text-white" />
      </button>

      {/* 全屏图片 */}
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={images[currentImageIndex]}
          alt={post.content}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 右侧功能图标 */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-6">
        {/* 点赞 */}
        <button
          onClick={() => onLike(post.id)}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <Heart
              size={28}
              className={isLiked ? 'text-red-500' : 'text-white'}
              fill={isLiked ? 'currentColor' : 'none'}
            />
          </div>
          <span className="text-white text-xs font-bold">{post.likes}</span>
        </button>

        {/* 评论 */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle size={28} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold">{post.comments}</span>
        </button>

        {/* 收藏 */}
        <button
          onClick={() => onCollect(post.id)}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <Bookmark
              size={28}
              className={isCollected ? 'text-[#FFB800]' : 'text-white'}
              fill={isCollected ? 'currentColor' : 'none'}
            />
          </div>
        </button>

        {/* 分享 */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <Share2 size={28} className="text-white" />
          </div>
        </button>
      </div>

      {/* 底部用户信息和内容 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-sm">
            👤
          </div>
          <span className="text-white font-bold">{post.user?.username || post.author}</span>
        </div>
        <p className="text-white text-sm leading-relaxed">{post.content}</p>
      </div>
    </div>
  )
}
