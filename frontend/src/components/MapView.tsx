import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'

// Mock 景点数据
const spots = [
  { id: 1, name: '故宫博物院', lat: 39.916, lng: 116.397, distance: '2.1km' },
  { id: 2, name: '天坛公园', lat: 39.883, lng: 116.407, distance: '4.5km' },
  { id: 3, name: '颐和园', lat: 39.999, lng: 116.275, distance: '12.8km' }
]

// 自定义图标
const customIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32]
})

export default function MapView() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[39.916, 116.397]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        {spots.map(spot => (
          <Marker 
            key={spot.id} 
            position={[spot.lat, spot.lng]}
            icon={customIcon}
          >
            <Popup>
              <strong>{spot.name}</strong><br/>
              距离: {spot.distance}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
