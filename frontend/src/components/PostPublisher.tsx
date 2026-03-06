import { useState, useEffect } from 'react'
import { X, Camera, Hash, ImageIcon } from 'lucide-react'
import CoverSelector from './CoverSelector'
import { tagsAPI } from '../api/tags'
import { postsAPI } from '../api/posts'

interface PostPublisherProps {
  isOpen: boolean
  onClose: () => void
  onPublishSuccess: () => void
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
  currentCity: string
  editPost?: any
}

export default function PostPublisher({ isOpen, onClose, onPublishSuccess, showToast, currentCity, editPost }: PostPublisherProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [postContent, setPostContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [showCoverSelector, setShowCoverSelector] = useState(false)
  const [coverIndex, setCoverIndex] = useState(0)
  const [allTags, setAllTags] = useState<any[]>([])

  const defaultTags = ['克莱因蓝', '极简', '日系', '城市漫游', '自然', '建筑', '人文', '美食', '夜景', '胶片']

  // 加载所有标签
  useEffect(() => {
    tagsAPI.getAll().then(tags => {
      if (tags.length > 0) {
        setAllTags(tags)
      } else {
        // 如果没有标签，使用默认标签
        setAllTags(defaultTags.map(name => ({ id: name, name, count: 0 })))
      }
    }).catch(() => {
      setAllTags(defaultTags.map(name => ({ id: name, name, count: 0 })))
    })
  }, [])

  // 当editPost变化时，更新表单数据
  useEffect(() => {
    if (editPost) {
      setUploadedImages(editPost.images || [])
      setPostContent(editPost.content || '')
      setSelectedTags(editPost.tags || [])
      setCoverIndex(editPost.coverIndex || 0)
    } else {
      setUploadedImages([])
      setPostContent('')
      setSelectedTags([])
      setCoverIndex(0)
    }
  }, [editPost])

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

  const addCustomTag = () => {
    if (!customTag.trim()) return
    
    // 清理标签：移除所有#号和特殊符号，只保留中文、英文、数字
    let cleanTag = customTag.trim().replace(/[#＃]/g, '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
    
    if (cleanTag && !selectedTags.includes(cleanTag)) {
      setSelectedTags(prev => [...prev, cleanTag])
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
      
      if (editPost) {
        // 编辑模式：更新帖子
        await postsAPI.update(editPost.id, {
          content: postContent,
          images: uploadedImages,
          coverIndex: coverIndex,
          tags: selectedTags,
        })
        showToast('更新成功！', 'success')
      } else {
        // 新建模式：创建帖子
        await postsAPI.create(userId, {
          content: postContent,
          images: uploadedImages,
          coverIndex: coverIndex,
          tags: selectedTags,
          location: '未知位置',
          city: currentCity === '全部' ? '北京' : currentCity,
        })
        showToast('发布成功！', 'success')
      }
      
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
          <h3 className="text-2xl font-black">{editPost ? '编辑帖子' : '发布新帖'}</h3>
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
              {allTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.name)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedTags.includes(tag.name)
                      ? 'bg-[#0055FF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag.name} <span className="text-xs opacity-70">({tag.count})</span>
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
            onClick={handlePublish}
            className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-2xl font-black text-lg hover:shadow-lg transition-all"
          >
            发布
          </button>
        </div>
      </div>

      {/* 封面选择器 */}
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
