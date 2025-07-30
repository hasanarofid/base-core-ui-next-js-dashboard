interface Activity {
  id: number
  user: string
  action: string
  time: string
  type?: 'order' | 'payment' | 'profile' | 'message'
}

interface ActivityFeedProps {
  activities: Activity[]
  title?: string
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type?: string) => {
    switch (type) {
      case 'order':
        return '🛒'
      case 'payment':
        return '💳'
      case 'profile':
        return '👤'
      case 'message':
        return '💬'
      default:
        return '📝'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-blue-3 to-brand-blue-4 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(activity.user)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              <span className="font-medium">{activity.user}</span> {activity.action}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
          </div>
          <div className="flex-shrink-0 text-lg">
            {getActivityIcon(activity.type)}
          </div>
        </div>
      ))}
    </div>
  )
} 