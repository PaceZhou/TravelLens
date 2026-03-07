import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import BlindBox from './components/BlindBox'
import MapView from './components/MapView'
import Community from './components/Community'
import Profile from './components/Profile'
import MobileProfile from './components/MobileProfile'
import PostDetailPage from './components/PostDetailPage'
import Inbox from './components/Inbox'
import SearchPage from './components/SearchPage'
import MobileTopBar from './components/MobileTopBar'
import MobileBottomBar from './components/MobileBottomBar'
import { useLanguage } from './contexts/LanguageContext'
import { authAPI } from './api/auth'
import { API_URL } from './api/config'
import { User, Globe, ChevronDown, Inbox as InboxIcon } from 'lucide-react'
import './App.css'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [showInbox, setShowInbox] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { lang, switchLanguage, t } = useLanguage()

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'it', name: 'Italiano' },
    { code: 'ar', name: 'العربية' }
  ]

  const getCurrentTab = () => {
    if (location.pathname === '/') return 'gacha'
    if (location.pathname === '/map') return 'map'
    if (location.pathname === '/world') return 'world'
    if (location.pathname.startsWith('/profile')) return 'profile'
    return 'gacha'
  }

  // 监听登录请求事件
  useEffect(() => {
    const handleOpenAuth = (e: any) => {
      setAuthMode(e.detail || 'login')
      setShowAuthModal(true)
    }
    window.addEventListener('openAuth', handleOpenAuth)
    return () => window.removeEventListener('openAuth', handleOpenAuth)
  }, [])

  // 恢复登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setIsLoggedIn(true)
      setUsername(user.username)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      const savedUser = localStorage.getItem('user')
      const userId = savedUser ? JSON.parse(savedUser).id : ''
      
      const fetchUnreadCount = () => {
        fetch(`${API_URL}/notifications/unread/${userId}`)
          .then(res => res.json())
          .then(count => setUnreadCount(count))
          .catch(() => {})
      }
      
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  // 全局监听发布按钮事件
  useEffect(() => {
    const handleOpenPublisher = () => {
      if (location.pathname === '/world') {
        // Community页面自己处理
        return
      }
      // 其他页面跳转到Community
      navigate('/world')
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openPublisher'))
      }, 100)
    }
    window.addEventListener('openPublisher', handleOpenPublisher)
    return () => window.removeEventListener('openPublisher', handleOpenPublisher)
  }, [location.pathname, navigate])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('user')
    navigate('/')
  }

  const currentTab = getCurrentTab()

  return (
    <div className="app">
      {/* 移动端顶部导航 */}
      <MobileTopBar />
      
      <header className="header md:flex hidden">
        <h1>🥭 {t.app.name}</h1>
        <nav className="nav">
          <Link to="/" className={currentTab === 'gacha' ? 'active' : ''}>
            {t.nav.blindbox}
          </Link>
          <Link to="/map" className={currentTab === 'map' ? 'active' : ''}>
            {t.nav.map}
          </Link>
          <Link to="/world" className={currentTab === 'world' ? 'active' : ''}>
            {t.nav.world}
          </Link>
          <Link to="/profile" className={currentTab === 'profile' ? 'active' : ''}>
            {t.nav.profile}
          </Link>
        </nav>
        
        {/* 登录/注册按钮 */}
        {!isLoggedIn ? (
          <div className="flex gap-2">
            <button 
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t.auth.login}
            </button>
            <button 
              onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
              className="px-4 py-2 text-sm font-bold bg-[#0055FF] text-white rounded-lg hover:bg-[#0044DD] transition-colors"
            >
              {t.auth.register}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInbox(true)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <InboxIcon size={20} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            <span className="text-sm font-bold text-gray-700">👋 {username}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {t.auth.logout}
            </button>
          </div>
        )}
        
        {/* 语言切换下拉菜单 */}
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="lang-switch"
          >
            <Globe size={16} /> 
            {languages.find(l => l.code === lang)?.name}
            <ChevronDown size={14} />
          </button>
          
          {showLangMenu && (
            <div className="lang-dropdown">
              {languages.map(language => (
                <button
                  key={language.code}
                  onClick={() => {
                    switchLanguage(language.code as any)
                    setShowLangMenu(false)
                  }}
                  className={`lang-option ${lang === language.code ? 'active' : ''}`}
                >
                  {language.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="pt-14 pb-16 md:pt-0 md:pb-0">
        <Routes>
          <Route path="/" element={
            window.innerWidth < 768 ? 
            <Community isLoggedIn={isLoggedIn} /> : 
            <BlindBox isLoggedIn={isLoggedIn} />
          } />
          <Route path="/blindbox" element={<BlindBox isLoggedIn={isLoggedIn} />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/world" element={<Community isLoggedIn={isLoggedIn} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={isLoggedIn ? (
            window.innerWidth < 768 ? 
            <MobileProfile username={username} /> : 
            <Profile username={username} />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <p className="text-gray-600 mb-4">请先登录查看个人主页</p>
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-full font-bold"
                >
                  立即登录
                </button>
              </div>
            </div>
          )} />
          <Route path="/users/:userId" element={<Profile username="" />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
        </Routes>
      </main>

      {/* 登录/注册弹窗 */}
      {showAuthModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowAuthModal(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-3xl z-[9999] p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">{authMode === 'login' ? t.auth.login : t.auth.register}</h2>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const user = formData.get('username') as string
              const pass = formData.get('password') as string
              
              try {
                if (authMode === 'register') {
                  await authAPI.register(user, pass)
                }
                const result = await authAPI.login(user, pass)
                setIsLoggedIn(true)
                setUsername(result.username)
                localStorage.setItem('user', JSON.stringify(result))
                setShowAuthModal(false)
              } catch (err) {
                console.error('认证错误:', err)
                alert(authMode === 'register' ? '注册失败，用户名可能已存在' : '登录失败，请检查用户名和密码')
              }
            }}>
              <input 
                name="username"
                type="text" 
                placeholder="用户名"
                required
                className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:border-[#0055FF]"
              />
              <input 
                name="password"
                type="password" 
                placeholder="密码"
                required
                className="w-full p-3 border border-gray-200 rounded-xl mb-6 focus:outline-none focus:border-[#0055FF]"
              />
              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black rounded-xl hover:shadow-xl transition-all"
              >
                {authMode === 'login' ? t.auth.login : t.auth.register}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-sm text-gray-600 hover:text-[#0055FF]"
              >
                {authMode === 'login' ? '没有账号？立即注册' : '已有账号？立即登录'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 收件箱 */}
      <Inbox isOpen={showInbox} onClose={() => setShowInbox(false)} />
      
      {/* 移动端底部导航 */}
      <MobileBottomBar />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
