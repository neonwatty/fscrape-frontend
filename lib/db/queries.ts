import { executeQuery, executeQueryFirst } from './sql-loader'
import type { ForumPost, PostFilters, PlatformStats, TimeSeriesData, AuthorStats } from './types'

// Get posts with filters
export function getPosts(filters: PostFilters = {}): ForumPost[] {
  let sql = 'SELECT * FROM forum_posts WHERE 1=1'
  const params: any[] = []

  // Apply filters
  if (filters.platform) {
    sql += ' AND platform = ?'
    params.push(filters.platform)
  }

  if (filters.source) {
    sql += ' AND source = ?'
    params.push(filters.source)
  }

  if (filters.author) {
    sql += ' AND author LIKE ?'
    params.push(`%${filters.author}%`)
  }

  if (filters.searchTerm) {
    sql += ' AND (title LIKE ? OR content LIKE ?)'
    params.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`)
  }

  if (filters.dateFrom) {
    sql += ' AND created_utc >= ?'
    params.push(Math.floor(filters.dateFrom.getTime() / 1000))
  }

  if (filters.dateTo) {
    sql += ' AND created_utc <= ?'
    params.push(Math.floor(filters.dateTo.getTime() / 1000))
  }

  if (filters.scoreMin !== undefined) {
    sql += ' AND score >= ?'
    params.push(filters.scoreMin)
  }

  if (filters.scoreMax !== undefined) {
    sql += ' AND score <= ?'
    params.push(filters.scoreMax)
  }

  if (filters.commentsMin !== undefined) {
    sql += ' AND num_comments >= ?'
    params.push(filters.commentsMin)
  }

  if (filters.commentsMax !== undefined) {
    sql += ' AND num_comments <= ?'
    params.push(filters.commentsMax)
  }

  // Apply time range filter
  if (filters.timeRange && filters.timeRange !== 'all') {
    const now = Math.floor(Date.now() / 1000)
    let timeAgo = now

    switch (filters.timeRange) {
      case 'day':
        timeAgo = now - 86400
        break
      case 'week':
        timeAgo = now - 604800
        break
      case 'month':
        timeAgo = now - 2592000
        break
      case 'year':
        timeAgo = now - 31536000
        break
    }

    sql += ' AND created_utc >= ?'
    params.push(timeAgo)
  }

  // Apply sorting
  const sortBy = filters.sortBy || 'created_utc'
  const sortOrder = filters.sortOrder || 'desc'
  sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`

  // Apply pagination
  if (filters.limit) {
    sql += ' LIMIT ?'
    params.push(filters.limit)
  }

  if (filters.offset) {
    sql += ' OFFSET ?'
    params.push(filters.offset)
  }

  return executeQuery<ForumPost>(sql, params)
}

// Get post by ID
export function getPostById(id: string): ForumPost | null {
  return executeQueryFirst<ForumPost>(
    'SELECT * FROM forum_posts WHERE id = ?',
    [id]
  )
}

// Get platform statistics
export function getPlatformStats(): PlatformStats[] {
  return executeQuery<PlatformStats>(`
    SELECT 
      platform,
      COUNT(*) as totalPosts,
      AVG(score) as avgScore,
      AVG(num_comments) as avgComments,
      MAX(scraped_at) as lastScraped
    FROM forum_posts
    GROUP BY platform
    ORDER BY totalPosts DESC
  `)
}

// Get posts count by time period
export function getPostsTimeSeries(days: number = 30): TimeSeriesData[] {
  const now = Math.floor(Date.now() / 1000)
  const timeAgo = now - (days * 86400)

  return executeQuery<TimeSeriesData>(`
    SELECT 
      DATE(created_utc, 'unixepoch') as date,
      COUNT(*) as count,
      AVG(score) as avgScore,
      AVG(num_comments) as avgComments
    FROM forum_posts
    WHERE created_utc >= ?
    GROUP BY DATE(created_utc, 'unixepoch')
    ORDER BY date DESC
  `, [timeAgo])
}

// Get top authors
export function getTopAuthors(limit: number = 10): AuthorStats[] {
  return executeQuery<AuthorStats>(`
    SELECT 
      author,
      COUNT(*) as postCount,
      SUM(score) as totalScore,
      AVG(score) as avgScore,
      SUM(num_comments) as totalComments
    FROM forum_posts
    WHERE author IS NOT NULL AND author != '[deleted]'
    GROUP BY author
    ORDER BY totalScore DESC
    LIMIT ?
  `, [limit])
}

// Get posts by hour heatmap data
export function getPostingHeatmap(days: number = 30) {
  const now = Math.floor(Date.now() / 1000)
  const timeAgo = now - (days * 86400)

  return executeQuery<{ hour: number; dayOfWeek: number; count: number }>(`
    SELECT 
      CAST(strftime('%H', created_utc, 'unixepoch') AS INTEGER) as hour,
      CAST(strftime('%w', created_utc, 'unixepoch') AS INTEGER) as dayOfWeek,
      COUNT(*) as count
    FROM forum_posts
    WHERE created_utc >= ?
    GROUP BY hour, dayOfWeek
    ORDER BY dayOfWeek, hour
  `, [timeAgo])
}

// Search posts
export function searchPosts(query: string, limit: number = 50): ForumPost[] {
  return executeQuery<ForumPost>(`
    SELECT * FROM forum_posts
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY score DESC
    LIMIT ?
  `, [`%${query}%`, `%${query}%`, limit])
}

// Get unique sources (subreddits, HN categories, etc.)
export function getUniqueSources(): { platform: string; source: string; count: number }[] {
  return executeQuery(`
    SELECT platform, source, COUNT(*) as count
    FROM forum_posts
    GROUP BY platform, source
    ORDER BY platform, count DESC
  `)
}

// Get database summary
export function getDatabaseSummary() {
  const totalPosts = executeQueryFirst<{ count: number }>('SELECT COUNT(*) as count FROM forum_posts')
  const totalAuthors = executeQueryFirst<{ count: number }>('SELECT COUNT(DISTINCT author) as count FROM forum_posts WHERE author IS NOT NULL')
  const dateRange = executeQueryFirst<{ minDate: number; maxDate: number }>('SELECT MIN(created_utc) as minDate, MAX(created_utc) as maxDate FROM forum_posts')
  const platforms = getPlatformStats()

  return {
    totalPosts: totalPosts?.count || 0,
    totalAuthors: totalAuthors?.count || 0,
    dateRange: {
      from: dateRange?.minDate ? new Date(dateRange.minDate * 1000) : null,
      to: dateRange?.maxDate ? new Date(dateRange.maxDate * 1000) : null,
    },
    platforms,
  }
}