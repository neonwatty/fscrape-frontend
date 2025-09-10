'use client'

import { Suspense } from 'react'
import { DatabaseProvider } from '@/lib/db/database-context'
import { AnalyticsDashboard } from './analytics-dashboard'
import { Skeleton } from '@/components/ui/skeleton'

function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DatabaseProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Analytics & Trends</h1>
          <p className="text-muted-foreground text-lg">
            Visualize posting patterns, engagement metrics, and trending topics
          </p>
        </div>

        <Suspense fallback={<AnalyticsLoading />}>
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </DatabaseProvider>
  )
}
