import { X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const colors = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-[#FFB800] hover:bg-[#FF9500]',
    info: 'bg-[#0055FF] hover:bg-[#0044DD]'
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-black">{title}</h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed">{message}</p>
        </div>
        
        <div className="p-6 border-t flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-6 text-white rounded-2xl font-bold transition-colors ${colors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
