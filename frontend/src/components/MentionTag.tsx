import { X } from 'lucide-react'

interface MentionTagProps {
  username: string
  onRemove: () => void
}

/**
 * @用户名块组件
 * 不可编辑，按退格键整个删除
 */
export default function MentionTag({ username, onRemove }: MentionTagProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-100 text-[#0055FF] px-2 py-0.5 rounded text-sm font-medium">
      @{username}
      <button
        onClick={onRemove}
        className="hover:bg-blue-200 rounded-full p-0.5"
      >
        <X size={12} />
      </button>
    </span>
  )
}
