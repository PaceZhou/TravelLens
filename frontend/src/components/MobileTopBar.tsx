import { Search, Menu } from 'lucide-react'
import { useState } from 'react'

/**
 * 移动端顶部导航栏
 * 仅在移动端显示，PC端隐藏
 */
export default function MobileTopBar() {
  const [activeTab, setActiveTab] = useState<'关注' | '发现' | '同城'>('发现')

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#CCFF00] border-b border-gray-200 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* 左侧菜单图标 */}
        <button className="w-8 h-8 flex items-center justify-center">
          <Menu size={24} className="text-gray-700" />
        </button>

        {/* 中间三个Tab */}
        <div className="flex items-center gap-6">
          {(['关注', '发现', '同城'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-1"
            >
              <span className={`text-base ${activeTab === tab ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                {tab}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"></div>
              )}
              {tab === '关注' && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  10
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 右侧搜索图标 */}
        <button className="w-8 h-8 flex items-center justify-center">
          <Search size={22} className="text-gray-700" />
        </button>
      </div>
    </div>
  )
}
