import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin, ChevronRight, Shuffle, Navigation, Globe, Map as MapIcon, ChevronDown, X, ChevronLeft } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'

// 国家数据
const COUNTRIES = [
  '中国',
  'Australia', 'Brazil', 'Canada', 'Denmark', 'Egypt', 'France', 'Germany', 
  'Iceland', 'Italy', 'Japan', 'Korea', 'Mexico', 'Norway', 'Russia', 
  'Spain', 'Thailand', 'UK', 'USA'
]

// 省份数据
const PROVINCES = [
  '北京', '上海', '天津', '重庆',
  '安徽', '福建', '甘肃', '广东', '广西', '贵州', '海南', '河北', '河南', 
  '黑龙江', '湖北', '湖南', '吉林', '江苏', '江西', '辽宁', '内蒙古', 
  '宁夏', '青海', '山东', '山西', '陕西', '四川', '西藏', '新疆', 
  '云南', '浙江'
]

// 城市数据
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
    images: [
      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=800'
    ],
    description: '西北角楼是故宫最佳拍摄机位，日落时分金色余晖洒在红墙黄瓦上。',
    history: '故宫角楼建于明永乐十八年（1420年），是紫禁城四个角楼之一。角楼结构精巧，造型独特，是中国古代建筑的杰作。',
    foods: [
      { name: '全聚德烤鸭', desc: '北京最著名的烤鸭店，皮酥肉嫩', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=400' },
      { name: '护国寺小吃', desc: '老北京传统小吃集合', image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=400' }
    ],
    bestTime: '日落前1小时（17:00-18:30）',
    photoGuides: [
      { title: '角楼倒影', desc: '在护城河对岸拍摄，等待无风时刻捕捉完美倒影', tip: '使用偏振镜减少水面反光' },
      { title: '日落剪影', desc: '逆光拍摄角楼轮廓，营造神秘氛围', tip: '曝光补偿-1.5EV' }
    ]
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
    images: [
      'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?auto=format&fit=crop&q=80&w=800'
    ],
    description: '明清两代皇帝祭天的场所，建筑对称美学的典范。',
    history: '天坛始建于明永乐十八年（1420年），是明清两代皇帝祭天祈谷的场所。',
    foods: [
      { name: '老北京炸酱面', desc: '地道北京味道', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=400' }
    ],
    bestTime: '清晨6:00-8:00',
    photoGuides: [
      { title: '祈年殿对称', desc: '从南门进入拍摄对称构图', tip: '使用广角镜头' }
    ]
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
    images: [
      'https://images.unsplash.com/photo-1558281050-8cbbeafc6007?auto=format&fit=crop&q=80&w=800'
    ],
    description: '重庆版赛博朋克，夜景绝美的吊脚楼建筑群。',
    history: '洪崖洞原为重庆古城门之一，现已改造为特色商业街区。',
    foods: [
      { name: '洞子老火锅', desc: '正宗重庆火锅', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400' }
    ],
    bestTime: '夜晚19:00-21:00',
    photoGuides: [
      { title: '对岸全景', desc: '千厮门大桥拍摄全景', tip: '三脚架长曝光' }
    ]
  }
]

const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32]
})

