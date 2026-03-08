import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageCircle, UserPlus, UserCheck } from 'lucide-react'
import { API_URL } from '../api/config'
import { followsAPI } from '../api/follows'
import { postsAPI } from '../api/posts'
import FollowListModal from './FollowListModal'

export default function UserProfilePage() {
  const { userId: targetUsername } = useParams<{ userId: string }>()
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isOwnProfile = currentUser.username === targetUsername

  const [targetUser, setTargetUser] = useState<any>(null)
  const [stats, setStats] = useState({ posts: 0, following: 0, followers: 0, likes: 0 })
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [followListModal, setFollowListModal] = useState<{ type: 'following' | 'followers' } | null>(null)

  // 加载目标用户信息
  useEffect(() => {
    if (!targetUsername) return
    fetch(`${API_URL}/auth/user/${targetUsername}`)
      .then(res => res.json())
      .then(data => setTargetUser(data))
      .catch(() => {})

    fetch(`${API_URL}/auth/stats/${targetUsername}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})

    postsAPI.getAll().then(result => {
      const posts = result.posts.filter((p: any) => p.user?.username === targetUsername)
      setUserPosts(posts)
    }).catch(() => {})
  }, [targetUsername])

  // 检查是否已关注
  useEffect(() => {
    if (!currentUser.id || !targetUser?.id || isOwnProfile) return
    followsAPI.isFollowing(currentUser.id, targetUser.id)
      .then(res => setIsFollowing(res.isFollowing))
      .catch(() => {})
  }, [currentUser.id, targetUser?.id, isOwnProfile])

  const handleFollowToggle = async () => {
    if (!currentUser.id) {
      window.dispatchEvent(new CustomEvent('openAuth', { detail: 'login' }))
      return
    }
    if (isFollowing) {
      await followsAPI.unfollow(currentUser.id, targetUser.id)
      setIsFollowing(false)
      setStats(s => ({ ...s, followers: s.followers - 1 }))
    } else {
      await followsAPI.follow(currentUser.id, targetUser.id)
      setIsFollowing(true)
      setStats(s => ({ ...s, followers: s.followers + 1 }))
    }
  }

  const handleMessage = () => {
    if (!currentUser.id) {
      window.dispatchEvent(new CustomEvent('openAuth', { detail: 'login' }))
      return
    }
    navigate(`/messages/${targetUser.id}`)
  }

  if (!targetUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-5">
            {/* 头像 */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-4xl overflow-hidden flex-shrink-0">
              {targetUser.avatar && targetUser.avatar.startsWith('data:') ? (
                <img src={targetUser.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                targetUser.avatar || '👤'
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-black mb-1">{targetUser.username}</h1>

              {/* 统计数字 */}
              <div className="flex gap-5 mb-3">
                <div className="text-center">
                  <div className="font-black text-lg">{stats.posts}</div>
                  <div className="text-xs text-gray-500">帖子</div>
                </div>
                <div
                  className="text-center cursor-pointer hover:opacity-75"
                  onClick={() => setFollowListModal({ type: 'following' })}
                >
                  <div className="font-black text-lg">{stats.following}</div>
                  <div className="text-xs text-gray-500">关注</div>
                </div>
                <div
                  className="text-center cursor-pointer hover:opacity-75"
                  onClick={() => setFollowListModal({ type: 'followers' })}
                >
                  <div className="font-black text-lg">{stats.followers}</div>
                  <div className="text-xs text-gray-500">粉丝</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-lg">{stats.likes}</div>
                  <div className="text-xs text-gray-500">获赞</div>
                </div>
              </div>

              {/* 操作按钮 */}
              {!isOwnProfile && (
                <div className="flex gap-3">
                  <button
                    onClick={handleFollowToggle}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-[#0055FF] text-white hover:bg-[#0044DD]'
                    }`}
                  >
                    {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                    {isFollowing ? '已关注' : '关注'}
                  </button>
                  <button
                    onClick={handleMessage}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    <MessageCircle size={16} />
                    私信
                  </button>
                </div>
              )}
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/profile')}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  编辑主页
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 帖子网格 */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="text-lg font-black mb-4">TA 的帖子</h2>
          {userPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">还没有发布任何内容</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {userPosts.map(post => (
                <div key={post.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <img
                    src={post.images?.[post.coverIndex || 0] || post.images?.[0] || ''}
                    alt={post.content}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 关注/粉丝弹窗 */}
      {followListModal && targetUser && (
        <FollowListModal
          isOpen={true}
          onClose={() => setFollowListModal(null)}
          type={followListModal.type}
          userId={targetUser.id}
        />
      )}
    </div>
  )
}
