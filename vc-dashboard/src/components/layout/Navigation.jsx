import { LayoutDashboard, Mail, Calendar, Building2, Users, UserPlus } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'office', label: 'Office', icon: Building2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'onboarding', label: 'Onboarding', icon: UserPlus },
]

export default function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-end px-6 shrink-0">
      <div className="flex gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
