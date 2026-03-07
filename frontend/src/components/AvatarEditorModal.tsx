import { useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { X, Upload } from 'lucide-react'

interface AvatarEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (avatarData: string) => void
}

// 系统头像列表
const SYSTEM_AVATARS = Array.from({ length: 9 }, (_, i) => `/avatars/mango_traveller_${i + 1}.png`)

// 滤镜预设
const FILTERS = [
  { name: '原图', class: '' },
  { name: '黑白', class: 'grayscale' },
  { name: '复古', class: 'sepia' },
  { name: '小清新', class: 'brightness-110 contrast-110' }
]

// 背景色预设
const BG_COLORS = ['#FFB800', '#00D4AA', '#0055FF', '#FF6B6B', '#A855F7', '#10B981']

// 装饰标签
const BADGES = ['VIP', 'Press', '✈️', '📷', '🎨']

/**
 * 高级头像编辑器
 * 支持系统头像、上传、背景色、缩放、位置、装饰
 */
export default function AvatarEditorModal({ isOpen, onClose, onSave }: AvatarEditorModalProps) {
  const [mode, setMode] = useState<'system' | 'upload'>('system')
  const [image, setImage] = useState<string | File>(SYSTEM_AVATARS[0])
  const [bgColor, setBgColor] = useState('#FFB800')
  const [scale, setScale] = useState(1.5)
  const [positionX, setPositionX] = useState(0.5)
  const [positionY, setPositionY] = useState(0.5)
  const [selectedFilter, setSelectedFilter] = useState(0)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const editorRef = useRef<AvatarEditor>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      setMode('upload')
    }
  }

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas()
      const ctx = canvas.getContext('2d')
      
      // 添加装饰标签
      if (selectedBadge && ctx) {
        ctx.font = 'bold 20px Arial'
        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 3
        ctx.textAlign = 'center'
        ctx.strokeText(selectedBadge, canvas.width / 2, canvas.height - 20)
        ctx.fillText(selectedBadge, canvas.width / 2, canvas.height - 20)
      }
      
      const dataUrl = canvas.toDataURL()
      onSave(dataUrl)
      onClose()
    }
  }

  return (
    <>
      {/* 遮罩层 */}
      <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={onClose}></div>
      
      {/* 弹窗 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-[10000] w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">编辑头像</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* 模式切换 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('system')}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mode === 'system' ? 'bg-[#FFB800] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            系统头像
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mode === 'upload' ? 'bg-[#FFB800] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Upload size={16} className="inline mr-1" />
            上传图片
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 左侧：预览区 */}
          <div>
            <label className="text-sm font-medium mb-2 block">实时预览</label>
            <div className="flex justify-center">
              <div 
                className={`rounded-full p-4 ${FILTERS[selectedFilter].class}`}
                style={{ backgroundColor: bgColor }}
              >
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={180}
                  height={180}
                  border={0}
                  borderRadius={90}
                  color={[255, 255, 255, 0]}
                  scale={scale}
                  position={{ x: positionX, y: positionY }}
                  rotate={0}
                />
              </div>
            </div>
          </div>

          {/* 右侧：控制面板 */}
          <div className="space-y-4">
            {/* 系统头像选择 */}
            {mode === 'system' && (
              <div>
                <label className="text-sm font-medium mb-2 block">选择头像</label>
                <div className="grid grid-cols-5 gap-2">
                  {SYSTEM_AVATARS.map((avatar, i) => (
                    <button
                      key={i}
                      onClick={() => setImage(avatar)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 ${
                        image === avatar ? 'border-[#FFB800]' : 'border-gray-200'
                      }`}
                    >
                      <img src={avatar} alt={`芒果${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 背景颜色 */}
            <div>
              <label className="text-sm font-medium mb-2 block">背景颜色</label>
              <div className="flex gap-2">
                {BG_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      bgColor === color ? 'border-gray-800' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </div>
            </div>

            {/* 大小 */}
            <div>
              <label className="text-sm font-medium mb-2 block">大小 ({scale.toFixed(1)}x)</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 位置X */}
            <div>
              <label className="text-sm font-medium mb-2 block">水平位置</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={positionX}
                onChange={(e) => setPositionX(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 位置Y */}
            <div>
              <label className="text-sm font-medium mb-2 block">垂直位置</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={positionY}
                onChange={(e) => setPositionY(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 滤镜 */}
            <div>
              <label className="text-sm font-medium mb-2 block">滤镜</label>
              <div className="grid grid-cols-4 gap-2">
                {FILTERS.map((filter, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFilter(i)}
                    className={`py-1 rounded text-xs font-medium ${
                      selectedFilter === i ? 'bg-[#FFB800] text-white' : 'bg-gray-100'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 装饰标签 */}
            <div>
              <label className="text-sm font-medium mb-2 block">装饰标签</label>
              <div className="flex gap-2">
                {BADGES.map(badge => (
                  <button
                    key={badge}
                    onClick={() => setSelectedBadge(selectedBadge === badge ? null : badge)}
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      selectedBadge === badge ? 'bg-[#FFB800] text-white' : 'bg-gray-100'
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-full font-medium"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-gradient-to-r from-[#FFB800] to-[#00D4AA] text-white rounded-full font-bold"
          >
            确认保存
          </button>
        </div>
      </div>
    </>
  )
}
