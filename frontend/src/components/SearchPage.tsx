import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Heart, MessageCircle, X } from 'lucide-react'
import { API_URL } from '../api/config'

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [allPosts, setAllPosts] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [hotPosts, setHotPosts] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/posts?limit=200`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.posts || []
        setAllPosts(list)
        setHotPosts([...list].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).slice(0, 10))
      })
      .catch(() => {})
  }, [])

  const doSearch = () => {
    const q = searchText.trim().toLowerCase()
    if (!q) return
    setSearched(true)
    setResults(
      allPosts.filter(p =>
        (p.content || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t: string) => t.toLowerCase().includes(q))
      )
    )
  }

  const clear = () => {
    setSearchText('')
    setSearched(false)
    setResults([])
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 搜索栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="搜索内容、地点、标签..."
              className="flex-1 bg-transparent outline-none text-sm"
              autoFocus
            />
            {searchText && (
              <button onClick={clear}>
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={doSearch}
            className="text-sm font-bold text-[#0055FF] whitespace-nowrap"
          >
            搜索
          </button>
        </div>
      </div>

      <div className="pt-16 px-4 pb-6">
        {!searched ? (
          /* 热门帖子列表 */
          <div>
            <h2 className="text-base font-black text-gray-800 mt-4 mb-3">🔥 热门内容</h2>
            {hotPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">加载中...</div>
            ) : (
              <div className="space-y-2">
                {hotPosts.map((post, i) => (
                  <button
                    key={post.id}
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className={`text-lg font-black w-6 text-center ${i < 3 ? 'text-[#FF4444]' : 'text-gray-300'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{post.content || '(无文字)'}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {post.location && <span>📍 {post.location}</span>}
                        <span className="flex items-center gap-1">
                          <Heart size={11} className="text-red-400" /> {post.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={11} className="text-blue-400" /> {post.commentsCount || 0}
                        </span>
                      </div>
                    </div>
                    {post.images?.[post.coverIndex ?? 0] && (
                      <img
                        src={post.images[post.coverIndex ?? 0]}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 搜索结果 */
          <div>
            <h2 className="text-base font-black text-gray-800 mt-4 mb-3">
              找到 {results.length} 条结果
            </h2>
            {results.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">没有找到相关内容</div>
            ) : (
              <div className="space-y-2">
                {results.map(post => (
                  <button
                    key={post.id}
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-2xl hover:bg-gray-50 transition-colors text-left"
                  >
                    {post.images?.[post.coverIndex ?? 0] ? (
                      <img
                        src={post.images[post.coverIndex ?? 0]}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{post.content || '(无文字)'}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {post.location && <span>📍 {post.location}</span>}
                        <span className="flex items-center gap-1">
                          <Heart size={11} className="text-red-400" /> {post.likesCount || 0}
                        </span>
                      </div>
                      {post.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {post.tags.slice(0, 3).map((t: string) => (
                            <span key={t} className="text-xs bg-blue-50 text-[#0055FF] px-2 py-0.5 rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
