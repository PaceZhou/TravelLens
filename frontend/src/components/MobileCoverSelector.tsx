import { X, Check } from 'lucide-react'
import { useState } from 'react'

interface MobileCoverSelectorProps {
  isOpen: boolean
  images: string[]
  currentCoverIndex: number
  onConfirm: (newCoverIndex: number, newOrder: string[]) => void
  onCancel: () => void
}

export default function MobileCoverSelector({ isOpen, images, currentCoverIndex, onConfirm, onCancel }: MobileCoverSelectorProps) {
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

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div 
        className="fixed inset-0" 
        onClick={onCancel}
      ></div>
      
      <div className="bg-white w-full rounded-t-3xl shadow-2xl z-60 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-black">选择封面</h3>
          <button onClick={onCancel} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-gray-500 text-sm mb-3">点击选择封面，长按拖动调整顺序</p>
          <div className="grid grid-cols-3 gap-2">
            {orderedImages.map((img, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedIndex === idx ? 'border-[#0055FF]' : 'border-transparent'
                }`}
              >
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {selectedIndex === idx && (
                  <>
                    <div className="absolute inset-0 bg-[#0055FF]/20 flex items-center justify-center">
                      <div className="w-10 h-10 bg-[#0055FF] rounded-full flex items-center justify-center">
                        <Check size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute top-1 right-1 bg-[#FFB800] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      封面
                    </div>
                  </>
                )}
                <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t flex gap-2">
          <button 
            onClick={onCancel} 
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(selectedIndex, orderedImages)}
            className="flex-1 py-3 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-xl font-bold"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
