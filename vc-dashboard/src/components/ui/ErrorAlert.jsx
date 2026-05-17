import { AlertCircle, X } from 'lucide-react'
import { useState } from 'react'

export default function ErrorAlert({ message, onClose }) {
  const [visible, setVisible] = useState(true)

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  if (!visible) return null

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle size={18} className="text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-900 dark:text-red-200">
          {message}
        </p>
      </div>
      <button
        onClick={handleClose}
        className="text-red-400 hover:text-red-600 dark:hover:text-red-300 flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  )
}