type FilterType = 'random' | 'country' | 'province' | 'city' | 'area' | 'nearby'
type DrawerType = 'food' | 'photo' | null

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [drawerType, setDrawerType] = useState<DrawerType>(null)

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
      const nearby = SPOTS.filter(spot => {
        const distance = Math.sqrt(
          Math.pow(spot.lat - userLocation.lat, 2) + 
          Math.pow(spot.lng - userLocation.lng, 2)
        )
        return distance < 1
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
    setCurrentImageIndex(0)
    setShowGallery(false)
    setDrawerType(null)
  }

  const selectedSpotData = SPOTS.find(s => s.id === selectedSpot)

  return (
    <div className="relative h-screen w-full">
      {/* 地图主界面 - 始终显示 */}
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

      {/* 右侧景点列表（二级页面，1/3宽度） */}
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
                <img src={spot.images[0]} alt={spot.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
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
      {!showSidebar && !selectedSpot && (
        <button 
          onClick={() => setShowSidebar(true)}
          className="absolute top-1/2 right-6 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center z-[1000] hover:scale-110 transition-transform"
        >
          <ChevronRight size={24} className="text-[#0055FF]" />
        </button>
      )}

      {/* 三级页面：景点详情（1/2宽度，右侧抽拉） */}
      {selectedSpot && selectedSpotData && (
        <div 
          className={`absolute top-0 right-0 h-full w-full md:w-1/2 bg-white/80 backdrop-blur-xl shadow-2xl z-[2000] overflow-y-auto transition-transform duration-300 ${selectedSpot ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* 返回按钮 */}
          <button 
            onClick={() => setSelectedSpot(null)}
            className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center z-10 hover:bg-white transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {/* 图库（开合式） */}
          <div className="relative">
            <img 
              src={selectedSpotData.images[currentImageIndex]} 
              alt={selectedSpotData.name} 
              className="w-full h-64 object-cover cursor-pointer"
              onClick={() => setShowGallery(!showGallery)}
            />
            
            {showGallery && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {selectedSpotData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${selectedSpotData.name} ${idx + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${idx === currentImageIndex ? 'ring-2 ring-[#CCFF00]' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-black mb-2">{selectedSpotData.name}</h1>
              <p className="flex items-center"><MapPin size={16} className="mr-1" /> {selectedSpotData.city}</p>
            </div>
          </div>

          {/* 内容区 */}
          <div className="p-6">
            {/* 景点介绍（展开式） */}
            <section className="mb-4 bg-white/60 backdrop-blur-md p-6 rounded-2xl">
              <h2 className="text-xl font-black mb-3">📍 景点介绍</h2>
              <p className="text-gray-700 leading-relaxed mb-3">{selectedSpotData.description}</p>
              <details className="text-gray-600 text-sm">
                <summary className="cursor-pointer font-bold">查看历史</summary>
                <p className="mt-2 leading-relaxed">{selectedSpotData.history}</p>
              </details>
            </section>

            {/* 美食推荐（抽屉式） */}
            <section className="mb-4">
              <button
                onClick={() => setDrawerType(drawerType === 'food' ? null : 'food')}
                className="w-full bg-white/60 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between hover:bg-white/80 transition-colors"
              >
                <h2 className="text-xl font-black">🍜 美食推荐</h2>
                <ChevronRight className={`transition-transform ${drawerType === 'food' ? 'rotate-90' : ''}`} />
              </button>
            </section>

            {/* 拍照攻略（抽屉式） */}
            <section className="mb-4">
              <button
                onClick={() => setDrawerType(drawerType === 'photo' ? null : 'photo')}
                className="w-full bg-white/60 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between hover:bg-white/80 transition-colors"
              >
                <h2 className="text-xl font-black">📷 拍照攻略</h2>
                <ChevronRight className={`transition-transform ${drawerType === 'photo' ? 'rotate-90' : ''}`} />
              </button>
            </section>

            {/* 社区分享（列表式加载） */}
            <section className="bg-white/60 backdrop-blur-md p-6 rounded-2xl">
              <h2 className="text-xl font-black mb-4">🌍 社区分享</h2>
              <p className="text-gray-500 text-sm">该区域的用户分享加载中...</p>
            </section>
          </div>
        </div>
      )}

      {/* 四级页面：美食详情（浮窗式） */}
      {drawerType === 'food' && selectedSpotData && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[70vh] bg-white/90 backdrop-blur-xl shadow-2xl z-[3000] overflow-y-auto rounded-3xl animate-in zoom-in-95 duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">🍜 美食推荐</h2>
              <button onClick={() => setDrawerType(null)} className="text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedSpotData.foods.map((food, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden">
                  <img src={food.image} alt={food.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-black text-lg mb-2">{food.name}</h3>
                    <p className="text-gray-600">{food.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 四级页面：拍照攻略（浮窗式） */}
      {drawerType === 'photo' && selectedSpotData && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[70vh] bg-white/90 backdrop-blur-xl shadow-2xl z-[3000] overflow-y-auto rounded-3xl animate-in zoom-in-95 duration-300">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">📷 拍照攻略</h2>
              <button onClick={() => setDrawerType(null)} className="text-gray-500 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedSpotData.photoGuides.map((guide, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-md rounded-2xl p-6">
                  <h3 className="font-black text-lg mb-3">{guide.title}</h3>
                  <p className="text-gray-700 mb-3">{guide.desc}</p>
                  <div className="bg-[#CCFF00]/20 p-3 rounded-xl">
                    <p className="text-sm font-bold">💡 {guide.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 浮窗背景遮罩 */}
      {drawerType && (
        <div 
          className="fixed inset-0 bg-black/20 z-[2999]"
          onClick={() => setDrawerType(null)}
        ></div>
      )}
    </div>
  )
}
