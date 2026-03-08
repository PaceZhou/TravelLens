import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import { messagesAPI } from '../api/messages'
import { API_URL } from '../api/config'

interface Conversation {
  partnerId: string
  partnerUsername: string
  partnerAvatar?: string
  lastMessage: string
  lastTime: string
  unreadCount: number
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  isRead: boolean
}

export default function MessagesPage() {
  const { partnerId } = useParams<{ partnerId?: string }>()
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [partnerInfo, setPartnerInfo] = useState<any>(null)
  const [inputText, setInputText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const isSingleChat = !!partnerId

  // 加载会话列表
  useEffect(() => {
    if (!currentUser.id || isSingleChat) return
    const load = () => messagesAPI.getConversations(currentUser.id).then(setConversations).catch(() => {})
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [currentUser.id, isSingleChat])

  // 加载单聊
  useEffect(() => {
    if (!currentUser.id || !partnerId) return

    // 获取对方信息
    fetch(`${API_URL}/auth/user/${partnerId}`)
      .then(r => r.json())
      .then(setPartnerInfo)
      .catch(() => {})

    const load = () =>
      messagesAPI.getThread(currentUser.id, partnerId).then(setMessages).catch(() => {})
    load()
    messagesAPI.markAsRead(currentUser.id, partnerId).catch(() => {})

    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [currentUser.id, partnerId])

  // 滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputText.trim() || !partnerId || !currentUser.id) return
    const content = inputText.trim()
    setInputText('')
    await messagesAPI.send(currentUser.id, partnerId, content)
    const updated = await messagesAPI.getThread(currentUser.id, partnerId)
    setMessages(updated)
  }

  if (!currentUser.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">请先登录</div>
      </div>
    )
  }

  // 单聊视图
  if (isSingleChat) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 max-w-2xl mx-auto">
        {/* 顶部栏 */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b shadow-sm">
          <button onClick={() => navigate('/messages')} className="p-1 hover:opacity-50">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-lg overflow-hidden">
              {partnerInfo?.avatar && partnerInfo.avatar.startsWith('data:') ? (
                <img src={partnerInfo.avatar} alt="" className="w-full h-full object-cover" />
              ) : (partnerInfo?.avatar || '👤')}
            </div>
            <span className="font-bold">{partnerInfo?.username || '...'}</span>
          </div>
        </div>

        {/* 消息区 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => {
            const isMine = msg.senderId === currentUser.id
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMine
                      ? 'bg-[#0055FF] text-white rounded-tr-sm'
                      : 'bg-white text-gray-900 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* 输入区 */}
        <div className="bg-white border-t px-4 py-3 flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="发送消息..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            style={{ fontSize: '16px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-colors ${inputText.trim() ? 'bg-[#0055FF] text-white' : 'bg-gray-200 text-gray-400'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    )
  }

  // 会话列表视图
  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      <div className="bg-white border-b px-5 py-4">
        <h1 className="text-xl font-black">私信</h1>
      </div>

      <div className="divide-y bg-white">
        {conversations.length === 0 && (
          <div className="text-center py-20 text-gray-400">暂无私信对话</div>
        )}
        {conversations.map(conv => (
          <div
            key={conv.partnerId}
            className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/messages/${conv.partnerId}`)}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-xl overflow-hidden flex-shrink-0">
              {conv.partnerAvatar && conv.partnerAvatar.startsWith('data:') ? (
                <img src={conv.partnerAvatar} alt="" className="w-full h-full object-cover" />
              ) : (conv.partnerAvatar || '👤')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{conv.partnerUsername}</span>
                <span className="text-xs text-gray-400">
                  {new Date(conv.lastTime).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage}</p>
            </div>
            {conv.unreadCount > 0 && (
              <div className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
