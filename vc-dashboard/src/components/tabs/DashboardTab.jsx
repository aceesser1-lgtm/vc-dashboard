import { useRealtime } from '../../hooks/useRealtime'
import { format, isToday, isBefore, startOfDay, endOfDay } from 'date-fns'
import { Calendar, Clock, Users, CheckSquare, TrendingUp } from 'lucide-react'

export default function DashboardTab() {
  const { data: events, loading: eventsLoading } = useRealtime('events')
  const { data: teamMembers, loading: teamLoading } = useRealtime('team_members')
  const { data: tasks, loading: tasksLoading } = useRealtime('tasks')

  // Today's events
  const todaysEvents = events.filter(e => {
    const eventDate = new Date(e.date)
    return isToday(eventDate)
  }).sort((a, b) => (a.time || '').localeCompare(b.time || ''))

  // Upcoming events (next 7 days)
  const today = startOfDay(new Date())
  const nextWeek = endOfDay(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.date)
    return eventDate > today && eventDate <= nextWeek
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Team in office
  const inOffice = teamMembers.filter(t => t.location === 'In Office').length

  // Open tasks
  const openTasks = tasks.filter(t => t.status === 'Open').length

  if (eventsLoading || teamLoading || tasksLoading) {
    return <div className="p-6 text-gray-400">Loading...</div>
  }

  return (
    <div className="p-6 max-w-6xl">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">In Office Today</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inOffice}</p>
            </div>
            <Users size={24} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Open Tasks</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{openTasks}</p>
            </div>
            <CheckSquare size={24} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today's Events</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{todaysEvents.length}</p>
            </div>
            <Calendar size={24} className="text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next 7 Days</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{upcomingEvents.length}</p>
            </div>
            <TrendingUp size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Schedule</h2>
          {todaysEvents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No events today</p>
          ) : (
            <div className="space-y-3">
              {todaysEvents.map(event => (
                <div key={event.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-12 bg-indigo-500 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{event.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Clock size={12} />
                        {event.time || 'All day'}
                      </div>
                      {event.venue && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{event.venue}</p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                      event.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                      event.status === 'Planning' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Next 7 Days</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 flex-shrink-0">
                      {format(new Date(event.date), 'EEE').toUpperCase()}
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">{format(new Date(event.date), 'd')}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{event.name}</p>
                      {event.venue && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{event.venue}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
