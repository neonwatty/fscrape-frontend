'use client'

import { useEffect } from 'react'
import { DatabaseProvider, useDatabase } from '@/lib/db/database-context'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { RecentPostsTable } from '@/components/dashboard/RecentPostsTable'
import { PlatformSelector } from '@/components/dashboard/PlatformSelector'
import { PlatformPicker } from '@/components/dashboard/PlatformPicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createSampleDatabase } from '@/lib/db/sample-database'

function DashboardContent() {
  const { isLoading, isInitialized, error, summary, loadDatabase, refreshData } = useDatabase()

  const handleLoadSampleData = async () => {
    try {
      // Create and load sample database
      const sampleDb = await createSampleDatabase()
      const data = sampleDb.export()
      const blob = new Blob([data as unknown as BlobPart], { type: 'application/octet-stream' })
      const url = URL.createObjectURL(blob)
      
      await loadDatabase(url)
      
      // Clean up
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to load sample data:', err)
    }
  }

  useEffect(() => {
    if (isInitialized) {
      refreshData()
    }
  }, [isInitialized])

  if (!isInitialized) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of scraped forum posts and platform statistics
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Load a database file to view forum post analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="flex gap-4">
              <Button onClick={handleLoadSampleData} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Load Sample Data'}
              </Button>
              
              <Button variant="outline" disabled={isLoading}>
                Upload Database File
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              You can load sample data to explore the dashboard features or upload your own SQLite database file.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          {summary ? `Showing ${summary.totalPosts.toLocaleString()} posts from ${summary.totalAuthors.toLocaleString()} authors` : 'Overview of scraped forum posts and platform statistics'}
        </p>
      </div>

      <div className="space-y-8">
        {/* Platform Filter Section */}
        <PlatformPicker 
          onSelectionChange={(selection) => {
            console.log('Platform selection changed:', selection)
            // This will trigger re-renders of child components through URL params
          }}
        />

        {/* Stats Cards Section */}
        <StatsCards />

        {/* Platform Selector Section */}
        <PlatformSelector />

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <TrendChart />
          
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Posts by platform</CardDescription>
            </CardHeader>
            <CardContent>
              {summary?.platforms && summary.platforms.length > 0 ? (
                <div className="space-y-2">
                  {summary.platforms.map((platform) => (
                    <div key={platform.platform} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{platform.platform}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(platform.totalPosts / summary.totalPosts) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                          {platform.totalPosts.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No platform data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts Table */}
        <RecentPostsTable />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <DatabaseProvider>
      <DashboardContent />
    </DatabaseProvider>
  )
}