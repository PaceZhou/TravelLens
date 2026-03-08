import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { followsAPI } from '../api/follows'

interface User {
  id: string
  username: string
  avatar?: string
}

interface FollowListModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'following' | 'followers'
  userId: string
}

export default function FollowListModal({ isOpen, onClose, type, userId }: FollowListModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!isOpen || !userId) return
    const fn = type === 'followers' ? followsAPI.getFollowers : followsAPI.getFollowing
    fn(userId)
      .then(setUsers)
      .catch(() => {})
  }, [isOpen, userId, type])

  useEffect(() => {
    if (!isOpen || !currentUser.id) return
    followsAPI.getFollowing(currentUser.id)
      .then((list: User[]) => setFollowingSet(new Set(list.map(u => u.id))))
      .catch(() => {})
  }, [isOpen, currentUser.id])

  const handleFollowToggle = async (targetId: string) => {
    if (!currentUser.id) return
    if (followingSet.has(targetId)) {
      await followsAPI.unfollow(currentUser.id, targetId)
      setFollowingSet(prev => { const s = new Set(prev); s.delete(targetId); return s })
    } else {
      await followsAPI.follow(currentUser.id, targetId)
      setFollowingSet(prev => new Set(prev).add(targetId))
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[10000]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-h-[70vh] bg-white rounded-3xl z-[10001] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-black">{type === 'followers' ? '粉丝' : '关注'}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-50">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">暂无数据</div>
          ) : (
            users.map(user => (
              <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB800] to-[#00D4AA] flex items-center justify-center text-lg cursor-pointer flex-shrink-0 overflow-hidden"
                  onClick={() => { navigate(`/users/${user.username}`); onClose() }}
                >
                  {user.avatar && user.avatar.startsWith('data:') ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user.avatar || '👤'
                  )}
                </div>
                <span
                  className="flex-1 font-bold text-sm cursor-pointer hover:text-[#0055FF]"
                  onClick={() => { navigate(`/users/${user.username}`); onClose() }}
                >
                  {user.username}
                </span>
                {currentUser.id && currentUser.id !== user.id && (
                  <button
                    onClick={() => handleFollowToggle(user.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      followingSet.has(user.id)
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-[#0055FF] text-white hover:bg-[#0044DD]'
                    }`}
                  >
                    {followingSet.has(user.id) ? '已关注' : '关注'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
