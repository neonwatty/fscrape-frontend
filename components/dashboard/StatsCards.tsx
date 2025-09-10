import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDatabase } from '@/lib/db/database-context'
import { Activity, Database, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getPosts } from '@/lib/db/queries'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const { summary, isInitialized } = useDatabase()
  const [last24HoursPosts, setLast24HoursPosts] = useState(0)
  const [topScore, setTopScore] = useState(0)

  useEffect(() => {
    if (isInitialized) {
      // Get posts from last 24 hours
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      const recentPosts = getPosts({ 
        dateFrom: dayAgo,
        sortBy: 'score',
        sortOrder: 'desc',
        limit: 100
      })
      setLast24HoursPosts(recentPosts.length)
      
      // Get top score
      if (recentPosts.length > 0) {
        setTopScore(recentPosts[0]?.score || 0)
      }
    }
  }, [isInitialized])

  const stats = [
    {
      title: 'Total Posts',
      value: summary?.totalPosts?.toLocaleString() || '0',
      description: 'Across all platforms',
      icon: <Database className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Total Authors',
      value: summary?.totalAuthors?.toLocaleString() || '0',
      description: 'Unique contributors',
      icon: <Users className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Last 24 Hours',
      value: last24HoursPosts.toLocaleString(),
      description: 'New posts collected',
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: 'Top Score',
      value: topScore.toLocaleString(),
      description: 'Highest rated post',
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}
