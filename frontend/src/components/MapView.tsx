import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin, ChevronRight, Shuffle, Navigation, Globe, Map as MapIcon } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'

// 景点数据
const SPOTS = [
  { 
    id: 1, 
    name: '故宫角楼', 
    lat: 39.916, 
    lng: 116.397, 
    city: '北京',
    province: '北京',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=400',
    description: '西北角楼是故宫最佳拍摄机位，日落时分金色余晖洒在红墙黄瓦上。',
    food: '全聚德烤鸭、护国寺小吃',
    bestTime: '日落前1小时（17:00-18:30）',
    photoTips: '使用长焦镜头压缩空间，等待游客较少的时刻。'
  },
  { 
    id: 2, 
    name: '天坛公园', 
    lat: 39.883, 
    lng: 116.407, 
    city: '北京',
    province: '北京',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=400',
    description: '明清两代皇帝祭天的场所，建筑对称美学的典范。',
    food: '老北京炸酱面、豆汁焦圈',
    bestTime: '清晨6:00-8:00',
    photoTips: '从南门进入，拍摄祈年殿的对称构图。'
  },
  { 
    id: 3, 
    name: '洪崖洞', 
    lat: 29.563, 
    lng: 106.583, 
    city: '重庆',
    province: '重庆',
    country: '中国',
    image: 'https://images.unsplash.com/photo-1558281050-8cbbeafc6007?auto=format&fit=crop&q=80&w=400',
    description: '重庆版赛博朋克，夜景绝美的吊脚楼建筑群。',
    food: '洞子老火锅、重庆小面',
    bestTime: '夜晚19:00-21:00',
    photoTips: '对岸千厮门大桥拍摄全景，雨后倒影效果更佳。'
  }
]

const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32]
})

export default function MapView() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<'random' | 'country' | 'province' | 'city' | 'area' | 'nearby'>('random')
  const [filteredSpots, setFilteredSpots] = useState(SPOTS)

  const handleFilter = (type: typeof filterType) => {
    setFilterType(type)
    // 这里可以根据类型筛选景点
    setFilteredSpots(SPOTS)
  }

  const handleSpotClick = (spotId: number) => {
    setSelectedSpot(spotId)
  }

  const selectedSpotData = SPOTS.find(s => s.id === selectedSpot)

  return (
    <div className="relative h-screen w-full">
      {/* 地图主界面 */}
      <MapContainer 
        center={[39.916, 116.397]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        onClick={() => setShowSidebar(false)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        {filteredSpots.map(spot => (
          <Marker 
            key={spot.id} 
            position={[spot.lat, spot.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => handleSpotClick(spot.id)
            }}
          >
            <Popup>
              <div className="text-center">
                <strong>{spot.name}</strong><br/>
                {spot.city}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 顶部筛选菜单 */}
      <div className="absolute top-6 left-6 z-[1000] flex gap-2">
        <button 
          onClick={() => handleFilter('random')}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'random' ? 'bg-[#0055FF] text-white' : 'bg-white text-gray-700'} shadow-lg`}
        >
          <Shuffle size={16} /> 随机
        </button>
        <button 
          onClick={() => handleFilter('nearby')}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'nearby' ? 'bg-[#0055FF] text-white' : 'bg-white text-gray-700'} shadow-lg`}
        >
          <Navigation size={16} /> 同城
        </button>
        <button 
          onClick={() => handleFilter('country')}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'country' ? 'bg-[#0055FF] text-white' : 'bg-white text-gray-700'} shadow-lg`}
        >
          <Globe size={16} /> 国家
        </button>
        <button 
          onClick={() => handleFilter('province')}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'province' ? 'bg-[#0055FF] text-white' : 'bg-white text-gray-700'} shadow-lg`}
        >
          <MapIcon size={16} /> 省份
        </button>
        <button 
          onClick={() => handleFilter('city')}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'city' ? 'bg-[#0055FF] text-white' : 'bg-white text-gray-700'} shadow-lg`}
        >
          <MapPin size={16} /> 城市
        </button>
      </div>

      {/* 右侧景点列表（二级页面，1/3宽度） */}
      <div 
        className={`absolute top-0 right-0 h-full w-full md:w-1/3 bg-white shadow-2xl z-[1000] transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black">
              {filterType === 'random' && '随机推荐'}
              {filterType === 'nearby' && '同城景点'}
              {filterType === 'country' && '按国家'}
              {filterType === 'province' && '按省份'}
              {filterType === 'city' && '按城市'}
            </h2>
            <button 
              onClick={() => setShowSidebar(false)}
              className="text-gray-500 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {filteredSpots.map(spot => (
              <div 
                key={spot.id}
                onClick={() => handleSpotClick(spot.id)}
                className="bg-gray-50 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
              >
                <img src={spot.image} alt={spot.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-4">
                  <h3 className="font-black text-lg mb-1">{spot.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin size={14} className="mr-1" /> {spot.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 展开侧边栏按钮 */}
      {!showSidebar && (
        <button 
          onClick={() => setShowSidebar(true)}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center z-[1000] hover:scale-110 transition-transform"
        >
          <ChevronRight size={24} className="text-[#0055FF]" />
        </button>
      )}

      {/* 三级页面：景点详情（全屏覆盖） */}
      {selectedSpot && selectedSpotData && (
        <div className="absolute inset-0 bg-white z-[2000] overflow-y-auto">
          {/* 顶部图片 */}
          <div className="relative h-[40vh]">
            <img src={selectedSpotData.image} alt={selectedSpotData.name} className="w-full h-full object-cover" />
            <button 
              onClick={() => setSelectedSpot(null)}
              className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              ←
            </button>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-black mb-2">{selectedSpotData.name}</h1>
              <p className="flex items-center"><MapPin size={16} className="mr-1" /> {selectedSpotData.city}</p>
            </div>
          </div>

          {/* 内容区 */}
          <div className="p-6 max-w-4xl mx-auto">
            {/* 景点介绍 */}
            <section className="mb-8">
              <h2 className="text-2xl font-black mb-4">📍 景点介绍</h2>
              <p className="text-gray-700 leading-relaxed">{selectedSpotData.description}</p>
            </section>

            {/* 美食推荐 */}
            <section className="mb-8">
              <h2 className="text-2xl font-black mb-4">🍜 美食推荐</h2>
              <p className="text-gray-700">{selectedSpotData.food}</p>
            </section>

            {/* 最佳时间 */}
            <section className="mb-8">
              <h2 className="text-2xl font-black mb-4">⏰ 最佳打卡时间</h2>
              <p className="text-gray-700">{selectedSpotData.bestTime}</p>
            </section>

            {/* 拍照攻略 */}
            <section className="mb-8">
              <h2 className="text-2xl font-black mb-4">📷 拍照攻略</h2>
              <p className="text-gray-700">{selectedSpotData.photoTips}</p>
            </section>

            {/* 相关社区内容 */}
            <section>
              <h2 className="text-2xl font-black mb-4">🌍 社区分享</h2>
              <p className="text-gray-500 text-sm">该区域的用户分享即将上线...</p>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
