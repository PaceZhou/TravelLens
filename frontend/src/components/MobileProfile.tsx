import { useState, useEffect } from 'react'
import { Camera, LogOut } from 'lucide-react'
import AvatarSelector from './AvatarSelector'
import AvatarEditorModal from './AvatarEditorModal'
import MobilePostEditor from './MobilePostEditor'
import { API_URL } from '../api/config'
import { postsAPI } from '../api/posts'
import { collectionsAPI } from '../api/collections'

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
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'moments'>('posts')
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [collectedPosts, setCollectedPosts] = useState<any[]>([])
  const [mangoMoments, setMangoMoments] = useState<any[]>([])
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [showCoverSelector, setShowCoverSelector] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    alert(message)
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      
      // 加载头像
      fetch(`${API_URL}/auth/user/${userData.username}`)
        .then(res => res.json())
        .then(data => setAvatar(data.avatar || '👤'))
      
      // 加载统计
      fetch(`${API_URL}/auth/stats/${userData.username}`)
        .then(res => res.json())
        .then(data => setStats(data))
      
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
        body: JSON.stringify({ userId: userData.id, avatar: avatarData })
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

                  {/* 封面选择器 */}
                  {showCoverSelector === post.id && (
                    <>
                      <div 
                        className="fixed inset-0 bg-black/50 z-[60]" 
                        onClick={() => setShowCoverSelector(null)}
                      ></div>
                      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 z-[70]">
                        <h3 className="font-bold mb-3">选择封面</h3>
                        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                          {post.images?.map((img: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => handleChangeCover(post.id, idx)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 ${
                                (post.coverIndex || 0) === idx ? 'border-[#FFB800]' : 'border-gray-200'
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              {(post.coverIndex || 0) === idx && (
                                <div className="absolute inset-0 bg-[#FFB800]/20 flex items-center justify-center">
                                  <span className="bg-[#FFB800] text-white text-xs px-2 py-1 rounded">封面</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
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

      {/* 封面选择器 */}
      {showCoverSelector && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowCoverSelector(null)}
          ></div>
          <div className="bg-white w-full rounded-t-2xl p-4 z-60">
            <h3 className="text-lg font-bold mb-4">选择封面</h3>
            <div className="grid grid-cols-3 gap-2 max-h-[60vh] overflow-y-auto">
              {userPosts.find(p => p.id === showCoverSelector)?.images?.map((img: string, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleChangeCover(showCoverSelector!, idx)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    userPosts.find(p => p.id === showCoverSelector)?.coverIndex === idx
                      ? 'ring-4 ring-[#FFB800]'
                      : ''
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
