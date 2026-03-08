import { useState, useEffect } from 'react'
import { X, Camera, ImageIcon } from 'lucide-react'
import CoverSelector from './CoverSelector'
import { tagsAPI } from '../api/tags'
import { postsAPI } from '../api/posts'

interface MobilePostEditorProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  post: any
}

export default function MobilePostEditor({ isOpen, onClose, onSuccess, showToast, post }: MobilePostEditorProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [postContent, setPostContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showCoverSelector, setShowCoverSelector] = useState(false)
  const [coverIndex, setCoverIndex] = useState(0)
  const [hotTags, setHotTags] = useState<any[]>([])

  useEffect(() => {
    tagsAPI.getAll().then(tags => {
      setHotTags(tags.slice(0, 10))
    })
  }, [])

  useEffect(() => {
    if (post) {
      setUploadedImages(post.images || [])
      setPostContent(post.content || '')
      setSelectedTags(post.tags || [])
      setCoverIndex(post.coverIndex || 0)
    }
  }, [post])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    if (uploadedImages.length + files.length > 9) {
      showToast('最多上传9张图片', 'warning')
      return
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages(prev => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

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
    const newImages = [...uploadedImages]
    const [removed] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, removed)
    setUploadedImages(newImages)
    if (coverIndex === dragIndex) {
      setCoverIndex(dropIndex)
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleUpdate = async () => {
    if (!postContent.trim() && uploadedImages.length === 0) {
      showToast('请输入内容或上传图片', 'warning')
      return
    }

    try {
      await postsAPI.update(post.id, {
        content: postContent,
        images: uploadedImages,
        coverIndex: coverIndex,
        tags: selectedTags,
      })
      showToast('更新成功！', 'success')
      onClose()
      onSuccess()
    } catch (error) {
      showToast('更新失败', 'error')
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <h3 className="text-2xl font-black">编辑帖子</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="记录这一刻的美好..."
              className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-[#0055FF] transition-colors"
              style={{ fontSize: '16px' }}
            ></textarea>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-gray-700">🔥 热门标签</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {hotTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    selectedTags.includes(tag.name)
                      ? 'bg-[#0055FF] text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera size={20} className="text-gray-400" />
              <span className="font-bold text-gray-700">上传图片 (最多9张)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {uploadedImages.map((img, idx) => (
                <div 
                  key={idx} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  onClick={() => setCoverIndex(idx)}
                  className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={img} 
                    alt="" 
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {coverIndex === idx && (
                    <div className="absolute top-2 left-2 bg-[#FFB800] text-white text-xs px-2 py-1 rounded-full font-bold">
                      封面
                    </div>
                  )}
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
              {uploadedImages.length < 9 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#0055FF] hover:bg-blue-50 transition-colors">
                  <Camera size={32} className="text-gray-400" />
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
            {uploadedImages.length > 1 && (
              <button
                onClick={() => setShowCoverSelector(true)}
                className="mt-3 w-full py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <ImageIcon size={18} />
                更改封面和顺序
              </button>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6">
          <button
            onClick={handleUpdate}
            className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-2xl font-black text-lg hover:shadow-lg transition-all"
          >
            更新
          </button>
        </div>
      </div>

      <CoverSelector
        isOpen={showCoverSelector}
        images={uploadedImages}
        currentCoverIndex={coverIndex}
        onConfirm={(newCoverIndex, newOrder) => {
          setUploadedImages(newOrder)
          setCoverIndex(newCoverIndex)
          setShowCoverSelector(false)
          showToast('封面已更新', 'success')
        }}
        onCancel={() => setShowCoverSelector(false)}
      />
    </div>
  )
}
