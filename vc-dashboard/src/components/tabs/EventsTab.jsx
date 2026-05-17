import { useState } from 'react'
import { useRealtime } from '../../hooks/useRealtime'
import { supabase } from '../../lib/supabase'
import { format } from 'date-fns'
import { Plus, X, DollarSign, Calendar } from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'
import ErrorAlert from '../ui/ErrorAlert'

export default function EventsTab() {
  const { data: events, loading } = useRealtime('events')
  const [view, setView] = useState('list')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    catering: '',
    budget: '',
    status: 'Planning',
    notes: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.date) {
      setError('Event name and date are required')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      }

      if (editingId) {
        const { error: err } = await supabase.from('events').update(payload).eq('id', editingId)
        if (err) throw err
      } else {
        const { error: err } = await supabase.from('events').insert([payload])
        if (err) throw err
      }

      setFormData({
        name: '',
        date: '',
        time: '',
        venue: '',
        catering: '',
        budget: '',
        status: 'Planning',
        notes: '',
      })
      setShowForm(false)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (event) => {
    setFormData(event)
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this event?')) {
      await supabase.from('events').delete().eq('id', id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      date: '',
      time: '',
      venue: '',
      catering: '',
      budget: '',
      status: 'Planning',
      notes: '',
    })
  }

  const totalBudget = events.reduce((sum, e) => sum + (e.budget || 0), 0)
  const totalSpent = events.reduce((sum, e) => sum + (e.spent || 0), 0)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Events</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} />
          New Event
        </button>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Budget</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Spent</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Remaining</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">${(totalBudget - totalSpent).toLocaleString()}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('list')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            view === 'list'
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView('cards')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            view === 'cards'
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          Card View
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No events yet"
          description="Create your first event to get started"
          action={{ label: 'Create Event', onClick: () => setShowForm(true) }}
        />
      )}

      {/* Events List */}
      {events.length > 0 && (view === 'list' ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Venue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Budget</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{event.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{format(new Date(event.date), 'MMM d, yyyy')}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{event.venue}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                    {event.budget ? `$${event.budget.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                      event.status === 'Planning' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                      event.status === 'Completed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div key={event.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{event.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{format(new Date(event.date), 'MMM d, yyyy')}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                  event.status === 'Planning' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {event.status}
                </span>
              </div>
              {event.venue && <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{event.venue}</p>}
              {event.budget && (
                <div className="flex items-center gap-1 text-sm mb-3">
                  <DollarSign size={14} className="text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">${event.budget.toLocaleString()}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Event' : 'Create Event'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Event name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="catering"
                placeholder="Catering"
                value={formData.catering}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                name="budget"
                placeholder="Budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Planning</option>
                <option>Confirmed</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Saving...
                    </>
                  ) : (
                    editingId ? 'Update' : 'Create'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
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
  )
}
