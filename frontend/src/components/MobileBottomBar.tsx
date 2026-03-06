import { Home, ShoppingBag, Plus, MessageCircle, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/**
 * 移动端底部导航栏
 * 仅在移动端显示，PC端隐藏
 */
export default function MobileBottomBar() {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-14">
        {/* 首页 */}
        <Link to="/" className="flex flex-col items-center justify-center flex-1 h-full">
          <Home size={24} className={isActive('/') ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs mt-0.5 ${isActive('/') ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
            首页
          </span>
        </Link>

        {/* 市集 */}
        <Link to="/map" className="flex flex-col items-center justify-center flex-1 h-full">
          <ShoppingBag size={24} className={isActive('/map') ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs mt-0.5 ${isActive('/map') ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
            市集
          </span>
        </Link>

        {/* 发布按钮 - 醒目的红色圆形 */}
        <button className="flex items-center justify-center w-12 h-12 -mt-2 bg-gradient-to-r from-[#FF2442] to-[#FF6B6B] rounded-full shadow-lg">
          <Plus size={28} className="text-white" strokeWidth={3} />
        </button>

        {/* 消息 */}
        <Link to="/world" className="flex flex-col items-center justify-center flex-1 h-full relative">
          <MessageCircle size={24} className={isActive('/world') ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs mt-0.5 ${isActive('/world') ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
            消息
          </span>
          {/* 未读消息角标 */}
          <span className="absolute top-1 right-6 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>

        {/* 我 */}
        <Link to="/profile" className="flex flex-col items-center justify-center flex-1 h-full">
          <User size={24} className={isActive('/profile') ? 'text-gray-900' : 'text-gray-400'} />
          <span className={`text-xs mt-0.5 ${isActive('/profile') ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
            我
          </span>
        </Link>
      </div>
    </div>
  )
}
