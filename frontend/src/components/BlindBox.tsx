import { useState } from 'react'
import { Gift, Crosshair, Sparkles, MapPin, Zap } from 'lucide-react'

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
      <div className="result-view">
        <button onClick={() => setResult(null)} className="back-btn">
          返回
        </button>
        <h1>{result.title}</h1>
        <p>{result.city}</p>
        <p>{result.description}</p>
      </div>
    )
  }

  return (
    <div className="blind-box-container">
      <div className="badge">
        <Zap size={16} /> AI Destiny Radar
      </div>

      <h1 className="title">
        不知道去哪？<br/>
        一键抽取目的地
      </h1>

      <div className="scope-selector">
        {SCOPE_OPTIONS.map(scope => (
          <button
            key={scope.id}
            onClick={() => setSelectedScope(scope.id)}
            className={selectedScope === scope.id ? 'active' : ''}
          >
            <span className="icon">{scope.icon}</span>
            <span>{scope.label}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={handleDraw}
        disabled={isDrawing}
        className="draw-button"
      >
        {isDrawing ? (
          <>
            <Crosshair size={40} className="spin" />
            <div className="draw-text">{drawText}</div>
          </>
        ) : (
          <>
            <Gift size={36} />
            <span>DRAW</span>
          </>
        )}
      </button>
    </div>
  )
}
