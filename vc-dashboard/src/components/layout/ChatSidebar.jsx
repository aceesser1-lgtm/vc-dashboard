import { useState } from 'react'
import { Send, Bot, X, MessageSquare } from 'lucide-react'

const STARTER_MESSAGES = [
  { id: 1, role: 'assistant', text: "Hi! I'm your office assistant. I can help you manage events, track tasks, and answer questions about your team. (AI responses coming soon)." },
]

export default function ChatSidebar({ activeTab, isOpen, onClose }) {
  const [messages, setMessages] = useState(STARTER_MESSAGES)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text: input }
    const replyMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      text: `I received your message about "${input}". AI responses will be available once the Claude API is connected.`,
    }
    setMessages(prev => [...prev, userMsg, replyMsg])
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <aside className="w-72 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
            <Bot size={13} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={15} />
        </button>
      </div>

      {/* Context badge */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Context: <span className="font-medium capitalize text-gray-700 dark:text-gray-300">{activeTab}</span>
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 resize-none px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
