import { useState, useEffect } from 'react'
import BlindBox from './components/BlindBox'
import MapView from './components/MapView'
import Community from './components/Community'
import Profile from './components/Profile'
import { useLanguage } from './contexts/LanguageContext'
import { User, Globe, ChevronDown } from 'lucide-react'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('gacha')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const { lang, switchLanguage, t } = useLanguage()

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'it', name: 'Italiano' },
    { code: 'ar', name: 'العربية' }
  ]

  // 监听登录请求事件
  useEffect(() => {
    const handleOpenAuth = (e: any) => {
      setAuthMode(e.detail || 'login')
      setShowAuthModal(true)
    }
    window.addEventListener('openAuth', handleOpenAuth)
    return () => window.removeEventListener('openAuth', handleOpenAuth)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>🥭 {t.app.name}</h1>
        <nav className="nav">
          <button 
            onClick={() => setCurrentTab('gacha')}
            className={currentTab === 'gacha' ? 'active' : ''}
          >
            {t.nav.blindbox}
          </button>
          <button 
            onClick={() => setCurrentTab('map')}
            className={currentTab === 'map' ? 'active' : ''}
          >
            {t.nav.map}
          </button>
          <button 
            onClick={() => setCurrentTab('world')}
            className={currentTab === 'world' ? 'active' : ''}
          >
            {t.nav.world}
          </button>
          <button 
            onClick={() => setCurrentTab('profile')}
            className={currentTab === 'profile' ? 'active' : ''}
          >
            <User size={16} /> {t.nav.profile}
          </button>
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
            <span className="text-sm font-bold text-gray-700">👋 {username}</span>
            <button 
              onClick={() => { setIsLoggedIn(false); setUsername(''); }}
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

      <main>
        {currentTab === 'gacha' && <BlindBox />}
        {currentTab === 'map' && <MapView />}
        {currentTab === 'world' && <Community />}
        {currentTab === 'profile' && (isLoggedIn ? <Profile /> : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-3xl font-black mb-4">🔒 需要登录</h2>
              <p className="text-gray-600 mb-6">登录后查看个人空间</p>
              <button 
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl hover:bg-[#0044DD]"
              >
                立即登录
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* 登录/注册弹窗 */}
      {showAuthModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowAuthModal(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-3xl z-[9999] p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">{authMode === 'login' ? t.auth.login : t.auth.register}</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const user = formData.get('username') as string
              const pass = formData.get('password') as string
              
              if (authMode === 'register') {
                alert('注册成功！')
              }
              setIsLoggedIn(true)
              setUsername(user)
              setShowAuthModal(false)
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
    </div>
  )
}

export default App
