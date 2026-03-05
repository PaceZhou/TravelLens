import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🎁 TravelLens 旅拍指南</h1>
        <p>地图优先的旅行出片指南</p>
      </header>
      
      <main className="main">
        <div className="status">
          <h2>📊 项目状态</h2>
          <p>✅ 前端项目已初始化</p>
          <p>⏳ 地图功能开发中...</p>
          <p>⏳ 盲盒功能开发中...</p>
        </div>
        
        <div className="progress">
          <h3>Day 1 进度</h3>
          <ul>
            <li>✅ 项目框架搭建</li>
            <li>🔄 地图组件开发中</li>
            <li>⏳ 盲盒功能待开始</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App
