import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react'

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ type, message, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle size={24} className="text-green-500" />,
    error: <XCircle size={24} className="text-red-500" />,
    info: <Info size={24} className="text-blue-500" />,
    warning: <AlertCircle size={24} className="text-yellow-500" />
  }

  const bgColors = {
    success: 'from-green-50 to-emerald-50',
    error: 'from-red-50 to-rose-50',
    info: 'from-blue-50 to-cyan-50',
    warning: 'from-yellow-50 to-amber-50'
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[10000] animate-in slide-in-from-top duration-300">
      <div className={`bg-gradient-to-r ${bgColors[type]} backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6 min-w-[300px]`}>
        <div className="flex items-center gap-4">
          {icons[type]}
          <span className="text-lg font-bold text-gray-800">{message}</span>
        </div>
      </div>
    </div>
  )
}
