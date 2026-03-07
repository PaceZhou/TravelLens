import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { MapPin, ChevronRight, Shuffle, Navigation, Globe, Map as MapIcon, ChevronDown, X, ChevronLeft } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
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
    ],
    likes: 8942,
    posts: 1230,
    checkins: 5678
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
    ],
    likes: 6543,
    posts: 890,
    checkins: 4321
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
    ],
    likes: 12340,
    posts: 2100,
    checkins: 8900
  }
]

const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32]
})

type FilterType = 'random' | 'country' | 'province' | 'city' | 'area' | 'nearby'
type DrawerType = 'food' | 'photo' | null

export default function MapView() {
  const { t } = useLanguage()
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
    setShowSidebar(true) // 自动打开二级界面
    
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
    setShowSidebar(true) // 自动打开二级界面
  }

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province)
    setFilteredSpots(SPOTS.filter(s => s.province === province))
    setShowDropdown(false)
    setShowSidebar(true) // 自动打开二级界面
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setFilteredSpots(SPOTS.filter(s => s.city === city))
    setShowDropdown(false)
    setShowSidebar(true) // 自动打开二级界面
  }

  const handleSpotClick = (spotId: number) => {
    setSelectedSpot(spotId)
    setCurrentImageIndex(0)
    setShowGallery(false)
    setDrawerType(null)
  }

  const selectedSpotData = SPOTS.find(s => s.id === selectedSpot)

  return (
    <div className="relative h-[calc(100vh-7rem)] md:h-screen w-full z-0">
      {/* 遮罩层 - 移动端点击收起侧栏 */}
      {showSidebar && (
        <div 
          className="fixed inset-0 z-[5] md:hidden"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* 地图主界面 - 始终显示，最低层级 */}
      <MapContainer 
        center={[39.916, 116.397]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
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

      {/* 顶部筛选菜单 - 移动端刘海式菜单 */}
      <div className="fixed top-14 left-0 right-0 md:absolute md:top-6 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 z-40 bg-white md:bg-transparent py-2 px-4 md:p-0 flex gap-2 justify-center md:justify-start shadow-sm md:shadow-none">
        <button 
          onClick={() => handleFilter('random')}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center min-h-[36px] ${filterType === 'random' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
        >
          {t.map.filters.random}
        </button>
        <button 
          onClick={() => handleFilter('nearby')}
          className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center min-h-[36px] ${filterType === 'nearby' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
        >
          {t.map.filters.nearby}
        </button>
        
        <div className="relative">
          <button 
            onClick={() => {
              handleFilter('country')
              setShowDropdown(!showDropdown)
            }}
            className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-1 min-h-[36px] transition-all ${filterType === 'country' ? 'bg-[#0055FF] text-white' : 'bg-white/90 backdrop-blur-md text-gray-700'} shadow-lg`}
          >
            {selectedCountry || t.map.filters.country} <ChevronDown size={12} />
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
            <MapIcon size={16} /> {selectedProvince || t.map.filters.province} <ChevronDown size={14} />
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
            <MapPin size={16} /> {selectedCity || t.map.filters.city} <ChevronDown size={14} />
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

      {/* 右侧景点列表（二级页面，1/3宽度，增强透明） */}
      {/* 侧栏 - 左右推拉式圆角框 */}
      <div 
        className={`fixed top-[calc(3.5rem+68px)] right-0 bottom-[calc(3.5rem+14px)] md:top-0 md:bottom-0 w-[calc(35%+120px)] md:w-1/3 bg-white/90 md:bg-white/50 backdrop-blur-3xl shadow-2xl z-10 md:z-[1000] transition-transform duration-300 rounded-l-3xl md:rounded-none md:border-l border-white/30 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
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

          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {filteredSpots.map(spot => (
              <div 
                key={spot.id}
                onClick={() => handleSpotClick(spot.id)}
                className="bg-white/60 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex md:flex-col"
              >
                <div className="relative overflow-hidden w-24 h-24 md:w-full md:h-40 flex-shrink-0">
                  <img src={spot.images[0]} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {/* 渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* 统计数据 - PC端显示 */}
                  <div className="absolute bottom-3 right-3 hidden md:flex gap-2">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xl border border-white/30 px-3 py-1.5 rounded-full">
                      <span className="text-[#FF6B9D] text-sm">❤</span>
                      <span className="text-white text-xs font-bold">{spot.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xl border border-white/30 px-3 py-1.5 rounded-full">
                      <span className="text-[#CCFF00] text-sm">✦</span>
                      <span className="text-white text-xs font-bold">{spot.posts}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xl border border-white/30 px-3 py-1.5 rounded-full">
                      <span className="text-[#00D4FF] text-sm">📍</span>
                      <span className="text-white text-xs font-bold">{spot.checkins}</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-center md:p-4">
                  <h3 className="font-black text-sm md:text-lg mb-1 group-hover:text-[#0055FF] transition-colors">{spot.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 flex items-center">
                    <MapPin size={14} className="mr-1 text-[#0055FF]" /> {spot.city}
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

      {/* 三级页面：景点详情（1/2宽度，右侧抽拉，增强透明） */}
      {selectedSpot && selectedSpotData && (
        <div 
          className={`absolute top-0 right-0 h-full w-full md:w-1/2 bg-white/50 backdrop-blur-3xl shadow-2xl z-[2000] overflow-y-auto transition-transform duration-300 border-l border-white/30 ${selectedSpot ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* 返回按钮 */}
          <button 
            onClick={() => {
              setSelectedSpot(null)
              setShowSidebar(true) // 返回时打开二级界面
            }}
            className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center z-10 hover:bg-white transition-colors shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>

          {/* 顶部固定图片 */}
          <div className="relative">
            <img 
              src={selectedSpotData.images[currentImageIndex]} 
              alt={selectedSpotData.name} 
              className="w-full h-64 object-cover"
            />
            
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-black mb-2">{selectedSpotData.name}</h1>
              <p className="flex items-center"><MapPin size={16} className="mr-1" /> {selectedSpotData.city}</p>
            </div>
          </div>

          {/* 内容区 */}
          <div className="p-6">
            {/* 景点介绍 */}
            <section className="mb-4 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">📍 {t.map.spotDetail.intro}</h2>
                {/* 统计数据 - 潮流胶囊 */}
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#FF6B9D]/20 to-[#FF6B9D]/10 px-3 py-1.5 rounded-full border border-[#FF6B9D]/30">
                    <span className="text-[#FF6B9D]">❤</span>
                    <span className="text-sm font-black text-gray-900">{selectedSpotData.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#CCFF00]/20 to-[#CCFF00]/10 px-3 py-1.5 rounded-full border border-[#CCFF00]/50">
                    <span className="text-gray-900">✦</span>
                    <span className="text-sm font-black text-gray-900">{selectedSpotData.posts}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#00D4FF]/20 to-[#00D4FF]/10 px-3 py-1.5 rounded-full border border-[#00D4FF]/30">
                    <span className="text-[#00D4FF]">📍</span>
                    <span className="text-sm font-black text-gray-900">{selectedSpotData.checkins}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4 text-base">{selectedSpotData.description}</p>
              <details className="text-gray-600 text-sm group">
                <summary className="cursor-pointer font-bold hover:text-[#0055FF] transition-colors">查看历史 →</summary>
                <p className="mt-3 leading-relaxed bg-gray-50/50 p-4 rounded-2xl">{selectedSpotData.history}</p>
              </details>
            </section>

            {/* 图库缩略图 */}
            <section className="mb-4 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg">
              <h2 className="text-2xl font-black mb-4 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">📷 {t.map.spotDetail.gallery}</h2>
              <div className="grid grid-cols-3 gap-3">
                {selectedSpotData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => {
                      setCurrentImageIndex(idx)
                      setShowGallery(true)
                    }}
                  >
                    <img
                      src={img}
                      alt={`${selectedSpotData.name} ${idx + 1}`}
                      className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-2xl">🔍</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 美食推荐（抽屉式） */}
            <section className="mb-4">
              <button
                onClick={() => setDrawerType(drawerType === 'food' ? null : 'food')}
                className="w-full bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl p-5 rounded-3xl flex items-center justify-between hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-orange-500/30 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🍜</span>
                  <h2 className="text-xl font-black text-gray-900">{t.map.spotDetail.foods}</h2>
                </div>
                <ChevronRight className={`transition-transform duration-300 text-orange-500 ${drawerType === 'food' ? 'rotate-90' : ''}`} size={24} />
              </button>
            </section>

            {/* 拍照攻略（抽屉式） */}
            <section className="mb-4">
              <button
                onClick={() => setDrawerType(drawerType === 'photo' ? null : 'photo')}
                className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-5 rounded-3xl flex items-center justify-between hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-purple-500/30 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📷</span>
                  <h2 className="text-xl font-black text-gray-900">{t.map.spotDetail.photoGuide}</h2>
                </div>
                <ChevronRight className={`transition-transform duration-300 text-purple-500 ${drawerType === 'photo' ? 'rotate-90' : ''}`} size={24} />
              </button>
            </section>

            {/* 社区分享（列表式加载） */}
            <section className="bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg">
              <h2 className="text-2xl font-black mb-4 bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">🌍 社区分享</h2>
              <p className="text-gray-500 text-sm">该区域的用户分享加载中...</p>
            </section>
          </div>
        </div>
      )}

      {/* 四级页面：图库浮窗（增强透明） */}
      {showGallery && selectedSpotData && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] max-h-[80vh] bg-white/40 backdrop-blur-3xl shadow-2xl z-[3000] overflow-y-auto rounded-[2rem] animate-in zoom-in-95 duration-300 border border-white/40">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#0055FF] to-[#00D4FF] bg-clip-text text-transparent">📷 {t.map.spotDetail.gallery}</h2>
              <button onClick={() => setShowGallery(false)} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* 大图预览 */}
            <div className="mb-6 relative group">
              <img 
                src={selectedSpotData.images[currentImageIndex]} 
                alt={selectedSpotData.name}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* 缩略图列表 */}
            <div className="grid grid-cols-4 gap-4">
              {selectedSpotData.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${idx === currentImageIndex ? 'ring-4 ring-[#0055FF] scale-105' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img
                    src={img}
                    alt={`${selectedSpotData.name} ${idx + 1}`}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 四级页面：美食详情（浮窗式，增强透明） */}
      {drawerType === 'food' && selectedSpotData && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[70vh] bg-white/40 backdrop-blur-3xl shadow-2xl z-[3000] overflow-y-auto rounded-[2rem] animate-in zoom-in-95 duration-300 border border-white/40">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">🍜 {t.map.spotDetail.foods}</h2>
              <button onClick={() => setDrawerType(null)} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {selectedSpotData.foods.map((food, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img src={food.image} alt={food.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-xl mb-3 text-gray-900">{food.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{food.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 四级页面：拍照攻略（浮窗式，增强透明） */}
      {drawerType === 'photo' && selectedSpotData && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[70vh] bg-white/40 backdrop-blur-3xl shadow-2xl z-[3000] overflow-y-auto rounded-[2rem] animate-in zoom-in-95 duration-300 border border-white/40">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">📷 {t.map.spotDetail.photoGuide}</h2>
              <button onClick={() => setDrawerType(null)} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {selectedSpotData.photoGuides.map((guide, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                  <h3 className="font-black text-xl mb-4 text-gray-900">{guide.title}</h3>
                  <p className="text-gray-700 mb-4 leading-relaxed">{guide.desc}</p>
                  <div className="bg-gradient-to-r from-[#CCFF00]/30 to-[#CCFF00]/10 p-4 rounded-xl border border-[#CCFF00]/50">
                    <p className="text-sm font-bold text-gray-900">💡 {guide.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 浮窗背景遮罩 */}
      {(drawerType || showGallery) && (
        <div 
          className="fixed inset-0 bg-black/20 z-[2999]"
          onClick={() => {
            setDrawerType(null)
            setShowGallery(false)
          }}
        ></div>
      )}
    </div>
  )
}
