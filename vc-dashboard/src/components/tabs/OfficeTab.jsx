import { useState } from 'react'
import { useRealtime } from '../../hooks/useRealtime'
import { supabase } from '../../lib/supabase'
import { Plus, X, AlertCircle } from 'lucide-react'

const TYPES = ['Supply', 'Vendor', 'Maintenance']
const STATUSES = {
  'Supply': ['OK', 'Low Stock', 'Out of Stock'],
  'Vendor': ['Active', 'Scheduled', 'Overdue'],
  'Maintenance': ['Active', 'Scheduled', 'Overdue'],
}

export default function OfficeTab() {
  const { data: operations } = useRealtime('office_operations')
  const [typeFilter, setTypeFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    type: 'Supply',
    item: '',
    status: 'OK',
    vendor: '',
    next_service: '',
    priority: 'Medium',
    quantity: '',
    notes: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (e) => {
    const newType = e.target.value
    setFormData(prev => ({
      ...prev,
      type: newType,
      status: STATUSES[newType][0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...formData,
      quantity: formData.quantity ? parseInt(formData.quantity) : null,
    }

    if (editingId) {
      await supabase.from('office_operations').update(payload).eq('id', editingId)
    } else {
      await supabase.from('office_operations').insert([payload])
    }

    resetForm()
  }

  const handleEdit = (op) => {
    setFormData(op)
    setEditingId(op.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this item?')) {
      await supabase.from('office_operations').delete().eq('id', id)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'Supply',
      item: '',
      status: 'OK',
      vendor: '',
      next_service: '',
      priority: 'Medium',
      quantity: '',
      notes: '',
    })
    setShowForm(false)
    setEditingId(null)
  }

  const filteredOps = typeFilter === 'All'
    ? operations
    : operations.filter(op => op.type === typeFilter)

  const lowStockItems = operations.filter(op => op.type === 'Supply' && op.status === 'Low Stock')
  const overdueItems = operations.filter(op =>
    (op.type === 'Vendor' || op.type === 'Maintenance') && op.status === 'Overdue'
  )

  const getStatusColor = (type, status) => {
    if (type === 'Supply') {
      switch (status) {
        case 'OK': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
        case 'Low Stock': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
        case 'Out of Stock': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
      }
    } else {
      switch (status) {
        case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
        case 'Scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
        case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
      }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 dark:text-red-400'
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'Low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Office</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} />
          New Item
        </button>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || overdueItems.length > 0) && (
        <div className="space-y-2 mb-6">
          {lowStockItems.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-200 text-sm">
                  {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} low on stock
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
                  {lowStockItems.map(i => i.item).join(', ')}
                </p>
              </div>
            </div>
          )}
          {overdueItems.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-200 text-sm">
                  {overdueItems.length} overdue item{overdueItems.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-red-800 dark:text-red-300 mt-1">
                  {overdueItems.map(i => i.item).join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Type Filter */}
      <div className="flex gap-2 mb-6">
        {['All', ...TYPES].map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === type
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOps.map(op => (
          <div key={op.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{op.item}</h3>
                  {op.priority && (
                    <span className={`text-xs font-bold ${getPriorityColor(op.priority)}`}>
                      {op.priority}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{op.type}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${getStatusColor(op.type, op.status)}`}>
                {op.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
              {op.vendor && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Vendor:</span> {op.vendor}
                </div>
              )}
              {op.quantity && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Qty:</span> {op.quantity}
                </div>
              )}
              {op.next_service && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Next Service:</span> {op.next_service}
                </div>
              )}
              {op.notes && (
                <div className="text-gray-700 dark:text-gray-300 italic">{op.notes}</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleEdit(op)}
                className="flex-1 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(op.id)}
                className="flex-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOps.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No items found</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Item' : 'Add Office Item'}
              </h2>
              <button onClick={() => resetForm()} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {TYPES.map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <input
                type="text"
                name="item"
                placeholder="Item name"
                value={formData.item}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {STATUSES[formData.type].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {formData.type === 'Supply' && (
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              <input
                type="text"
                name="vendor"
                placeholder="Vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {(formData.type === 'Vendor' || formData.type === 'Maintenance') && (
                <input
                  type="date"
                  name="next_service"
                  value={formData.next_service}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <textarea
                name="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => resetForm()}
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
