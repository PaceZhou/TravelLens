import { useState, useEffect } from 'react'
import { Gift, Crosshair, Sparkles, Zap, Lock, Calendar, MapPin, X } from 'lucide-react'

const SCOPE_OPTIONS = [
  { id: 'city', label: '同城探秘', icon: '📍' },
  { id: 'province', label: '邻省周边', icon: '🚗' },
  { id: 'national', label: '漫游全国', icon: '🚄' },
  { id: 'global', label: '瞬息全宇宙', icon: '✈️' }
]

// 模拟盲盒结果
const MYSTERY_RESULT = {
  city: '北京',
  spots: [
    { id: 1, name: '故宫角楼', desc: '日落时分金色余晖洒在红墙黄瓦上', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: '天坛公园', desc: '明清两代皇帝祭天的场所', image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: '颐和园', desc: '中国现存最大的皇家园林', image: 'https://images.unsplash.com/photo-1598974357801-cbf3f2d81e15?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: '长城', desc: '世界七大奇迹之一', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: '南锣鼓巷', desc: '北京最古老的街区之一', image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=400' }
  ]
}

export default function BlindBox() {
  const [selectedScope, setSelectedScope] = useState('national')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawText, setDrawText] = useState('')
  const [result, setResult] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 登录状态
  const [showLogin, setShowLogin] = useState(false) // 显示登录弹窗
  const [canDraw, setCanDraw] = useState(true) // 是否可以抽取
  const [nextDrawTime, setNextDrawTime] = useState<string | null>(null) // 下次抽取时间

  // 检查是否可以抽取（24小时限制）
  useEffect(() => {
    const lastDrawTime = localStorage.getItem('lastDrawTime')
    if (lastDrawTime) {
      const lastTime = new Date(lastDrawTime)
      const now = new Date()
      const diff = now.getTime() - lastTime.getTime()
      const hours = diff / (1000 * 60 * 60)
      
      if (hours < 24) {
        setCanDraw(false)
        const nextTime = new Date(lastTime.getTime() + 24 * 60 * 60 * 1000)
        setNextDrawTime(nextTime.toLocaleString('zh-CN'))
      }
    }
  }, [])

  const handleDraw = () => {
    // 检查登录状态
    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }

    // 检查24小时限制
    if (!canDraw) {
      alert(`每24小时只能抽取一次！\n下次抽取时间：${nextDrawTime}`)
      return
    }

    setIsDrawing(true)
    setResult(null)
    
    const texts = [
      "正在匹配气象数据...", 
      "扫描地理雷达...", 
      "过滤人潮拥挤度...", 
      "锁定最佳光影坐标...", 
      "发现 SSR 级隐藏机位！"
    ]
    
    let count = 0
    const interval = setInterval(() => {
      setDrawText(texts[count % texts.length])
      count++
    }, 400)

    setTimeout(() => {
      clearInterval(interval)
      setIsDrawing(false)
      setResult(MYSTERY_RESULT)
      
      // 记录抽取时间
      const now = new Date()
      localStorage.setItem('lastDrawTime', now.toISOString())
      setCanDraw(false)
      const nextTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      setNextDrawTime(nextTime.toLocaleString('zh-CN'))
    }, 2500)
  }

  // 模拟登录
  const handleLogin = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-10 min-h-screen">
      {/* 背景光晕 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-[#0055FF]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-[#CCFF00]/20 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="z-10 w-full max-w-2xl flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-900 mb-8 shadow-sm uppercase tracking-widest">
          <Zap size={16} className="text-[#0055FF]" /> AI Destiny Radar
        </div>

        <h1 className="text-7xl font-black text-center mb-12 leading-tight tracking-tighter text-gray-900">
          不知道去哪？<br/>
          <span className="relative inline-block">
            一键抽取目的地
            <div className="absolute bottom-1 left-0 w-full h-4 bg-[#CCFF00] -z-10 transform -rotate-2"></div>
          </span>
        </h1>

        {/* 范围选择器 */}
        <div className="w-full bg-white/60 backdrop-blur-xl border border-white p-2 rounded-3xl flex flex-wrap gap-2 mb-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {SCOPE_OPTIONS.map(scope => (
            <button
              key={scope.id}
              onClick={() => setSelectedScope(scope.id)}
              className={`flex-1 py-4 px-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 font-bold ${
                selectedScope === scope.id 
                  ? 'bg-gray-900 text-white shadow-lg scale-105' 
                  : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-900'
              }`}
            >
              <span className="text-2xl">{scope.icon}</span>
              <span className="text-sm">{scope.label}</span>
            </button>
          ))}
        </div>

        {/* 抽签按钮 */}
        <button 
          onClick={handleDraw}
          disabled={isDrawing}
          className={`relative group w-64 h-64 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${isDrawing ? 'scale-95' : 'hover:scale-105 hover:-translate-y-2'}`}
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#0055FF] to-[#CCFF00] opacity-20 ${isDrawing ? 'animate-spin' : 'group-hover:animate-spin'}`}></div>
          <div className="absolute inset-2 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border border-gray-100">
            {isDrawing ? (
              <>
                <Crosshair size={40} className="text-[#0055FF] animate-pulse mb-3" />
                <div className="text-sm font-bold text-gray-900 text-center px-4 animate-pulse h-10">
                  {drawText}
                </div>
              </>
            ) : !isLoggedIn ? (
              <>
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Lock size={36} className="text-gray-500" />
                </div>
                <span className="font-black text-xl tracking-widest text-gray-500">需要登录</span>
              </>
            ) : !canDraw ? (
              <>
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Calendar size={36} className="text-gray-500" />
                </div>
                <span className="font-black text-sm tracking-widest text-gray-500 text-center px-4">24小时后可用</span>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#CCFF00] rounded-full flex items-center justify-center mb-2 group-hover:bg-[#0055FF] transition-colors duration-300">
                  <Gift size={36} className="text-gray-900 group-hover:text-white" />
                </div>
                <span className="font-black text-2xl tracking-widest text-gray-900">DRAW</span>
              </>
            )}
          </div>
        </button>

        {/* 提示信息 */}
        {!canDraw && nextDrawTime && (
          <div className="mt-6 text-center text-sm text-gray-600">
            下次抽取时间：{nextDrawTime}
          </div>
        )}
      </div>

      {/* 登录弹窗 */}
      {showLogin && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowLogin(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white/90 backdrop-blur-2xl rounded-3xl z-[9999] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">🔐 登录</h2>
              <button onClick={() => setShowLogin(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">登录后即可使用盲盒功能，每24小时可抽取一次</p>
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black rounded-2xl hover:shadow-xl transition-all"
            >
              立即登录
            </button>
          </div>
        </>
      )}

      {/* 结果浮窗 */}
      {result && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setResult(null)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl max-h-[80vh] bg-white/90 backdrop-blur-3xl rounded-3xl z-[9999] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CCFF00] text-gray-900 text-xs font-black uppercase tracking-widest mb-3 rounded-sm">
                    <Sparkles size={14} /> SSR HIT
                  </div>
                  <h2 className="text-4xl font-black">🎯 今日任务：探索{result.city}</h2>
                </div>
                <button onClick={() => setResult(null)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-8">完成以下5个打卡点，解锁城市探索成就！</p>

              <div className="space-y-4">
                {result.spots.map((spot, index) => (
                  <div key={spot.id} className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
                    <div className="flex gap-4 p-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 w-6 h-6 bg-[#0055FF] rounded-full flex items-center justify-center text-white text-xs font-black">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-lg mb-2">{spot.name}</h3>
                        <p className="text-sm text-gray-600">{spot.desc}</p>
                      </div>
                      <div className="flex items-center">
                        <MapPin size={20} className="text-[#0055FF]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black rounded-2xl hover:shadow-xl transition-all">
                保存到我的日历
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
