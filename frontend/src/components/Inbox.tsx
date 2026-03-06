import { useState, useEffect } from 'react'
import { X, Heart, MessageCircle, Mail } from 'lucide-react'

interface InboxProps {
  isOpen: boolean
  onClose: () => void
}

export default function Inbox({ isOpen, onClose }: InboxProps) {
  const [activeTab, setActiveTab] = useState<'likes' | 'comments' | 'messages'>('likes')
  const [likeNotifications, setLikeNotifications] = useState<any[]>([])

  useEffect(() => {
    if (isOpen && activeTab === 'likes') {
      const savedUser = localStorage.getItem('user')
      const userId = savedUser ? JSON.parse(savedUser).id : ''
      
      fetch(`http://192.168.2.33:3001/notifications/likes/${userId}`)
        .then(res => res.json())
        .then(data => setLikeNotifications(data))
        .catch(() => {})
    }
  }, [isOpen, activeTab])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[10000]" onClick={onClose}></div>
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl w-[90%] max-w-2xl max-h-[80vh] z-[10001] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-black">📬 收件箱</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'likes' ? 'bg-[#0055FF] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart size={20} /> 点赞通知
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'comments' ? 'bg-[#0055FF] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageCircle size={20} /> 评论留言
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'messages' ? 'bg-[#0055FF] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Mail size={20} /> 私信
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          {activeTab === 'likes' && (
            <div className="space-y-4">
              {likeNotifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400">暂无点赞通知</div>
              ) : (
                likeNotifications.map((item: any) => (
                  <div key={item.postId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      {item.post?.images?.[item.post.coverIndex || 0] ? (
                        <img src={item.post.images[item.post.coverIndex || 0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart size={16} className="text-red-500 fill-red-500" />
                        <span className="font-bold">{item.count}人</span>
                        <span className="text-gray-600">赞了你的作品</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.post?.content || ''}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === 'comments' && (
            <div className="text-center py-12 text-gray-400">
              暂无评论留言
            </div>
          )}
          {activeTab === 'messages' && (
            <div className="text-center py-12 text-gray-400">
              暂无私信
            </div>
          )}
        </div>
      </div>
    </>
  )
}
