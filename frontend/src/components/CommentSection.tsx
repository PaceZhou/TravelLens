import { useState, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'

/**
 * 评论区组件
 * 独立的评论功能模块
 * 
 * Props:
 * - postId: 帖子ID
 * - onCommentAdded: 评论添加后的回调函数
 */
interface CommentSectionProps {
  postId: string
  onCommentAdded?: () => void
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

export default function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
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
      {/* 评论标题 */}
      <div className="flex items-center gap-2">
        <MessageCircle size={20} />
        <h3 className="font-bold">评论 ({comments.length})</h3>
      </div>

      {/* 评论输入框 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#0055FF]"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="w-10 h-10 bg-[#0055FF] text-white rounded-full flex items-center justify-center hover:bg-[#0044DD] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </form>

      {/* 评论列表 */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            暂无评论，快来抢沙发吧！
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-2xl">
              {/* 用户头像 */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-sm flex-shrink-0">
                {comment.user.avatar || '👤'}
              </div>
              
              {/* 评论内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{comment.user.username}</span>
                  <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 break-words">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
