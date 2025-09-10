import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Posts Explorer | fscrape',
  description: 'Browse and filter scraped forum posts',
}

export default function PostsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Posts Explorer</h1>
        <p className="text-muted-foreground">
          Browse, search, and filter through all scraped forum posts
        </p>
      </div>

      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">Posts explorer interface will be implemented here</p>
        <p className="text-sm text-muted-foreground mt-2">
          Features: Search, filters, sorting, and data table
        </p>
      </div>
    </div>
  )
}
