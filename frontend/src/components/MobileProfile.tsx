import { useState, useEffect } from 'react'
import { Camera, LogOut } from 'lucide-react'
import AvatarSelector from './AvatarSelector'
import { API_URL } from '../api/config'

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
  const [stats, setStats] = useState({ posts: 0, likes: 0 })

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
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部用户卡片 */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-4xl">
                {avatar}
              </div>
              <button
                onClick={() => setShowAvatarSelector(true)}
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

      {/* 功能列表 */}
      <div className="mt-4 bg-white">
        <button className="w-full px-6 py-4 text-left border-b flex items-center justify-between">
          <span>我的帖子</span>
          <span className="text-gray-400">›</span>
        </button>
        <button className="w-full px-6 py-4 text-left border-b flex items-center justify-between">
          <span>我的收藏</span>
          <span className="text-gray-400">›</span>
        </button>
        <button className="w-full px-6 py-4 text-left flex items-center justify-between">
          <span>我的芒一下</span>
          <span className="text-gray-400">›</span>
        </button>
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
    </div>
  )
}
