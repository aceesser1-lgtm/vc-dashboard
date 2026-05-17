import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRealtime } from '../../hooks/useRealtime'
import { useGoogleAuth } from '../../hooks/useGoogleAuth'
import { Mail, Search, Archive, CheckSquare, Plus, X, Loader, LogIn } from 'lucide-react'

export default function EmailTab() {
  const { token: googleToken, signIn: connectGmail } = useGoogleAuth()
  const { data: tasks } = useRealtime('tasks')
  const [emails, setEmails] = useState([])
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState(null)
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    due_date: '',
  })

  // Fetch emails from Gmail or use mock data
  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true)
      setError(null)

      // If no Google token, use mock data
      if (!googleToken) {
        const mockEmails = [
          {
            id: '1',
            from: 'sarah.chen@vcfirm.com',
            subject: 'Q2 LP Update Meeting',
            preview: 'Hi team, let\'s schedule the Q2 LP update meeting for next month...',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true,
            body: 'Hi team, let\'s schedule the Q2 LP update meeting for next month. I\'ll send out the deck by EOD Friday. Please prepare your portfolio updates.',
          },
          {
            id: '2',
            from: 'marcus.w@vcfirm.com',
            subject: 'Portfolio company check-in',
            preview: 'Quick update on Q2 performance. Most companies tracking well...',
            date: new Date(Date.now() - 4 * 60 * 60 * 1000),
            read: false,
            body: 'Quick update on Q2 performance. Most companies tracking well against plan. A few need attention on hiring. Will discuss in standup.',
          },
          {
            id: '3',
            from: 'priya.patel@vcfirm.com',
            subject: 'Board meeting preparation',
            preview: 'Board materials ready for review. Can you check the metrics section?...',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            read: true,
            body: 'Board materials ready for review. Can you check the metrics section? I added the new KPIs we discussed. Let me know if anything needs adjustment.',
          },
          {
            id: '4',
            from: 'james.o@vcfirm.com',
            subject: 'New portfolio company onboarding',
            preview: 'Excited to share the new onboarding plan for the Series A company...',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            read: false,
            body: 'Excited to share the new onboarding plan for the Series A company. First 90 days focuses on hiring and product roadmap clarity. Full plan attached.',
          },
          {
            id: '5',
            from: 'emily.t@vcfirm.com',
            subject: 'Budget planning for next quarter',
            preview: 'Next quarter budget proposals are in. Need approval by end of week...',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            read: true,
            body: 'Next quarter budget proposals are in. Need approval by end of week. All departmental budgets attached in the spreadsheet.',
          },
        ]
        setEmails(mockEmails)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/gmail/list', {
          headers: {
            'Authorization': `Bearer ${googleToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch emails')
        }

        const data = await response.json()
        // Ensure dates are parsed as Date objects
        const processedEmails = data.map(email => ({
          ...email,
          date: new Date(email.date),
        }))
        setEmails(processedEmails)
      } catch (err) {
        console.error('Error fetching emails:', err)
        setError('Failed to load emails. Using sample data.')
        // Fallback to mock data on error
        const mockEmails = [
          {
            id: '1',
            from: 'sample@example.com',
            subject: 'Sample email - connect your Google account for real emails',
            preview: 'Click "Sign in with Google" to see your real Gmail inbox...',
            date: new Date(),
            read: true,
            body: 'Sign in with your Google account to see your real Gmail inbox here.',
          },
        ]
        setEmails(mockEmails)
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [googleToken])

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEmailAction = async (action) => {
    if (!selectedEmail || !googleToken) return

    setActionLoading(action)
    try {
      const response = await fetch('/api/gmail/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          messageId: selectedEmail.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action}`)
      }

      // Update local state
      if (action === 'markRead') {
        setEmails(emails.map(e =>
          e.id === selectedEmail.id ? { ...e, read: true } : e
        ))
        setSelectedEmail({ ...selectedEmail, read: true })
      } else if (action === 'archive') {
        setEmails(emails.filter(e => e.id !== selectedEmail.id))
        setSelectedEmail(null)
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err)
      setError(`Failed to ${action} email`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    const newTask = {
      title: taskFormData.title || selectedEmail?.subject,
      description: taskFormData.description || `Follow up on: ${selectedEmail?.subject}`,
      status: 'Open',
      priority: taskFormData.priority,
      due_date: taskFormData.due_date,
      assigned_to: null,
      source: 'email',
    }
    await supabase.from('tasks').insert([newTask])
    setShowTaskForm(false)
    setTaskFormData({
      title: '',
      description: '',
      priority: 'Medium',
      due_date: '',
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTaskFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="p-6 h-full flex gap-6 max-w-7xl">
      {/* Email List */}
      <div className="w-96 flex flex-col border-r border-gray-200 dark:border-gray-700">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Connect Gmail or Search */}
        {!googleToken ? (
          <button
            onClick={connectGmail}
            className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            <LogIn size={16} />
            Connect Gmail
          </button>
        ) : (
          <div className="mb-4 flex-shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Email Items */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size={20} className="animate-spin text-indigo-600" />
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">No emails found</p>
            </div>
          ) : (
            filteredEmails.map(email => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full px-3 py-2.5 text-left rounded-lg transition-colors ${
                selectedEmail?.id === email.id
                  ? 'bg-indigo-100 dark:bg-indigo-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {!email.read && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    email.read
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white font-semibold'
                  }`}>
                    {email.from.split('@')[0]}
                  </p>
                  <p className={`text-xs mt-0.5 truncate ${
                    email.read
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(email.date)}
                  </p>
                </div>
              </div>
            </button>
            ))
          )}
        </div>
      </div>

      {/* Email Reader */}
      {selectedEmail ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEmail.subject}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  From: {selectedEmail.from}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(selectedEmail.date)}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto py-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {selectedEmail.body}
            </p>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <button
              onClick={() => handleEmailAction('markRead')}
              disabled={actionLoading === 'markRead' || !googleToken}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'markRead' ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <CheckSquare size={16} />
              )}
              Mark Read
            </button>
            <button
              onClick={() => handleEmailAction('archive')}
              disabled={actionLoading === 'archive' || !googleToken}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'archive' ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Archive size={16} />
              )}
              Archive
            </button>
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={16} />
              Create Task
            </button>
          </div>

          {/* Task Form Modal */}
          {showTaskForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create Task from Email
                  </h2>
                  <button
                    onClick={() => setShowTaskForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Task title (defaults to email subject)"
                    value={taskFormData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    name="description"
                    placeholder="Task description (defaults to follow up)"
                    value={taskFormData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <select
                    name="priority"
                    value={taskFormData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <input
                    type="date"
                    name="due_date"
                    value={taskFormData.due_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                    >
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <p className="text-sm">Select an email to read</p>
        </div>
      )}
    </div>
  )
}
