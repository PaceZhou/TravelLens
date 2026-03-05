import { useState } from 'react'
import { Heart, Clock, MapPin, Hash, Camera } from 'lucide-react'

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Vivid_01',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    location: '重庆 · 洪崖洞',
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
    image: 'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800',
    content: '终于拍到了江之电！建议大家不要在十字路口扎堆，往前走200米的坡道上人少很多。',
    tags: ['胶片', '日系', '看海'],
    likes: 1540,
    time: '5小时前'
  }
]

const keywords = ['全部', '克莱因蓝', '极简', '日系', '城市漫游', '自然']

export default function Community() {
  const [feedSort, setFeedSort] = useState('latest')
  const [activeKeyword, setActiveKeyword] = useState('全部')

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
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-fit">
            <button 
              onClick={() => setFeedSort('latest')} 
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'latest' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              最新情报
            </button>
            <button 
              onClick={() => setFeedSort('hot')} 
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${feedSort === 'hot' ? 'bg-[#0055FF] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              热门风向
            </button>
          </div>
        </div>

        {/* 关键词滚动栏 */}
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {keywords.map(kw => (
            <button 
              key={kw}
              onClick={() => setActiveKeyword(kw)}
              className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-bold transition-all flex items-center ${activeKeyword === kw ? 'border-[#0055FF] bg-[#0055FF]/5 text-[#0055FF]' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
            >
              {kw !== '全部' && <Hash size={14} className="mr-1 opacity-50" />}
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* 瀑布流 */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {COMMUNITY_POSTS.map(post => (
          <div key={post.id} className="break-inside-avoid bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[2rem] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,85,255,0.08)] transition-all duration-300 group cursor-pointer">
            {/* 图片 */}
            <div className="relative p-2 pb-0">
              <div className="relative rounded-[1.5rem] overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center text-xs font-black text-gray-900 shadow-sm">
                  <MapPin size={12} className="mr-1 text-[#0055FF]" /> {post.location}
                </div>
              </div>
            </div>
            
            {/* 内容 */}
            <div className="p-6">
              <p className="text-gray-900 text-base leading-relaxed mb-4 font-bold">
                {post.content}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span key={tag} className="text-[#0055FF] bg-blue-50 px-2 py-1 rounded-md text-xs font-bold">#{tag}</span>
                ))}
              </div>
              
              {/* 底部信息 */}
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
      
      {/* 悬浮发布按钮 */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-[#0055FF] rounded-full flex items-center justify-center shadow-xl shadow-blue-500/40 hover:scale-110 hover:-translate-y-2 transition-all z-40">
        <Camera size={26} className="text-white" />
      </button>
    </div>
  )
}
