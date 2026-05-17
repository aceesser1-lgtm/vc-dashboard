export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-5 right-5 space-y-2 z-40 pointer-events-none">
      {toasts.map(toast => (
        <button
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`block w-full px-4 py-3 rounded-lg text-sm font-medium pointer-events-auto transition-all ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : toast.type === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-gray-900 text-white'
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}
