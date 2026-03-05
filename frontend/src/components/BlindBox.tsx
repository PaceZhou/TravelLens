import { useState } from 'react'
import { Gift, Crosshair, Sparkles, Zap } from 'lucide-react'

const SCOPE_OPTIONS = [
  { id: 'city', label: '同城探秘', icon: '📍' },
  { id: 'province', label: '邻省周边', icon: '🚗' },
  { id: 'national', label: '漫游全国', icon: '🚄' },
  { id: 'global', label: '瞬息全宇宙', icon: '✈️' }
]

const MYSTERY_DESTINATIONS = [
  {
    id: 1,
    city: '中国 · 北京',
    title: '故宫角楼日落',
    tags: ['历史', '建筑', '日落'],
    description: '西北角楼是故宫最佳拍摄机位，日落时分金色余晖洒在红墙黄瓦上，配合护城河倒影，出片率极高。',
    cover: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=1200'
  }
]

export default function BlindBox() {
  const [selectedScope, setSelectedScope] = useState('national')
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawText, setDrawText] = useState('')
  const [result, setResult] = useState(null)

  const handleDraw = () => {
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
      setResult(MYSTERY_DESTINATIONS[0])
    }, 2500)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pb-24">
        <div className="relative h-[60vh] w-full max-w-7xl mx-auto mt-6 rounded-[3rem] overflow-hidden group shadow-2xl">
          <img src={result.cover} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
          
          <button 
            onClick={() => setResult(null)} 
            className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            ←
          </button>

          <div className="absolute bottom-10 left-0 w-full px-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CCFF00] text-gray-900 text-xs font-black uppercase tracking-widest mb-4 rounded-sm">
              <Sparkles size={14} /> SSR HIT
            </div>
            <h1 className="text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-md">
              {result.title}
            </h1>
            <p className="text-white text-xl">{result.city}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 rounded-[2rem]">
            <h3 className="text-gray-900 font-black text-xl mb-4">区域解码</h3>
            <p className="text-gray-600 text-base leading-relaxed">{result.description}</p>
          </div>
        </div>
      </div>
    )
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
      </div>
    </div>
  )
}
