import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Calendar, Heart, Users, UserPlus, Bookmark, Image, Settings, MoreVertical, Trash2, Edit, ImageIcon } from 'lucide-react'
import { postsAPI } from '../api/posts'

export default function Profile({ username }: { username: string }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('calendar')
  const [stats, setStats] = useState({ posts: 0, following: 0, followers: 0, likes: 0 })
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

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
  }, [username])

  const loadUserPosts = () => {
    postsAPI.getAll().then(posts => {
      const myPosts = posts.filter((p: any) => p.user?.username === username)
      setUserPosts(myPosts)
    }).catch(() => {})
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('确定删除这条帖子吗？')) return
    try {
      await postsAPI.delete(postId)
      setOpenMenuId(null)
      loadUserPosts()
    } catch (error) {
      console.error('删除失败', error)
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
                    {userPosts.map((post: any) => (
                      <div key={post.id} className="aspect-square rounded-xl overflow-hidden relative group">
                        <img 
                          src={post.images?.[0] || ''} 
                          alt={post.content}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* 三点菜单按钮 */}
                        <button
                          onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {/* 下拉菜单 */}
                        {openMenuId === post.id && (
                          <div className="absolute top-12 right-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 w-full text-left"
                            >
                              <Trash2 size={16} />
                              <span className="text-sm font-medium">删除</span>
                            </button>
                            <button
                              onClick={() => alert('编辑功能开发中')}
                              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-gray-700 w-full text-left"
                            >
                              <Edit size={16} />
                              <span className="text-sm font-medium">编辑</span>
                            </button>
                            <button
                              onClick={() => alert('更改封面功能开发中')}
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

            {activeTab !== 'calendar' && activeTab !== 'posts' && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">功能开发中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
