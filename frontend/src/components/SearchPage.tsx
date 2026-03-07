import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'

/**
 * 搜索页面
 * 移动端专用
 */
export default function SearchPage() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 顶部搜索栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索地点、标签、用户..."
              className="flex-1 bg-transparent outline-none text-sm"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* 搜索结果区域 */}
      <div className="pt-16 px-4">
        <div className="text-center py-20 text-gray-400">
          {searchText ? '搜索功能开发中...' : '输入关键词开始搜索'}
        </div>
      </div>
    </div>
  )
}
