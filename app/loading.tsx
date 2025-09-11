import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 mx-auto">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    </div>
  )
}