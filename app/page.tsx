import { StatsCards } from '@/components/dashboard/StatsCards'

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of scraped forum posts and platform statistics
        </p>
      </div>
      
      <div className="space-y-8">
        <StatsCards />
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">
              Recent posts and scraping activity will appear here
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">Platform Distribution</h2>
            <p className="text-sm text-muted-foreground">
              Platform statistics and charts will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}