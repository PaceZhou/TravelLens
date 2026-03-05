import { useState } from 'react'
import { Heart, Clock, MapPin, Hash, Camera, Search, Shuffle, X, ChevronUp, ChevronDown } from 'lucide-react'

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Vivid_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    location: '重庆 · 洪崖洞',
    city: '重庆',
    image: 'https://images.unsplash.com/photo-1558281050-8cbbeafc6007?auto=format&fit=crop&q=80&w=800',
    content: '大雨过后的洪崖洞简直是重庆版赛博朋克！给大家分享一个完全没人的倒影机位！☔️',
    tags: ['赛博朋克', '夜景', '废土风'],
    likes: 8942,
    time: '10分钟前'
  },
  {
    id: 2,
    author: 'Nomad_Leon',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
    location: '冰岛 · 维克黑沙滩',
    city: '冰岛',
    image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=800',
    content: '抽到了全球盲盒！连夜飞冰岛。外星地貌的黑沙滩，配上今天阴冷的天气，出片率极高。',
    tags: ['暗黑风', '世界尽头', '极简'],
    likes: 3210,
    time: '2小时前'
  },
  {
    id: 3,
    author: '胶片爱好者',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100',
    location: '镰仓 · 湘南海岸',
    city: '镰仓',
    image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800',
    content: '终于拍到了江之电！建议大家不要在十字路口扎堆，往前走200米的坡道上人少很多。',
    tags: ['胶片', '日系', '看海'],
    likes: 1540,
    time: '5小时前'
  },
  {
    id: 4,
    author: 'Urban_Explorer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    location: '北京 · 故宫',
    city: '北京',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
    content: '故宫角楼日落，等了3天终于等到完美光线！',
    tags: ['历史', '建筑', '日落'],
    likes: 2100,
    time: '1天前'
  }
]

const keywords = ['全部', '克莱因蓝', '极简', '日系', '城市漫游', '自然']

