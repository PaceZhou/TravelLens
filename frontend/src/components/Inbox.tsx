import { useState } from 'react'
import { X, Heart, MessageCircle, Mail } from 'lucide-react'

interface InboxProps {
  isOpen: boolean
  onClose: () => void
}

export default function Inbox({ isOpen, onClose }: InboxProps) {
  const [activeTab, setActiveTab] = useState<'likes' | 'comments' | 'messages'>('likes')

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
            <div className="text-center py-12 text-gray-400">
              暂无点赞通知
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
