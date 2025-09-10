'use client'

import { Suspense } from 'react'
import { DatabaseProvider } from '@/lib/db/database-context'
import { PostsExplorer } from '@/components/posts/PostsExplorer'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function PostsExplorerSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[150px] mt-2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PostsPage() {
  return (
    <DatabaseProvider>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Posts Explorer</h1>
          <p className="text-muted-foreground text-lg">
            Browse, search, and filter through all scraped forum posts with advanced analytics
          </p>
        </div>

        <Suspense fallback={<PostsExplorerSkeleton />}>
          <PostsExplorer />
        </Suspense>
      </div>
    </DatabaseProvider>
  )
}