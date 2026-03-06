import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Heart, MessageCircle, Bookmark } from 'lucide-react'
import CommentSection from './CommentSection'

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

export default function PostDetail({ post, onClose, onLike, onCollect, isLiked, isCollected, showToast }: PostDetailProps) {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" onClick={(e) => e.stopPropagation()}>
        <div className="flex bg-white rounded-3xl overflow-hidden shadow-2xl w-[1200px] h-[800px]">
          <div className="flex-1 flex items-center justify-center relative">
            <div 
              className="relative w-full h-full flex items-center justify-center" 
              onWheel={(e) => {
                if (e.deltaY > 0 && currentImageIndex < images.length - 1) {
                  setCurrentImageIndex(currentImageIndex + 1)
                } else if (e.deltaY < 0 && currentImageIndex > 0) {
                  setCurrentImageIndex(currentImageIndex - 1)
                }
              }}
            >
              <img src={images[currentImageIndex]} alt="Post" className="w-full h-full object-contain" />
              {images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_: any, idx: number) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                      }`} 
                    />
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
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-gray-900 mb-4">{post.content}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-[#0055FF] text-sm">#{tag}</span>
                ))}
              </div>
              
              {/* 评论列表 */}
              <CommentSection postId={post.id} showInputAtBottom={true} />
            </div>
            
            {/* 评论输入框 - 在操作栏上方 */}
            <div className="px-6 py-3 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="写下你的评论..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#0055FF]"
                />
                <button className="px-4 py-2 bg-[#0055FF] text-white text-sm font-bold rounded-lg hover:bg-[#0044DD] transition-colors">
                  评论
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t flex items-center gap-6">
              <button 
                onClick={(e) => { e.stopPropagation(); onLike(post.id); }} 
                className={`flex items-center gap-2 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                }`}
              >
                <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="font-medium">{post.likes}</span>
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                }} 
                className="flex items-center gap-2 text-gray-700 hover:text-[#0055FF]"
              >
                <MessageCircle size={24} />
                <span className="font-medium">{post.comments}</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onCollect(post.id); }} 
                className={`flex items-center gap-2 transition-colors ${
                  isCollected ? 'text-[#FFB800]' : 'text-gray-700 hover:text-[#FFB800]'
                }`}
              >
                <Bookmark size={24} fill={isCollected ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
