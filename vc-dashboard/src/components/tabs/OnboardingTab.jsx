import { useState } from 'react'
import { useRealtime } from '../../hooks/useRealtime'
import { supabase } from '../../lib/supabase'
import { format } from 'date-fns'
import { Plus, X, Check, ChevronDown, ChevronUp } from 'lucide-react'

export default function OnboardingTab() {
  const { data: checklist } = useRealtime('onboarding_checklist')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedHire, setExpandedHire] = useState(null)
  const [formData, setFormData] = useState({
    hire_name: '',
    hire_role: '',
    hire_start_date: '',
    task: '',
    assigned_to: '',
    completed: false,
    deadline: '',
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await supabase.from('onboarding_checklist').update(formData).eq('id', editingId)
    } else {
      await supabase.from('onboarding_checklist').insert([formData])
    }

    resetForm()
  }

  const handleToggleComplete = async (id, completed) => {
    await supabase.from('onboarding_checklist').update({ completed: !completed }).eq('id', id)
  }

  const handleEdit = (task) => {
    setFormData(task)
    setEditingId(task.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this task?')) {
      await supabase.from('onboarding_checklist').delete().eq('id', id)
    }
  }

  const resetForm = () => {
    setFormData({
      hire_name: '',
      hire_role: '',
      hire_start_date: '',
      task: '',
      assigned_to: '',
      completed: false,
      deadline: '',
    })
    setShowForm(false)
    setEditingId(null)
  }

  // Group tasks by hire
  const hireGroups = {}
  checklist.forEach(task => {
    if (!hireGroups[task.hire_name]) {
      hireGroups[task.hire_name] = {
        hire_name: task.hire_name,
        hire_role: task.hire_role,
        hire_start_date: task.hire_start_date,
        tasks: [],
      }
    }
    hireGroups[task.hire_name].tasks.push(task)
  })

  const hires = Object.values(hireGroups).sort((a, b) => {
    if (a.hire_start_date && b.hire_start_date) {
      return new Date(b.hire_start_date) - new Date(a.hire_start_date)
    }
    return 0
  })

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Onboarding</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Hires List */}
      <div className="space-y-4">
        {hires.map(hire => {
          const completedCount = hire.tasks.filter(t => t.completed).length
          const totalCount = hire.tasks.length
          const progressPercent = totalCount ? (completedCount / totalCount) * 100 : 0
          const isExpanded = expandedHire === hire.hire_name

          return (
            <div key={hire.hire_name} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedHire(isExpanded ? null : hire.hire_name)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{hire.hire_name}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {hire.hire_role && (
                      <span>{hire.hire_role}</span>
                    )}
                    {hire.hire_start_date && (
                      <span>Start: {format(new Date(hire.hire_start_date), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Progress */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {completedCount}/{totalCount}
                    </p>
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </button>

              {/* Expanded Checklist */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {hire.tasks.map(task => (
                      <div key={task.id} className="px-6 py-3 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleComplete(task.id, task.completed)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <Check size={14} className="text-white" />}
                        </button>

                        {/* Task Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            task.completed
                              ? 'text-gray-500 dark:text-gray-400 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {task.task}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {task.assigned_to && (
                              <span className="bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                                {task.assigned_to}
                              </span>
                            )}
                            {task.deadline && (
                              <span>{format(new Date(task.deadline), 'MMM d')}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium px-2 py-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium px-2 py-1"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {hires.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No onboarding tasks yet</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Task' : 'Add Onboarding Task'}
              </h2>
              <button onClick={() => resetForm()} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Hire Section */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">New Hire Info</p>
                <input
                  type="text"
                  name="hire_name"
                  placeholder="Hire name"
                  value={formData.hire_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <input
                  type="text"
                  name="hire_role"
                  placeholder="Role"
                  value={formData.hire_role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <input
                  type="date"
                  name="hire_start_date"
                  value={formData.hire_start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Task Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Task Details</p>
                <textarea
                  name="task"
                  placeholder="Task description"
                  value={formData.task}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3 resize-none"
                />
                <input
                  type="text"
                  name="assigned_to"
                  placeholder="Assigned to (person name)"
                  value={formData.assigned_to}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={formData.completed}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mark as completed</span>
                </label>
              </div>

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
