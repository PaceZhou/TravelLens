import { useState } from 'react'
import BlindBox from './components/BlindBox'
import MapView from './components/MapView'
import Community from './components/Community'
import { useLanguage } from './contexts/LanguageContext'
import { User, Globe, ChevronDown } from 'lucide-react'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('gacha')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const { lang, switchLanguage, t } = useLanguage()

  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'it', name: 'Italiano' },
    { code: 'ar', name: 'العربية' }
  ]

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
        {currentTab === 'profile' && (
          <div className="profile-page">
            <div className="profile-container">
              <h2>{t.nav.profile}</h2>
              <div className="auth-buttons">
                <button className="btn-primary">{t.auth.login}</button>
                <button className="btn-secondary">{t.auth.register}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
