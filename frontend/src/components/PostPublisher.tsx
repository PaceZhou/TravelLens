import { useState } from 'react'
import { X, Camera, Hash } from 'lucide-react'
import { postsAPI } from '../api/posts'

interface PostPublisherProps {
  isOpen: boolean
  onClose: () => void
  onPublishSuccess: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  currentCity: string
  editPost?: any
}

const PRESET_TAGS = ['克莱因蓝', '极简', '日系', '城市漫游', '自然', '建筑', '人文', '美食', '夜景', '胶片']

export default function PostPublisher({ isOpen, onClose, onPublishSuccess, showToast, currentCity, editPost }: PostPublisherProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(editPost?.images || [])
  const [postContent, setPostContent] = useState(editPost?.content || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(editPost?.tags || [])
  const [customTag, setCustomTag] = useState('')

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()])
      setCustomTag('')
    }
  }

  const handlePublish = async () => {
    if (!postContent.trim() && uploadedImages.length === 0) {
      showToast('请输入内容或上传图片', 'warning')
      return
    }

    try {
      const savedUser = localStorage.getItem('user')
      const userId = savedUser ? JSON.parse(savedUser).id : ''
      
      await postsAPI.create(userId, {
        content: postContent,
        images: uploadedImages,
        tags: selectedTags,
        location: '未知位置',
        city: currentCity === '全部' ? '北京' : currentCity,
      })
      
      showToast('发布成功！', 'success')
      setUploadedImages([])
      setPostContent('')
      setSelectedTags([])
      onClose()
      onPublishSuccess()
    } catch (error) {
      showToast('发布失败', 'error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-6 flex items-center justify-between z-10">
          <h3 className="text-2xl font-black">发布新帖</h3>
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
            ></textarea>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Hash size={20} className="text-gray-400" />
              <span className="font-bold text-gray-700">选择标签</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-[#0055FF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                placeholder="自定义标签..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-[#0055FF]"
              />
              <button onClick={addCustomTag} className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800">
                添加
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera size={20} className="text-gray-400" />
              <span className="font-bold text-gray-700">上传图片 (最多9张)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
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
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6">
          <button
            onClick={handlePublish}
            className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-2xl font-black text-lg hover:shadow-lg transition-all"
          >
            发布
          </button>
        </div>
      </div>
    </div>
  )
}
