import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin, ChevronRight, Shuffle, Navigation, Globe, Map as MapIcon, ChevronDown } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'

// 国家数据（中国第一，其他按字母排序）
const COUNTRIES = [
  '中国',
  'Australia', 'Brazil', 'Canada', 'Denmark', 'Egypt', 'France', 'Germany', 
  'Iceland', 'Italy', 'Japan', 'Korea', 'Mexico', 'Norway', 'Russia', 
  'Spain', 'Thailand', 'UK', 'USA'
]

// 中国省份数据
const PROVINCES = [
  '北京', '上海', '天津', '重庆',
  '安徽', '福建', '甘肃', '广东', '广西', '贵州', '海南', '河北', '河南', 
  '黑龙江', '湖北', '湖南', '吉林', '江苏', '江西', '辽宁', '内蒙古', 
  '宁夏', '青海', '山东', '山西', '陕西', '四川', '西藏', '新疆', 
  '云南', '浙江'
]

// 城市数据（示例）
const CITIES = {
  '北京': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区'],
  '上海': ['黄浦区', '徐汇区', '长宁区', '静安区', '浦东新区'],
  '重庆': ['渝中区', '江北区', '南岸区', '渝北区', '九龙坡区']
}

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
    area: '东城区',
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
    area: '东城区',
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
    area: '渝中区',
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

type FilterType = 'random' | 'country' | 'province' | 'city' | 'area' | 'nearby'

export default function MapView() {
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null)
  const [filterType, setFilterType] = useState<FilterType>('random')
  const [filteredSpots, setFilteredSpots] = useState(SPOTS)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  // 获取用户位置
  useEffect(() => {
    if (filterType === 'nearby') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('定位失败:', error)
          alert('无法获取位置，请允许浏览器访问位置信息')
        }
      )
    }
  }, [filterType])

  const handleFilter = (type: FilterType) => {
    setFilterType(type)
    setShowDropdown(type !== 'random' && type !== 'nearby')
    
    if (type === 'random') {
      setFilteredSpots(SPOTS)
    } else if (type === 'nearby' && userLocation) {
      // 简单距离计算（实际应该用 Haversine 公式）
      const nearby = SPOTS.filter(spot => {
        const distance = Math.sqrt(
          Math.pow(spot.lat - userLocation.lat, 2) + 
          Math.pow(spot.lng - userLocation.lng, 2)
        )
        return distance < 1 // 约100km内
      })
      setFilteredSpots(nearby)
    }
  }

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
    setFilteredSpots(SPOTS.filter(s => s.country === country))
    setShowDropdown(false)
  }

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province)
    setFilteredSpots(SPOTS.filter(s => s.province === province))
    setShowDropdown(false)
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setFilteredSpots(SPOTS.filter(s => s.city === city))
    setShowDropdown(false)
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
        onClick={() => {
          setShowSidebar(false)
          setShowDropdown(false)
        }}
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
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'random' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
        >
          <Shuffle size={16} /> 随机
        </button>
        <button 
          onClick={() => handleFilter('nearby')}
          className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'nearby' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
        >
          <Navigation size={16} /> 同城
        </button>
        
        {/* 国家下拉 */}
        <div className="relative">
          <button 
            onClick={() => {
              handleFilter('country')
              setShowDropdown(!showDropdown)
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'country' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
          >
            <Globe size={16} /> {selectedCountry || '国家'} <ChevronDown size={14} />
          </button>
          
          {showDropdown && filterType === 'country' && (
            <div className="absolute top-12 left-0 w-48 max-h-96 overflow-y-auto bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-2">
              {COUNTRIES.map(country => (
                <button
                  key={country}
                  onClick={() => handleCountrySelect(country)}
                  className="w-full text-left px-4 py-2 hover:bg-[#0055FF]/10 rounded-lg font-medium text-sm"
                >
                  {country}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 省份下拉 */}
        <div className="relative">
          <button 
            onClick={() => {
              handleFilter('province')
              setShowDropdown(!showDropdown)
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'province' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
          >
            <MapIcon size={16} /> {selectedProvince || '省份'} <ChevronDown size={14} />
          </button>
          
          {showDropdown && filterType === 'province' && (
            <div className="absolute top-12 left-0 w-48 max-h-96 overflow-y-auto bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-2">
              {PROVINCES.map(province => (
                <button
                  key={province}
                  onClick={() => handleProvinceSelect(province)}
                  className="w-full text-left px-4 py-2 hover:bg-[#0055FF]/10 rounded-lg font-medium text-sm"
                >
                  {province}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 城市下拉 */}
        <div className="relative">
          <button 
            onClick={() => {
              handleFilter('city')
              setShowDropdown(!showDropdown)
            }}
            className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${filterType === 'city' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
          >
            <MapPin size={16} /> {selectedCity || '城市'} <ChevronDown size={14} />
          </button>
          
          {showDropdown && filterType === 'city' && (
            <div className="absolute top-12 left-0 w-48 max-h-96 overflow-y-auto bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl p-2">
              {Object.keys(CITIES).map(city => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-4 py-2 hover:bg-[#0055FF]/10 rounded-lg font-medium text-sm"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 右侧景点列表（二级页面，80%透明） */}
      <div 
        className={`absolute top-0 right-0 h-full w-full md:w-1/3 bg-white/80 backdrop-blur-xl shadow-2xl z-[1000] transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black">
              {filterType === 'random' && '随机推荐'}
              {filterType === 'nearby' && '同城景点'}
              {filterType === 'country' && (selectedCountry || '选择国家')}
              {filterType === 'province' && (selectedProvince || '选择省份')}
              {filterType === 'city' && (selectedCity || '选择城市')}
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
                className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group"
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
          className="absolute top-1/2 right-6 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center z-[1000] hover:scale-110 transition-transform"
        >
          <ChevronRight size={24} className="text-[#0055FF]" />
        </button>
      )}

      {/* 三级页面：景点详情（80%透明） */}
      {selectedSpot && selectedSpotData && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl z-[2000] overflow-y-auto">
          {/* 顶部图片 */}
          <div className="relative h-[40vh]">
            <img src={selectedSpotData.image} alt={selectedSpotData.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
            <section className="mb-8 bg-white/60 backdrop-blur-md p-6 rounded-2xl">
              <h2 className="text-2xl font-black mb-4">📍 景点介绍</h2>
              <p className="text-gray-700 leading-relaxed">{selectedSpotData.description}</p>
            </section>

            <section className="mb-8 bg-white/60 backdrop-blur-md p-6 rounded-2xl">
              <h2 className="text-2xl font-black mb-4">🍜 美食推荐</h2>
              <p className="text-gray-700">{selectedSpotData.food}</p>
            </section>

            <section className="mb-8 bg-white/60 backdrop-blur-md p-6 rounded-2xl">
              <h2 className="text-2xl font-black mb-4">⏰ 最佳打卡时间</h2>
              <p className="text-gray-700">{selectedSpotData.bestTime}</p>
            </section>

            <section className="mb-8 bg-white/60 backdrop-blur-md p-6 rounded-2xl">
              <h2 className="text-2xl font-black mb-4">📷 拍照攻略</h2>
              <p className="text-gray-700">{selectedSpotData.photoTips}</p>
            </section>

            <section className="bg-white/60 backdrop-blur-md p-6 rounded-2xl">
              <h2 className="text-2xl font-black mb-4">🌍 社区分享</h2>
              <p className="text-gray-500 text-sm">该区域的用户分享即将上线...</p>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
