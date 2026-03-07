import { useState } from 'react'
import { X, Send } from 'lucide-react'

interface Comment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
  replyToUsername?: string
}

interface MobileCommentDrawerProps {
  isOpen: boolean
  onClose: () => void
  comments: Comment[]
  onSendComment: (content: string) => void
}

/**
 * 移动端评论抽屉 - Instagram风格
 * 底部滑出，带缩放背景特效
 */
export default function MobileCommentDrawer({ isOpen, onClose, comments, onSendComment }: MobileCommentDrawerProps) {
  const [commentText, setCommentText] = useState('')

  const handleSend = () => {
    if (!commentText.trim()) return
    onSendComment(commentText)
    setCommentText('')
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
          {comments.length === 0 ? (
            <div className="text-center text-gray-400 py-10">暂无评论</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-xs flex-shrink-0">
                    👤
                  </div>
                  <div className="flex-1">
                    <div>
                      <span className="font-bold text-sm mr-2">{comment.username}</span>
                      <span className="text-sm text-gray-900">{comment.content}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">刚刚</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部输入框 */}
        <div className="border-t px-4 py-3 bg-white">
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
              placeholder="添加评论..."
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
