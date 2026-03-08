import { useState, useEffect } from 'react'
import { Camera, LogOut, MessageCircle } from 'lucide-react'
import AvatarSelector from './AvatarSelector'
import AvatarEditorModal from './AvatarEditorModal'
import MobilePostEditor from './MobilePostEditor'
import { API_URL } from '../api/config'
import { postsAPI } from '../api/posts'
import { collectionsAPI } from '../api/collections'
import FollowListModal from './FollowListModal'
import Inbox from './Inbox'
import { messagesAPI } from '../api/messages'
import { useNavigate } from 'react-router-dom'

interface MobileProfileProps {
  username: string
}

/**
 * 移动端个人主页
 * 独立设计，与PC端分离
 */
export default function MobileProfile({ username }: MobileProfileProps) {
  const [user, setUser] = useState<any>({ username: '', bio: '' })
  const [avatar, setAvatar] = useState('👤')
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
  const [stats, setStats] = useState({ posts: 0, likes: 0 })
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'moments' | 'messages'>('posts')
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [collectedPosts, setCollectedPosts] = useState<any[]>([])
  const [mangoMoments, setMangoMoments] = useState<any[]>([])
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [showCoverSelector, setShowCoverSelector] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [followListModal, setFollowListModal] = useState<{ type: 'following' | 'followers' } | null>(null)
  const [currentUserId, setCurrentUserId] = useState('')
  const [followingCount, setFollowingCount] = useState(0)
  const [followersCount, setFollowersCount] = useState(0)
  const [showInbox, setShowInbox] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const navigate = useNavigate()

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    alert(message)
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setCurrentUserId(userData.id)

      // 加载头像
      fetch(`${API_URL}/auth/user/${userData.username}`)
        .then(res => res.json())
        .then(data => setAvatar(data.avatar || '👤'))

      // 加载统计（含following/followers）
      fetch(`${API_URL}/auth/stats/${userData.username}`)
        .then(res => res.json())
        .then(data => {
          setStats(data)
          setFollowingCount(data.following || 0)
          setFollowersCount(data.followers || 0)
        })

      // 加载我的帖子
      postsAPI.getAll().then(data => {
        const myPosts = data.posts.filter((p: any) => p.userId === userData.id)
        setUserPosts(myPosts)
      })

      // 加载我的收藏
      collectionsAPI.getUserCollections(userData.id).then(data => {
        setCollectedPosts(data)
      })

      // 加载我的芒一下
      fetch(`${API_URL}/mango-moments/user/${userData.id}`)
        .then(res => res.json())
        .then(data => setMangoMoments(data))

      // 加载私信
      messagesAPI.getConversations(userData.id).then(setConversations).catch(() => {})
    }
  }, [])

  const handleLogout = () => {
    if (window.confirm('确定要退出登录吗？')) {
      localStorage.removeItem('user')
      window.location.href = '/'
    }
  }

  const handleSaveAvatar = async (avatarData: string) => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) return
    
    const userData = JSON.parse(savedUser)
    
    try {
      await fetch(`${API_URL}/auth/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userData.username, avatar: avatarData })
      })
      setAvatar(avatarData)
    } catch (error) {
      console.error('保存头像失败:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('确定要删除这篇帖子吗？删除后无法恢复。')) return
    
    try {
      await fetch(`${API_URL}/posts/${postId}`, { method: 'DELETE' })
      setUserPosts(userPosts.filter(p => p.id !== postId))
      setShowMenu(null)
    } catch (error) {
      console.error('删除失败:', error)
    }
  }

  const handleChangeCover = async (postId: string, newCoverIndex: number) => {
    try {
      const post = userPosts.find(p => p.id === postId)
      if (!post) return

      // 使用postsAPI.update，只更新coverIndex
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          coverIndex: newCoverIndex
        })
      })

      if (response.ok) {
        setUserPosts(userPosts.map(p => 
          p.id === postId ? { ...p, coverIndex: newCoverIndex } : p
        ))
        setShowCoverSelector(null)
        setShowMenu(null)
      }
    } catch (error) {
      console.error('更改封面失败:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部用户卡片 */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-4xl overflow-hidden">
                {avatar.startsWith('data:') ? (
                  <img src={avatar} alt="头像" className="w-full h-full object-cover" />
                ) : (
                  avatar
                )}
              </div>
              <button
                onClick={() => setShowAvatarEditor(true)}
                className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <Camera size={12} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.bio}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-red-500"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* 统计数据 */}
        <div className="flex gap-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold">{stats.posts}</div>
            <div className="text-xs text-gray-500">帖子</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{stats.likes}</div>
            <div className="text-xs text-gray-500">获赞</div>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => setFollowListModal({ type: 'following' })}
          >
            <div className="text-xl font-bold">{followingCount}</div>
            <div className="text-xs text-gray-500">关注</div>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => setFollowListModal({ type: 'followers' })}
          >
            <div className="text-xl font-bold">{followersCount}</div>
            <div className="text-xs text-gray-500">粉丝</div>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="mt-4 bg-white">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'posts' ? 'text-[#0055FF] border-b-2 border-[#0055FF]' : 'text-gray-500'
            }`}
          >
            我的帖子 ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'collections' ? 'text-[#0055FF] border-b-2 border-[#0055FF]' : 'text-gray-500'
            }`}
          >
            我的收藏 ({collectedPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('moments')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'moments' ? 'text-[#0055FF] border-b-2 border-[#0055FF]' : 'text-gray-500'
            }`}
          >
            芒一下 ({mangoMoments.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'messages' ? 'text-[#0055FF] border-b-2 border-[#0055FF]' : 'text-gray-500'
            }`}
          >
            消息
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-4">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-2 gap-2">
              {userPosts.map(post => (
                <div key={post.id} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={post.images?.[post.coverIndex || 0] || post.images?.[0]} 
                    alt="" 
                    className="w-full h-full object-cover" 
                  />
                  
                  {/* 三点菜单按钮 - 右上角 */}
                  <button
                    onClick={() => setShowMenu(showMenu === post.id ? null : post.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white text-xl z-10"
                  >
                    ⋯
                  </button>
                  
                  {/* 菜单弹出 */}
                  {showMenu === post.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowMenu(null)}
                      ></div>
                      <div className="absolute top-12 right-2 bg-white rounded-lg shadow-lg py-2 w-32 z-50">
                        <button
                          onClick={() => {
                            setEditingPost(post)
                            setShowEditor(true)
                            setShowMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          编辑帖子
                        </button>
                        <button
                          onClick={() => {
                            setShowCoverSelector(post.id)
                            setShowMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          更改封面
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                        >
                          删除帖子
                        </button>
                      </div>
                    </>
                  )}

                </div>
              ))}
              {userPosts.length === 0 && <p className="col-span-2 text-center text-gray-400 py-10">暂无帖子</p>}
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="grid grid-cols-3 gap-2">
              {collectedPosts.map(post => (
                <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img src={post.images?.[post.coverIndex || 0] || post.images?.[0]} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {collectedPosts.length === 0 && <p className="col-span-3 text-center text-gray-400 py-10">暂无收藏</p>}
            </div>
          )}

          {activeTab === 'moments' && (
            <div className="space-y-3">
              {mangoMoments.map(moment => (
                <div key={moment.id} className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-bold text-sm mb-1">{moment.destination}</h3>
                  <p className="text-xs text-gray-600">{moment.description}</p>
                </div>
              ))}
              {mangoMoments.length === 0 && <p className="text-center text-gray-400 py-10">暂无芒一下</p>}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm mb-2">私信</h3>
                {conversations.length === 0 ? (
                  <p className="text-center text-gray-400 py-6 text-xs">暂无私信</p>
                ) : (
                  <div className="space-y-2">
                    {conversations.map(conv => (
                      <div
                        key={conv.partnerId}
                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 cursor-pointer"
                        onClick={() => navigate(`/messages/${conv.partnerId}`)}
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-base overflow-hidden flex-shrink-0">
                          {conv.partnerAvatar?.startsWith('data:') ? (
                            <img src={conv.partnerAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (conv.partnerAvatar || '👤')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs">{conv.partnerUsername}</div>
                          <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-2">通知</h3>
                <button
                  onClick={() => setShowInbox(true)}
                  className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 text-sm"
                >
                  查看通知（点赞/评论/收藏）
                </button>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-2">关注与粉丝</h3>
                <button
                  onClick={() => setFollowListModal({ type: 'following' })}
                  className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 text-sm mb-2"
                >
                  我的关注 ({followingCount})
                </button>
                <button
                  onClick={() => setFollowListModal({ type: 'followers' })}
                  className="w-full py-3 bg-gray-50 rounded-xl text-gray-600 text-sm"
                >
                  我的粉丝 ({followersCount})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 头像选择器 */}
      {showAvatarSelector && (
        <AvatarSelector
          onSelect={(emoji) => {
            setAvatar(emoji)
            setShowAvatarSelector(false)
          }}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}

      {/* 头像编辑器 */}
      <AvatarEditorModal
        isOpen={showAvatarEditor}
        onClose={() => setShowAvatarEditor(false)}
        onSave={handleSaveAvatar}
      />

      {/* 帖子编辑器 */}
      <MobilePostEditor
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false)
          setEditingPost(null)
        }}
        onSuccess={() => {
          // 重新加载帖子列表
          const savedUser = localStorage.getItem('user')
          if (savedUser) {
            const userData = JSON.parse(savedUser)
            postsAPI.getAll().then(data => {
              const myPosts = data.posts.filter((p: any) => p.userId === userData.id)
              setUserPosts(myPosts)
            })
          }
        }}
        showToast={showToast}
        post={editingPost}
      />

      {/* 封面选择器 - 底部弹窗（唯一实现） */}
      {showCoverSelector && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div
            className="fixed inset-0"
            onClick={() => setShowCoverSelector(null)}
          ></div>
          <div className="bg-white w-full rounded-t-2xl p-4 z-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">选择封面</h3>
              <button onClick={() => setShowCoverSelector(null)} className="text-gray-400 text-sm">关闭</button>
            </div>
            <div className="grid grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto">
              {userPosts.find(p => p.id === showCoverSelector)?.images?.map((img: string, idx: number) => {
                const currentCover = userPosts.find(p => p.id === showCoverSelector)?.coverIndex ?? 0
                const isCurrent = currentCover === idx
                return (
                  <div
                    key={idx}
                    onClick={() => handleChangeCover(showCoverSelector!, idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                      isCurrent ? 'ring-4 ring-[#FFB800]' : ''
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {isCurrent && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#FFB800] text-white text-xs px-2 py-0.5 rounded-full">
                        当前封面
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 关注/粉丝弹窗 */}
      {followListModal && currentUserId && (
        <FollowListModal
          isOpen={true}
          onClose={() => setFollowListModal(null)}
          type={followListModal.type}
          userId={currentUserId}
        />
      )}

      {/* 通知弹窗 */}
      <Inbox isOpen={showInbox} onClose={() => setShowInbox(false)} />
    </div>
  )
}
