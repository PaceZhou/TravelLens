import { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface AvatarSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatar: string) => void
  currentAvatar?: string
}

const PRESET_AVATARS = [
  '🥭', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🌸', '🌺', '🌻', '🌷', '🌹', '🏵️', '🌴', '🌲',
  '⭐', '🌟', '✨', '💫', '🌙', '☀️', '🌈', '☁️'
]

export default function AvatarSelector({ isOpen, onClose, onSelect, currentAvatar }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '')

  if (!isOpen) return null

  const handleSelect = () => {
    onSelect(selectedAvatar)
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black">选择头像</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-8 gap-3 mb-6">
          {PRESET_AVATARS.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAvatar(emoji)}
              className={`text-4xl p-3 rounded-2xl transition-all hover:scale-110 ${
                selectedAvatar === emoji ? 'bg-[#0055FF] shadow-lg' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          onClick={handleSelect}
          disabled={!selectedAvatar}
          className="w-full py-4 bg-gradient-to-r from-[#0055FF] to-[#00D4AA] text-white rounded-2xl font-black text-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          确认选择
        </button>
      </div>
    </div>
  )
}
