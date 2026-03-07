import { Gift, Map, Plus, Globe, User } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/**
 * 移动端底部导航栏
 * 仅在移动端显示，PC端隐藏
 */
export default function MobileBottomBar() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const isActive = (path: string) => location.pathname === path

  // 发布按钮点击 - 触发发布事件
  const handlePublish = () => {
    window.dispatchEvent(new CustomEvent('openPublisher'))
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#9DF9FF] border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-14">
        {/* 芒一下 */}
        <Link to="/" className="flex flex-col items-center justify-center flex-1 h-full">
          <Gift size={24} className={isActive('/') ? 'text-[#FFB800]' : 'text-gray-700'} />
          <span className={`text-xs mt-0.5 ${isActive('/') ? 'text-[#FFB800] font-semibold' : 'text-gray-700'}`}>
            芒一下
          </span>
        </Link>

        {/* 芒GO MAP */}
        <Link to="/map" className="flex flex-col items-center justify-center flex-1 h-full">
          <Map size={24} className={isActive('/map') ? 'text-[#FFB800]' : 'text-gray-700'} />
          <span className={`text-xs mt-0.5 ${isActive('/map') ? 'text-[#FFB800] font-semibold' : 'text-gray-700'}`}>
            芒GO MAP
          </span>
        </Link>

        {/* 发布按钮 - 芒果黄渐变 */}
        <button 
          onClick={handlePublish}
          className="flex items-center justify-center w-12 h-12 -mt-2 bg-gradient-to-r from-[#FFB800] to-[#FFCC00] rounded-full shadow-lg"
        >
          <Plus size={28} className="text-white" strokeWidth={3} />
        </button>

        {/* 芒GO Show */}
        <Link to="/world" className="flex flex-col items-center justify-center flex-1 h-full">
          <Globe size={24} className={isActive('/world') ? 'text-[#FFB800]' : 'text-gray-700'} />
          <span className={`text-xs mt-0.5 ${isActive('/world') ? 'text-[#FFB800] font-semibold' : 'text-gray-700'}`}>
            芒GO Show
          </span>
        </Link>

        {/* 我的 */}
        <Link to="/profile" className="flex flex-col items-center justify-center flex-1 h-full">
          <User size={24} className={isActive('/profile') ? 'text-[#FFB800]' : 'text-gray-700'} />
          <span className={`text-xs mt-0.5 ${isActive('/profile') ? 'text-[#FFB800] font-semibold' : 'text-gray-700'}`}>
            我的
          </span>
        </Link>
      </div>
    </div>
  )
}
