'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDatabase } from '@/lib/db/database-context'
import { getRecentPosts, type ForumPost } from '@/lib/db/queries'
import { formatDistanceToNow } from 'date-fns'
import { ArrowUpIcon, MessageCircleIcon, ExternalLinkIcon } from 'lucide-react'

export function RecentPostsTable() {
  const { isInitialized } = useDatabase()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isInitialized) {
      setLoading(true)
      try {
        const recentPosts = getRecentPosts(20)
        setPosts(recentPosts)
      } catch (error) {
        console.error('Error fetching recent posts:', error)
      } finally {
        setLoading(false)
      }
    }
  }, [isInitialized])

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'reddit':
        return 'bg-orange-500/10 text-orange-700 hover:bg-orange-500/20'
      case 'hackernews':
        return 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
      default:
        return 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20'
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Posts</CardTitle>
        <CardDescription>Latest forum posts across all platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Title</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-center">Engagement</TableHead>
                <TableHead className="text-right">Posted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading posts...
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No posts available
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div className="flex items-start gap-2">
                          <span className="line-clamp-2">{truncateText(post.title, 100)}</span>
                          {post.url && (
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLinkIcon className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        {post.subreddit && (
                          <div className="text-xs text-muted-foreground">
                            r/{post.subreddit}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getPlatformColor(post.platform)}>
                        {post.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {post.author || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                          <ArrowUpIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{post.score}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircleIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{post.num_comments}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_utc * 1000), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}