import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Calendar, Heart, Users, UserPlus, Bookmark, Image, Settings, MoreVertical, Trash2, Edit, ImageIcon, X, ChevronRight, MessageCircle, Camera } from 'lucide-react'
import { postsAPI } from '../api/posts'
import { collectionsAPI } from '../api/collections'
import ConfirmDialog from './ConfirmDialog'
import CoverSelector from './CoverSelector'
import PostPublisher from './PostPublisher'
import Toast from './Toast'

export default function Profile({ username: propUsername }: { username: string }) {
  const { userId } = useParams()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('calendar')
  const [stats, setStats] = useState({ posts: 0, following: 0, followers: 0, likes: 0 })
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [collectedPosts, setCollectedPosts] = useState<any[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [showCoverSelector, setShowCoverSelector] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [showPublisher, setShowPublisher] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null)

  // 优先使用URL中的userId，否则使用props传入的username
  const username = userId || propUsername

  // 获取用户统计数据
  useEffect(() => {
    fetch(`http://192.168.2.33:3001/auth/stats/${username}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [username])

  // 获取用户帖子
  useEffect(() => {
    loadUserPosts()
    loadCollectedPosts()
  }, [username])

  const loadUserPosts = () => {
    postsAPI.getAll().then(result => {
      const myPosts = result.posts.filter((p: any) => p.user?.username === username)
      setUserPosts(myPosts)
    }).catch(() => {})
  }

  const loadCollectedPosts = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!user.id) return
    
    collectionsAPI.getUserCollections(user.id).then(collections => {
      const posts = collections.map((c: any) => c.post)
      setCollectedPosts(posts)
    }).catch(() => {})
  }

  const handleDelete = async (postId: string) => {
    setDeletePostId(postId)
    setShowDeleteConfirm(true)
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const confirmDelete = async () => {
    if (!deletePostId) return
    try {
      await postsAPI.delete(deletePostId)
      setOpenMenuId(null)
      setShowDeleteConfirm(false)
      setDeletePostId(null)
      loadUserPosts()
      showToast('删除成功', 'success')
    } catch (error) {
      console.error('删除失败', error)
      showToast('删除失败', 'error')
    }
  }

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setShowPublisher(true)
    setOpenMenuId(null)
  }

  const handleChangeCover = (post: any) => {
    setEditingPost(post)
    setShowCoverSelector(true)
    setOpenMenuId(null)
  }

  const confirmCoverChange = async (newCoverIndex: number, newOrder: string[]) => {
    if (!editingPost) return
    try {
      // TODO: 调用后端API更新图片顺序
      console.log('新封面索引:', newCoverIndex, '新顺序:', newOrder)
      setShowCoverSelector(false)
      setEditingPost(null)
      loadUserPosts()
    } catch (error) {
      console.error('更新封面失败', error)
    }
  }

  // 用户数据
  const user = {
    username: username,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    bio: '热爱旅行和摄影的芒果',
    stats: stats
  }

  // 模拟芒一下日历数据
  const mangoCalendar = [
    {
      id: 1,
      date: '2026-03-10',
      city: '北京',
      spots: ['故宫角楼', '天坛公园', '颐和园', '长城', '南锣鼓巷'],
      status: 'planned'
    },
    {
      id: 2,
      date: '2026-03-15',
      city: '上海',
      spots: ['外滩', '东方明珠', '豫园', '田子坊', '新天地'],
      status: 'planned'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg">
          <div className="flex items-center gap-6">
            <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full" />
            <div className="flex-1">
              <h1 className="text-3xl font-black mb-2">{user.username}</h1>
              <p className="text-gray-600 mb-4">{user.bio}</p>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-black">{user.stats.posts}</div>
                  <div className="text-sm text-gray-600">{t.profile.myPosts}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black">{user.stats.following}</div>
                  <div className="text-sm text-gray-600">{t.profile.following}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black">{user.stats.followers}</div>
                  <div className="text-sm text-gray-600">{t.profile.followers}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black">{user.stats.likes}</div>
                  <div className="text-sm text-gray-600">{t.profile.likes}</div>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'calendar' ? 'bg-[#0055FF] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar size={20} /> {t.profile.myMango}
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'posts' ? 'bg-[#0055FF] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Image size={20} /> {t.profile.myPosts}
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'following' ? 'bg-[#0055FF] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserPlus size={20} /> {t.profile.following}
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`flex-1 py-4 px-6 font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'collections' ? 'bg-[#0055FF] text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bookmark size={20} /> {t.profile.collections}
            </button>
          </div>

          <div className="p-6">
            {/* 芒一下日历 */}
            {activeTab === 'calendar' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black mb-6">🥭 {t.profile.calendar}</h2>
                {mangoCalendar.map(item => (
                  <div key={item.id} className="bg-gradient-to-br from-[#FFB800]/10 to-[#00D4AA]/10 rounded-2xl p-6 border-2 border-[#FFB800]/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{item.date}</div>
                        <h3 className="text-2xl font-black">{item.city}</h3>
                      </div>
                      <span className="px-4 py-2 bg-[#CCFF00] rounded-full text-sm font-black">
                        {item.status === 'planned' ? '计划中' : '已完成'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.spots.map((spot, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-bold">
                          {idx + 1}. {spot}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 其他标签页内容 */}
            {activeTab === 'posts' && (
              <div>
                <h2 className="text-2xl font-black mb-6">我的创作</h2>
                {userPosts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">还没有发布任何内容</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {userPosts.map((post: any, index: number) => (
                      <div 
                        key={post.id} 
                        className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer"
                        onClick={() => setSelectedPost(index)}
                      >
                        <img 
                          src={post.images?.[0] || ''} 
                          alt={post.content}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* 三点菜单按钮 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(openMenuId === post.id ? null : post.id)
                          }}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {/* 下拉菜单 */}
                        {openMenuId === post.id && (
                          <div className="absolute top-12 right-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(post.id)
                              }}
                              className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 w-full text-left"
                            >
                              <Trash2 size={16} />
                              <span className="text-sm font-medium">删除</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(post)
                              }}
                              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700 w-full text-left"
                            >
                              <Edit size={16} />
                              <span className="text-sm font-medium">编辑</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleChangeCover(post)
                              }}
                              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700 w-full text-left"
                            >
                              <ImageIcon size={16} />
                              <span className="text-sm font-medium">更改封面</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 我的收藏 */}
            {activeTab === 'collections' && (
              <div>
                <h2 className="text-2xl font-black mb-6">我的收藏</h2>
                {collectedPosts.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">还没有收藏任何内容</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6">
                    {collectedPosts.map((post, index) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedPost(index)}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={post.images?.[0] || ''}
                            alt={post.location}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                              <Heart size={14} /> {post.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} /> {post.comments || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab !== 'calendar' && activeTab !== 'posts' && activeTab !== 'collections' && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">功能开发中...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="删除帖子"
        message="确定要删除这条帖子吗？删除后无法恢复。"
        confirmText="删除"
        cancelText="取消"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* 更改封面弹窗 */}
      {editingPost && showCoverSelector && (
        <CoverSelector
          isOpen={showCoverSelector}
          images={editingPost.images || []}
          currentCoverIndex={0}
          onConfirm={confirmCoverChange}
          onCancel={() => {
            setShowCoverSelector(false)
            setEditingPost(null)
          }}
        />
      )}

      {/* 发布/编辑弹窗 */}
      <PostPublisher
        isOpen={showPublisher}
        onClose={() => {
          setShowPublisher(false)
          setEditingPost(null)
        }}
        onPublishSuccess={() => {
          setShowPublisher(false)
          setEditingPost(null)
          loadUserPosts()
          showToast('发布成功', 'success')
        }}
        showToast={showToast}
        currentCity="全部"
        editPost={editingPost}
      />

      {/* 右下角悬浮发布按钮 */}
      <button
        onClick={() => {
          setEditingPost(null)
          setShowPublisher(true)
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-40"
      >
        <Camera size={28} />
      </button>

      {/* Toast通知 */}
      {toast && <Toast type={toast.type} message={toast.message} />}
    </div>
  )
}
