import { useState, useEffect } from 'react'
import { X, Heart, MessageCircle, BookmarkCheck, CheckCheck } from 'lucide-react'
import { API_URL } from '../api/config'

interface InboxProps {
  isOpen: boolean
  onClose: () => void
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m}分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}小时前`
  return `${Math.floor(h / 24)}天前`
}

export default function Inbox({ isOpen, onClose }: InboxProps) {
  const [activeTab, setActiveTab] = useState<'likes' | 'comments' | 'collections'>('likes')
  const [likeNotifs, setLikeNotifs] = useState<any[]>([])
  const [commentNotifs, setCommentNotifs] = useState<any[]>([])
  const [collectionNotifs, setCollectionNotifs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const userId = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}').id || '' } catch { return '' }
  })()

  const fetchTab = async (tab: typeof activeTab) => {
    if (!userId) return
    setLoading(true)
    try {
      if (tab === 'likes') {
        const data = await fetch(`${API_URL}/notifications/likes/${userId}`).then(r => r.json())
        setLikeNotifs(Array.isArray(data) ? data : [])
      } else if (tab === 'comments') {
        const data = await fetch(`${API_URL}/notifications/comments/${userId}`).then(r => r.json())
        setCommentNotifs(Array.isArray(data) ? data : [])
      } else {
        const data = await fetch(`${API_URL}/notifications/${userId}`).then(r => r.json())
        setCollectionNotifs((Array.isArray(data) ? data : []).filter((n: any) => n.type === 'collection'))
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) fetchTab(activeTab)
  }, [isOpen, activeTab])

  const markAllRead = async () => {
    if (!userId) return
    await fetch(`${API_URL}/notifications/read-all/${userId}`, { method: 'PUT' }).catch(() => {})
  }

  if (!isOpen) return null

  const tabs = [
    { key: 'likes', label: '点赞', icon: <Heart size={16} /> },
    { key: 'comments', label: '评论', icon: <MessageCircle size={16} /> },
    { key: 'collections', label: '收藏', icon: <BookmarkCheck size={16} /> },
  ] as const

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[10000]" onClick={onClose} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl w-[90%] max-w-xl max-h-[80vh] z-[10001] shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex justify-between items-center px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-xl font-black">📬 消息中心</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0055FF] px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              <CheckCheck size={14} /> 全部已读
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab */}
        <div className="flex border-b flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-[#0055FF] text-[#0055FF]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* 内容 */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">加载中...</div>
          ) : activeTab === 'likes' ? (
            likeNotifs.length === 0 ? (
              <Empty text="暂无点赞通知" />
            ) : likeNotifs.map((item: any) => (
              <NotifRow
                key={item.postId}
                icon={<Heart size={14} className="text-red-500 fill-red-500" />}
                title={`${item.count} 人赞了你的作品`}
                sub={item.post?.content}
                image={item.post?.images?.[item.post.coverIndex || 0]}
                time={item.latestAt}
              />
            ))
          ) : activeTab === 'comments' ? (
            commentNotifs.length === 0 ? (
              <Empty text="暂无评论通知" />
            ) : commentNotifs.map((item: any) => (
              <NotifRow
                key={item.id}
                icon={<MessageCircle size={14} className="text-blue-500" />}
                title={`${item.fromUsername} 评论了你的作品`}
                sub={item.post?.content}
                image={item.post?.images?.[item.post?.coverIndex || 0]}
                time={item.createdAt}
                isRead={item.isRead}
              />
            ))
          ) : (
            collectionNotifs.length === 0 ? (
              <Empty text="暂无收藏通知" />
            ) : collectionNotifs.map((item: any) => (
              <NotifRow
                key={item.id}
                icon={<BookmarkCheck size={14} className="text-yellow-500" />}
                title={`有人收藏了你的作品`}
                sub={item.postId}
                time={item.createdAt}
                isRead={item.isRead}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

function NotifRow({ icon, title, sub, image, time, isRead }: {
  icon: React.ReactNode
  title: string
  sub?: string
  image?: string
  time?: string
  isRead?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${isRead === false ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        {sub && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{sub}</p>}
        {time && <p className="text-xs text-gray-300 mt-0.5">{timeAgo(time)}</p>}
      </div>
      {image && (
        <img src={image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
      )}
      {isRead === false && <div className="w-2 h-2 bg-[#0055FF] rounded-full flex-shrink-0" />}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="text-center py-16 text-gray-400 text-sm">{text}</div>
}
