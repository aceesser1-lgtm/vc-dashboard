import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'
import ChatSidebar from '../components/layout/ChatSidebar'
import Toast from '../components/ui/Toast'
import DashboardTab from '../components/tabs/DashboardTab'
import EmailTab from '../components/tabs/EmailTab'
import EventsTab from '../components/tabs/EventsTab'
import OfficeTab from '../components/tabs/OfficeTab'
import TeamTab from '../components/tabs/TeamTab'
import OnboardingTab from '../components/tabs/OnboardingTab'
import { useToast } from '../hooks/useToast'
import { MessageSquare } from 'lucide-react'

const TAB_COMPONENTS = {
  dashboard: DashboardTab,
  email: EmailTab,
  events: EventsTab,
  office: OfficeTab,
  team: TeamTab,
  onboarding: OnboardingTab,
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [chatOpen, setChatOpen] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') ?? 'light')
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  const ActiveTab = TAB_COMPONENTS[activeTab]

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <ActiveTab />
        </main>

        {/* Chat sidebar */}
        <ChatSidebar
          activeTab={activeTab}
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
        />
      </div>

      {/* Chat toggle button (when closed) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-5 right-5 w-11 h-11 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors z-40"
        >
          <MessageSquare size={18} />
        </button>
      )}

      {/* Toast notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
