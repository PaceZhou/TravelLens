import { useState, useEffect } from 'react'
import { MessageCircle, Send, ArrowBigUp, ArrowBigDown } from 'lucide-react'

/**
 * 评论区组件 - Reddit风格
 * 独立的评论功能模块
 * 
 * Props:
 * - postId: 帖子ID
 * - onCommentAdded: 评论添加后的回调函数
 * - showInputAtBottom: 是否在底部显示输入框（默认true，PostDetail中设为false）
 */
interface CommentSectionProps {
  postId: string
  onCommentAdded?: () => void
  showInputAtBottom?: boolean
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    username: string
    avatar?: string
  }
}

export default function CommentSection({ postId, onCommentAdded, showInputAtBottom = true }: CommentSectionProps) {
  // 状态管理
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * 加载评论列表
   */
  const loadComments = () => {
    fetch(`http://192.168.2.33:3001/comments/post/${postId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => {})
  }

  // 组件挂载时加载评论
  useEffect(() => {
    loadComments()
  }, [postId])

  /**
   * 提交评论
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      alert('请先登录')
      return
    }

    const userId = JSON.parse(savedUser).id

    setIsSubmitting(true)
    try {
      await fetch('http://192.168.2.33:3001/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          postId,
          content: newComment.trim()
        })
      })

      setNewComment('')
      loadComments()
      onCommentAdded?.()
    } catch (error) {
      alert('评论失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * 格式化时间
   */
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="space-y-4">
      {/* Reddit风格评论输入框 - 仅在showInputAtBottom为true时显示 */}
      {showInputAtBottom && (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="你怎么看？"
            className="w-full p-3 text-sm resize-none focus:outline-none"
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-end p-2 bg-gray-50 border-t">
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              className="px-6 py-1.5 bg-[#0055FF] text-white text-sm font-bold rounded-full hover:bg-[#0044DD] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              评论
            </button>
          </div>
        </div>
      )}

      {/* Reddit风格评论列表 */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            还没有评论
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border-l-2 border-gray-200 pl-4 py-2">
              {/* 用户信息栏 */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-xs">
                  {comment.user.avatar || '👤'}
                </div>
                <span className="font-bold text-sm">{comment.user.username}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
              </div>
              
              {/* 评论内容 */}
              <p className="text-sm text-gray-800 mb-2 leading-relaxed">{comment.content}</p>
              
              {/* Reddit风格操作栏 */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-[#0055FF] transition-colors">
                  <ArrowBigUp size={16} />
                  <span>赞</span>
                </button>
                <button className="flex items-center gap-1 hover:text-[#0055FF] transition-colors">
                  <ArrowBigDown size={16} />
                </button>
                <button className="hover:text-[#0055FF] transition-colors">
                  回复
                </button>
                <button className="hover:text-[#0055FF] transition-colors">
                  分享
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
