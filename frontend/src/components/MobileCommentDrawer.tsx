import { useState } from 'react'
import { X, Heart } from 'lucide-react'
import MentionTag from './MentionTag'

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
  postAuthorId?: string // 帖主ID
}

/**
 * 移动端评论抽屉 - Instagram风格
 * 底部滑出，带缩放背景特效
 */
export default function MobileCommentDrawer({ isOpen, onClose, comments, onSendComment, onLikeComment, likedComments, postAuthorId }: MobileCommentDrawerProps) {
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const handleSend = () => {
    if (!commentText.trim()) return
    onSendComment(commentText, replyTo || undefined)
    setCommentText('')
    setReplyTo(null)
  }

  // 只显示顶级评论（没有parentCommentId的）
  const topLevelComments = comments.filter(c => !c.parentCommentId)
  // 获取某条评论的所有回复
  const getReplies = (commentId: string) => comments.filter(c => c.parentCommentId === commentId)
  
  // 展开状态管理
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [expandedTexts, setExpandedTexts] = useState<Set<string>>(new Set())
  
  // 检查文本是否需要折叠（超过4行或100字）
  const needsTruncate = (text: string) => {
    return text.length > 100 || text.split('\n').length > 4
  }
  
  // 获取显示的文本
  const getDisplayText = (commentId: string, text: string) => {
    if (!needsTruncate(text) || expandedTexts.has(commentId)) {
      return text
    }
    return text.slice(0, 100)
  }
  
  // 获取要显示的回复（默认2条点赞最高的）
  const getVisibleReplies = (commentId: string) => {
    const allReplies = getReplies(commentId)
    if (expandedComments.has(commentId)) {
      // 展开：按时间正序
      return allReplies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else {
      // 折叠：只显示点赞最高的2条
      return allReplies.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 2)
    }
  }

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
              const allReplies = getReplies(comment.id)
              const visibleReplies = getVisibleReplies(comment.id)
              const hasMore = allReplies.length > 2
              const isExpanded = expandedComments.has(comment.id)
              
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
                        {comment.userId === postAuthorId && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded mr-2">作者</span>
                        )}
                        <span className="text-sm text-gray-900">{getDisplayText(comment.id, comment.content)}</span>
                        {needsTruncate(comment.content) && !expandedTexts.has(comment.id) && (
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedTexts)
                              newExpanded.add(comment.id)
                              setExpandedTexts(newExpanded)
                            }}
                            className="text-gray-400 text-sm ml-1"
                          >
                            ...展开
                          </button>
                        )}
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

                  {/* 回复列表 */}
                  {visibleReplies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 ml-11 mt-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-[10px] flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1">
                        <div>
                          <span className="font-bold text-xs mr-2">{reply.username}</span>
                          {reply.replyToUsername && (
                            <span className="text-xs text-gray-500 mr-2">@{reply.replyToUsername}</span>
                          )}
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

                  {/* 展开/收起按钮 */}
                  {hasMore && (
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedComments)
                        if (isExpanded) {
                          newExpanded.delete(comment.id)
                        } else {
                          newExpanded.add(comment.id)
                        }
                        setExpandedComments(newExpanded)
                      }}
                      className="ml-11 mt-2 text-xs text-gray-500 font-medium"
                    >
                      {isExpanded ? '收起回复 ∧' : `展开其余 ${allReplies.length - 2} 条回复 ∨`}
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* 底部输入框 */}
        <div className="border-t px-4 py-3 bg-white">
          {replyTo && (
            <div className="mb-2">
              <MentionTag username={replyTo} onRemove={() => setReplyTo(null)} />
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
                } else if (e.key === 'Backspace' && !commentText && replyTo) {
                  // 按退格键删除@块
                  setReplyTo(null)
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
