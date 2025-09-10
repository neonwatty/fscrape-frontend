import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  // Placeholder data - will be replaced with real data from database
  const stats = [
    {
      title: 'Total Posts',
      value: '0',
      description: 'Across all platforms',
    },
    {
      title: 'Active Platforms',
      value: '0',
      description: 'Reddit, Hacker News',
    },
    {
      title: 'Last 24 Hours',
      value: '0',
      description: 'New posts collected',
    },
    {
      title: 'Top Score',
      value: '0',
      description: 'Highest rated post',
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
        />
      ))}
    </div>
  )
}
