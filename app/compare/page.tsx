import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Sources | fscrape',
  description: 'Compare metrics across different platforms and sources',
}

export default function ComparePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Compare Sources</h1>
        <p className="text-muted-foreground">
          Side-by-side comparison of different platforms and sources
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Source comparison interface will be implemented here
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Features: Platform comparison, subreddit analysis, engagement metrics
          </p>
        </div>
      </div>
    </div>
  )
}