export default function Community() {
  const [feedSort, setFeedSort] = useState('latest')
  const [activeKeyword, setActiveKeyword] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [currentCity, setCurrentCity] = useState('全部')
  const [showUpload, setShowUpload] = useState(false)

  const cities = ['全部', '同城', '北京', '重庆', '冰岛', '镰仓']

  const handleRandomPick = () => {
    const randomIndex = Math.floor(Math.random() * COMMUNITY_POSTS.length)
    setSelectedPost(randomIndex)
  }

  const handleSwipe = (direction: 'up' | 'down') => {
    if (selectedPost === null) return
    
    if (direction === 'up' && selectedPost < COMMUNITY_POSTS.length - 1) {
      setSelectedPost(selectedPost + 1)
    } else if (direction === 'down' && selectedPost > 0) {
      setSelectedPost(selectedPost - 1)
    }
  }

  // 全屏查看模式
  if (selectedPost !== null) {
    const post = COMMUNITY_POSTS[selectedPost]
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* 顶部关闭按钮 */}
        <button 
          onClick={() => setSelectedPost(null)}
          className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10"
        >
          <X size={20} />
        </button>

        {/* 内容区 */}
        <div className="flex-1 flex items-center justify-center relative">
          <img src={post.image} alt="Post" className="max-h-full max-w-full object-contain" />
          
          {/* 左侧信息 */}
          <div className="absolute bottom-20 left-6 right-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border-2 border-white" />
              <span className="font-bold">{post.author}</span>
            </div>
            <p className="text-lg mb-3">{post.content}</p>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          </div>

          {/* 右侧互动 */}
          <div className="absolute bottom-20 right-6 flex flex-col gap-4">
            <button className="flex flex-col items-center text-white">
              <Heart size={28} />
              <span className="text-sm mt-1">{post.likes}</span>
            </button>
          </div>
        </div>

        {/* 滑动提示 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button 
            onClick={() => handleSwipe('down')}
            disabled={selectedPost === 0}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white disabled:opacity-30"
          >
            <ChevronDown size={24} />
          </button>
          <button 
            onClick={() => handleSwipe('up')}
            disabled={selectedPost === COMMUNITY_POSTS.length - 1}
            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white disabled:opacity-30"
          >
            <ChevronUp size={24} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#F8F9FA] px-4 py-8 min-h-screen max-w-7xl mx-auto w-full">
      
      {/* 频道头部 */}
      <div className="mb-8 sticky top-20 z-30 bg-[#F8F9FA]/90 backdrop-blur-xl pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-gray-900">
              世界频道 <span className="bg-[#CCFF00] text-gray-900 text-sm px-2 py-1 rounded-sm font-bold shadow-sm">LIVE</span>
            </h2>
            <p className="text-gray-500 text-base mt-2 font-medium">全球玩家正在这些坐标出没，交流前沿出片情报。</p>
          </div>
          
          {/* 排序按钮 */}
          <div className="flex gap-2">
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
              <button 
                onClick={() => setFeedSort('latest')} 
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'latest' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500'}`}
              >
                最新
              </button>
              <button 
                onClick={() => setFeedSort('hot')} 
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'hot' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500'}`}
              >
                热门
              </button>
              <button 
                onClick={() => setFeedSort('city')} 
                className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'city' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500'}`}
              >
                城市
              </button>
            </div>
            
            <button 
              onClick={handleRandomPick}
              className="px-4 py-2 bg-[#CCFF00] rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-[#b8e600] transition-colors"
            >
              <Shuffle size={16} /> 随机
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索地点、标签或用户..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl font-medium focus:outline-none focus:border-[#0055FF]"
            />
          </div>
        </div>

        {/* 城市筛选 */}
        {feedSort === 'city' && (
          <div className="flex gap-3 overflow-x-auto pb-2 mb-4" style={{ scrollbarWidth: 'none' }}>
            {cities.map(city => (
              <button 
                key={city}
                onClick={() => setCurrentCity(city)}
                className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-bold transition-all ${currentCity === city ? 'border-[#0055FF] bg-[#0055FF]/5 text-[#0055FF]' : 'border-gray-200 bg-white text-gray-600'}`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {/* 关键词滚动栏 */}
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {keywords.map(kw => (
            <button 
              key={kw}
              onClick={() => setActiveKeyword(kw)}
              className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-bold transition-all flex items-center ${activeKeyword === kw ? 'border-[#0055FF] bg-[#0055FF]/5 text-[#0055FF]' : 'border-gray-200 bg-white text-gray-600'}`}
            >
              {kw !== '全部' && <Hash size={14} className="mr-1 opacity-50" />}
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* 瀑布流 - 2列布局，增加宽度 */}
      <div className="columns-1 md:columns-2 gap-6 space-y-6">
        {COMMUNITY_POSTS.map((post, index) => (
          <div 
            key={post.id} 
            onClick={() => setSelectedPost(index)}
            className="break-inside-avoid bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2rem] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,85,255,0.08)] transition-all duration-300 group cursor-pointer"
          >
            <div className="relative p-2 pb-0">
              <div className="relative rounded-[1.5rem] overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center text-xs font-black text-gray-900 shadow-sm">
                  <MapPin size={12} className="mr-1 text-[#0055FF]" /> {post.location}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-900 text-base leading-relaxed mb-4 font-bold">
                {post.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[#0055FF] bg-blue-50 px-2 py-1 rounded-md text-xs font-bold">#{tag}</span>
                ))}
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-gray-200" />
                  <span className="text-sm text-gray-900 font-bold">{post.author}</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                  <span className="flex items-center"><Clock size={14} className="mr-1" /> {post.time}</span>
                  <button className="flex items-center hover:text-[#0055FF] transition-colors bg-gray-50 px-3 py-1.5 rounded-lg">
                    <Heart size={16} className="mr-1.5" /> {post.likes}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 悬浮发布按钮 - 右下角 */}
      <button 
        onClick={() => setShowUpload(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#0055FF] rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 hover:scale-110 hover:-translate-y-2 transition-all z-40"
      >
        <Camera size={26} className="text-white" />
      </button>

      {/* 上传浮窗 - 2/3高度，修复z-index */}
      {showUpload && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShowUpload(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 h-[66vh] bg-white rounded-t-[2rem] z-[9999] animate-in slide-in-from-bottom duration-300 overflow-y-auto">
            <div className="p-6">
              {/* 顶部标题 */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4">
                <h2 className="text-2xl font-black">📸 发布内容</h2>
                <button onClick={() => setShowUpload(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* 上传选项 - 只保留相册 */}
              <div className="mb-6">
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                  <span className="text-3xl">🖼️</span>
                  <span className="font-bold text-lg">选择照片</span>
                </button>
              </div>

              {/* 文字内容输入 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-700">分享你的故事</label>
                  <button className="text-xs font-bold text-[#0055FF] px-3 py-1 bg-blue-50 rounded-full">
                    ✨ AI润色 (即将上线)
                  </button>
                </div>
                <textarea 
                  placeholder="记录这一刻的美好..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-[#0055FF] transition-colors"
                ></textarea>
              </div>

              {/* 快捷标签 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">添加标签</h3>
                  <button className="text-xs font-bold text-purple-500 px-3 py-1 bg-purple-50 rounded-full">
                    🤖 AI推荐 (即将上线)
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['打卡', '美食', '风景', '建筑', '人像', '日落', '街拍', '旅行'].map(tag => (
                    <button key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold hover:bg-[#0055FF] hover:text-white transition-colors">
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 定位信息 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">位置信息</h3>
                <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-[#0055FF]" />
                    <span className="font-bold text-gray-600">添加位置</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>

              {/* 照片信息读取 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">照片信息</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">📍 拍摄地点</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📷 相机型号</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⚙️ 曝光参数</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🕐 拍摄时间</span>
                    <span className="font-bold">自动读取中...</span>
                  </div>
                </div>
              </div>

              {/* 图像美化 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3">图像美化</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['自动增强', '滤镜', '裁剪'].map(option => (
                    <button key={option} className="p-3 bg-gray-100 rounded-xl text-sm font-bold hover:bg-[#CCFF00] transition-colors">
                      {option}
                      <div className="text-xs text-gray-500 mt-1">即将上线</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 发布按钮 */}
              <button className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] text-white font-black text-lg rounded-2xl hover:shadow-xl transition-all">
                发布
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
