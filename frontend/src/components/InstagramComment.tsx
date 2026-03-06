import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

/**
 * Instagram风格评论组件
 * 完全按照Instagram的评论区设计
 */
interface InstagramCommentProps {
  postId: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  replyToUserId?: string
  replyToUsername?: string
  user: {
    username: string
    avatar?: string
  }
}

export default function InstagramComment({ postId }: InstagramCommentProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<{ username: string; userId: string } | null>(null)

  // 加载评论
  useEffect(() => {
    fetch(`http://192.168.2.33:3001/comments/post/${postId}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(() => {})
  }, [postId])

  // 提交评论
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
      const commentData: any = {
        userId,
        postId,
        content: newComment.trim()
      }

      // 如果是回复，添加回复信息
      if (replyTo) {
        commentData.replyToUserId = replyTo.userId
        commentData.replyToUsername = replyTo.username
      }

      await fetch('http://192.168.2.33:3001/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      })

      setNewComment('')
      setReplyTo(null)
      // 重新加载评论
      const res = await fetch(`http://192.168.2.33:3001/comments/post/${postId}`)
      const data = await res.json()
      setComments(data)
    } catch (error) {
      alert('评论失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理回复
  const handleReply = (username: string, userId: string) => {
    setReplyTo({ username, userId })
    setNewComment(`@${username} `)
  }

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    const weeks = Math.floor(diff / 604800000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟`
    if (hours < 24) return `${hours}小时`
    if (days < 7) return `${days}天`
    return `${weeks}周`
  }

  return (
    <div className="flex flex-col h-full">
      {/* 评论列表区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            还没有评论
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id}>
                {/* 主评论 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-xs flex-shrink-0">
                    {comment.user.avatar || '👤'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm leading-relaxed">
                      <span className="font-semibold mr-2">{comment.user.username}</span>
                      <span className="text-gray-900">{comment.content}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                      <span>{formatTime(comment.createdAt)}</span>
                      <button 
                        onClick={() => handleReply(comment.user.username, comment.user.username)}
                        className="font-semibold hover:text-gray-700"
                      >
                        回复
                      </button>
                    </div>
                  </div>
                  
                  <button className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                    <Heart size={12} />
                  </button>
                </div>

                {/* 回复评论 - 缩进显示 */}
                {comments.filter(c => c.replyToUsername === comment.user.username).map(reply => (
                  <div key={reply.id} className="flex gap-3 ml-11 mt-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-xs flex-shrink-0">
                      {reply.user.avatar || '👤'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm leading-relaxed">
                        <span className="font-semibold mr-2">{reply.user.username}</span>
                        <span className="text-gray-900">{reply.content}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                        <span>{formatTime(reply.createdAt)}</span>
                        <button 
                          onClick={() => handleReply(reply.user.username, reply.user.username)}
                          className="font-semibold hover:text-gray-700"
                        >
                          回复
                        </button>
                      </div>
                    </div>
                    
                    <button className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                      <Heart size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 评论输入框 - 固定在底部 */}
      <div className="border-t px-4 py-3">
        {replyTo && (
          <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
            <span>回复 @{replyTo.username}</span>
            <button onClick={() => { setReplyTo(null); setNewComment(''); }} className="text-gray-400 hover:text-gray-600">
              取消
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="添加评论..."
            className="flex-1 text-sm focus:outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="text-sm font-semibold text-[#0095f6] hover:text-[#00376b] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            发布
          </button>
        </form>
      </div>
    </div>
  )
}
