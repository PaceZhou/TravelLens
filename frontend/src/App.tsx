import { useState } from 'react'
import MapView from './components/MapView'
import './App.css'

function App() {
  const [showMap, setShowMap] = useState(false)

  return (
    <div className="app">
      {!showMap ? (
        <>
          <header className="header">
            <h1>🎁 TravelLens 旅拍指南</h1>
            <p>地图优先的旅行出片指南</p>
          </header>
          
          <main className="main">
            <div className="status">
              <h2>📊 Day 1 进度</h2>
              <p>✅ 前端项目已初始化</p>
              <p>✅ 地图组件已创建</p>
              <p>🔄 正在集成 Leaflet...</p>
            </div>
            
            <button 
              onClick={() => setShowMap(true)}
              className="btn-primary"
            >
              查看地图 Demo
            </button>
          </main>
        </>
      ) : (
        <MapView />
      )}
    </div>
  )
}

export default App
