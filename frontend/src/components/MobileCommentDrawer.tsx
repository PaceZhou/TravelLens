import { useState } from 'react'
import { X, Heart } from 'lucide-react'

interface Comment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
  replyToUsername?: string
  likes?: number
}

interface MobileCommentDrawerProps {
  isOpen: boolean
  onClose: () => void
  comments: Comment[]
  onSendComment: (content: string, replyToUsername?: string) => void
  onLikeComment: (commentId: string) => void
  likedComments: Set<string>
}

/**
 * 移动端评论抽屉 - Instagram风格
 * 底部滑出，带缩放背景特效
 */
export default function MobileCommentDrawer({ isOpen, onClose, comments, onSendComment, onLikeComment, likedComments }: MobileCommentDrawerProps) {
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const handleSend = () => {
    if (!commentText.trim()) return
    onSendComment(commentText, replyTo || undefined)
    setCommentText('')
    setReplyTo(null)
  }

  // 只显示顶级评论（没有replyToUsername的）
  const topLevelComments = comments.filter(c => !c.replyToUsername)
  // 获取某条评论的回复
  const getReplies = (username: string) => comments.filter(c => c.replyToUsername === username)

  return (
    <>
      {/* 黑色遮罩 - 点击关闭 */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 评论抽屉 */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '75vh' }}
      >
        {/* 拖拽指示器 */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>

        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-bold text-base">评论</h3>
          <button onClick={onClose}>
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* 评论列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-3" style={{ height: 'calc(75vh - 140px)' }}>
          {topLevelComments.length === 0 ? (
            <div className="text-center text-gray-400 py-10">暂无评论</div>
          ) : (
            topLevelComments.map((comment) => {
              const replies = getReplies(comment.username)
              return (
                <div key={comment.id} className="mb-4">
                  {/* 顶级评论 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-xs flex-shrink-0">
                      👤
                    </div>
                    <div className="flex-1">
                      <div>
                        <span className="font-bold text-sm mr-2">{comment.username}</span>
                        <span className="text-sm text-gray-900">{comment.content}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span>刚刚</span>
                        <button 
                          onClick={() => setReplyTo(comment.username)}
                          className="font-medium"
                        >
                          回复
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => onLikeComment(comment.id)}
                      className="flex-shrink-0"
                    >
                      <Heart 
                        size={14} 
                        className={likedComments.has(comment.id) ? 'text-red-500' : 'text-gray-400'}
                        fill={likedComments.has(comment.id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  {/* 回复列表（缩进显示，不能再回复） */}
                  {replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 ml-11 mt-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-[10px] flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1">
                        <div>
                          <span className="font-bold text-xs mr-2">{reply.username}</span>
                          <span className="text-xs text-gray-500 mr-2">回复 @{reply.replyToUsername}</span>
                          <span className="text-xs text-gray-900">{reply.content}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">刚刚</div>
                      </div>
                      <button
                        onClick={() => onLikeComment(reply.id)}
                        className="flex-shrink-0"
                      >
                        <Heart 
                          size={12} 
                          className={likedComments.has(reply.id) ? 'text-red-500' : 'text-gray-400'}
                          fill={likedComments.has(reply.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )
            })
          )}
        </div>

        {/* 底部输入框 */}
        <div className="border-t px-4 py-3 bg-white">
          {replyTo && (
            <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
              <span>回复 @{replyTo}</span>
              <button onClick={() => setReplyTo(null)} className="text-[#0055FF]">取消</button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && commentText.trim()) {
                  handleSend()
                }
              }}
              placeholder={replyTo ? `回复 @${replyTo}...` : "添加评论..."}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!commentText.trim()}
              className={`font-bold text-sm ${commentText.trim() ? 'text-[#0055FF]' : 'text-gray-400'}`}
            >
              发布
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
