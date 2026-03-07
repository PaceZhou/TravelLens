import { useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { X, Upload } from 'lucide-react'

interface AvatarEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (avatarData: string) => void
}

// 滤镜预设
const FILTERS = [
  { name: '原图', class: '' },
  { name: '黑白', class: 'grayscale' },
  { name: '复古', class: 'sepia' },
  { name: '小清新', class: 'brightness-110 contrast-110' }
]

/**
 * 高级头像编辑器
 * 支持上传、拖拽、缩放、滤镜
 */
export default function AvatarEditorModal({ isOpen, onClose, onSave }: AvatarEditorModalProps) {
  const [image, setImage] = useState<File | null>(null)
  const [scale, setScale] = useState(1.5)
  const [selectedFilter, setSelectedFilter] = useState(0)
  const editorRef = useRef<AvatarEditor>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas()
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-[10000] w-[90%] max-w-md">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">编辑头像</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* 上传区域 */}
        {!image ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-[#FFB800] transition-colors"
          >
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">点击上传图片</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <>
            {/* 编辑器预览 */}
            <div className="flex justify-center mb-4">
              <div className={FILTERS[selectedFilter].class}>
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={200}
                  height={200}
                  border={20}
                  borderRadius={100}
                  color={[255, 255, 255, 0.6]}
                  scale={scale}
                  rotate={0}
                />
              </div>
            </div>

            {/* 缩放滑块 */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-2 block">大小调整</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 滤镜选择 */}
            <div className="mb-6">
              <label className="text-sm text-gray-600 mb-2 block">滤镜效果</label>
              <div className="grid grid-cols-4 gap-2">
                {FILTERS.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFilter(index)}
                    className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedFilter === index
                        ? 'bg-[#FFB800] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setImage(null)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200"
              >
                重新上传
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-gradient-to-r from-[#FFB800] to-[#00D4AA] text-white rounded-full font-bold"
              >
                确认保存
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
