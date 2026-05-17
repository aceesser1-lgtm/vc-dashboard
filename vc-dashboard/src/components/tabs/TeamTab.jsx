import { useState } from 'react'
import { useRealtime } from '../../hooks/useRealtime'
import { supabase } from '../../lib/supabase'
import { Plus, X, MapPin, Mail, Phone, User } from 'lucide-react'

const LOCATIONS = ['In Office', 'Remote', 'Traveling', 'OOO']

export default function TeamTab() {
  const { data: teamMembers } = useRealtime('team_members')
  const [locationFilter, setLocationFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: 'In Office',
    status: 'Active',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await supabase.from('team_members').update(formData).eq('id', editingId)
    } else {
      await supabase.from('team_members').insert([formData])
    }

    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      location: 'In Office',
      status: 'Active',
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (member) => {
    setFormData(member)
    setEditingId(member.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Remove this team member?')) {
      await supabase.from('team_members').delete().eq('id', id)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      location: 'In Office',
      status: 'Active',
    })
  }

  const handleQuickStatusUpdate = async (memberId, newLocation) => {
    await supabase.from('team_members').update({ location: newLocation }).eq('id', memberId)
  }

  const filteredMembers = locationFilter === 'All'
    ? teamMembers
    : teamMembers.filter(m => m.location === locationFilter)

  const inOfficeCount = teamMembers.filter(m => m.location === 'In Office').length

  const getLocationBadgeColor = (location) => {
    switch (location) {
      case 'In Office': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
      case 'Remote': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
      case 'Traveling': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
      case 'OOO': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Team</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Office Occupancy</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">{inOfficeCount}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">of {teamMembers.length} in office</p>
          </div>
          <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${teamMembers.length ? (inOfficeCount / teamMembers.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Location Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', ...LOCATIONS].map(loc => (
          <button
            key={loc}
            onClick={() => setLocationFilter(loc)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              locationFilter === loc
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map(member => (
          <div key={member.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{member.name}</h3>
                {member.role && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{member.role}</p>
                )}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${getLocationBadgeColor(member.location)}`}>
                {member.location}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
              {member.email && (
                <div className="flex items-center gap-2 truncate">
                  <Mail size={14} className="flex-shrink-0" />
                  <a href={`mailto:${member.email}`} className="truncate hover:underline">{member.email}</a>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-2 truncate">
                  <Phone size={14} className="flex-shrink-0" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>

            {/* Status Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => handleQuickStatusUpdate(member.id, 'In Office')}
                className={`text-xs py-1.5 rounded font-medium transition-colors ${
                  member.location === 'In Office'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                In Office
              </button>
              <button
                onClick={() => handleQuickStatusUpdate(member.id, 'Remote')}
                className={`text-xs py-1.5 rounded font-medium transition-colors ${
                  member.location === 'Remote'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Remote
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="flex-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <User size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No team members found</p>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Edit Member' : 'Add Team Member'}
              </h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="role"
                placeholder="Role (e.g., Partner, Associate)"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  {editingId ? 'Update' : 'Add'}
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
