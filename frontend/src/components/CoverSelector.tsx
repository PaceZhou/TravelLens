import { X, Check } from 'lucide-react'
import { useState } from 'react'

interface CoverSelectorProps {
  isOpen: boolean
  images: string[]
  currentCoverIndex: number
  onConfirm: (newCoverIndex: number, newOrder: string[]) => void
  onCancel: () => void
}

export default function CoverSelector({ isOpen, images, currentCoverIndex, onConfirm, onCancel }: CoverSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(currentCoverIndex)
  const [orderedImages, setOrderedImages] = useState(images)

  if (!isOpen) return null

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'))
    const newImages = [...orderedImages]
    const [removed] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, removed)
    setOrderedImages(newImages)
    if (selectedIndex === dragIndex) {
      setSelectedIndex(dropIndex)
    }
  }

  const handleImageDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-black">选择封面图片</h3>
          <button onClick={onCancel} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-500 text-sm mb-4">点击选择封面，拖拽可调整顺序</p>
          <div className="grid grid-cols-3 gap-4">
            {orderedImages.map((img, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${
                  selectedIndex === idx ? 'border-[#0055FF] shadow-lg' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover"
                  draggable={false}
                  onDragStart={handleImageDragStart}
                />
                {selectedIndex === idx && (
                  <>
                    <div className="absolute inset-0 bg-[#0055FF]/20 flex items-center justify-center">
                      <div className="w-12 h-12 bg-[#0055FF] rounded-full flex items-center justify-center">
                        <Check size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-[#FFB800] text-white text-xs px-3 py-1 rounded-full font-bold">
                      封面
                    </div>
                  </>
                )}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200">
            取消
          </button>
          <button
            onClick={() => onConfirm(selectedIndex, orderedImages)}
            className="flex-1 py-3 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-2xl font-bold hover:shadow-lg"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
