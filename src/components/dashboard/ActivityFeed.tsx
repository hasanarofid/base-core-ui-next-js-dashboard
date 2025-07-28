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

export default function ActivityFeed({ activities, title = "Aktivitas Terbaru" }: ActivityFeedProps) {
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
    <div className="activity-feed">
      <h3 className="card-title mb-4">{title}</h3>
      <div className="space-y-0">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-avatar">
              {getInitials(activity.user)}
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="activity-time">{activity.time}</p>
            </div>
            <div className="text-lg">
              {getActivityIcon(activity.type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 