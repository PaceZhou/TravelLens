import { useState } from 'react'
import BlindBox from './components/BlindBox'
import MapView from './components/MapView'
import './App.css'

function App() {
  const [currentTab, setCurrentTab] = useState('gacha')

  return (
    <div className="app">
      <header className="header">
        <h1>🎁 TravelLens</h1>
        <nav className="nav">
          <button 
            onClick={() => setCurrentTab('gacha')}
            className={currentTab === 'gacha' ? 'active' : ''}
          >
            盲盒
          </button>
          <button 
            onClick={() => setCurrentTab('map')}
            className={currentTab === 'map' ? 'active' : ''}
          >
            地图
          </button>
        </nav>
      </header>

      <main>
        {currentTab === 'gacha' && <BlindBox />}
        {currentTab === 'map' && <MapView />}
      </main>
    </div>
  )
}

export default App
