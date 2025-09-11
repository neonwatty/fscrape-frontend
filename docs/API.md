# API Reference

## Table of Contents
- [Overview](#overview)
- [Database Queries](#database-queries)
- [Hooks API](#hooks-api)
- [Utility Functions](#utility-functions)
- [Component Props](#component-props)
- [Type Definitions](#type-definitions)

## Overview

The Forum Scraper Frontend is a static application that uses an in-browser SQLite database via SQL.js. While it doesn't have traditional REST APIs, it provides a comprehensive set of functions, hooks, and utilities for data access and manipulation.

## Database Queries

### Core Query Functions

#### `executeQuery<T>`
Executes a raw SQL query against the database.

```typescript
function executeQuery<T>(
  db: Database,
  query: string,
  params?: any[]
): T[]

// Example
const posts = executeQuery<Post>(
  db,
  'SELECT * FROM posts WHERE platform = ? LIMIT ?',
  ['reddit', 10]
);
```

#### `cachedQuery<T>`
Executes a query with caching support.

```typescript
function cachedQuery<T>(
  db: Database,
  query: string,
  params?: any[],
  options?: CacheOptions
): Promise<T[]>

interface CacheOptions {
  ttl?: number;        // Time to live in milliseconds
  key?: string;        // Custom cache key
  force?: boolean;     // Force cache refresh
}

// Example
const posts = await cachedQuery<Post>(
  db,
  'SELECT * FROM posts WHERE score > ?',
  [100],
  { ttl: 60000 } // Cache for 1 minute
);
```

### Specialized Query Functions

#### `getPosts`
Retrieves posts with filtering and pagination.

```typescript
interface GetPostsParams {
  platform?: string;
  startDate?: Date;
  endDate?: Date;
  author?: string;
  minScore?: number;
  searchTerm?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'score' | 'comments';
  order?: 'ASC' | 'DESC';
}

function getPosts(
  db: Database,
  params: GetPostsParams
): Promise<Post[]>

// Example
const recentPosts = await getPosts(db, {
  platform: 'hackernews',
  limit: 20,
  orderBy: 'created_at',
  order: 'DESC'
});
```

#### `getAnalytics`
Retrieves analytics data for charts and visualizations.

```typescript
interface AnalyticsParams {
  metric: 'posts' | 'engagement' | 'authors' | 'growth';
  groupBy: 'day' | 'week' | 'month';
  startDate?: Date;
  endDate?: Date;
  platform?: string;
}

function getAnalytics(
  db: Database,
  params: AnalyticsParams
): Promise<AnalyticsData[]>

// Example
const monthlyGrowth = await getAnalytics(db, {
  metric: 'growth',
  groupBy: 'month',
  startDate: new Date('2024-01-01')
});
```

#### `searchPosts`
Full-text search across posts.

```typescript
function searchPosts(
  db: Database,
  searchTerm: string,
  options?: SearchOptions
): Promise<Post[]>

interface SearchOptions {
  fields?: ('title' | 'content' | 'author')[];
  fuzzy?: boolean;
  limit?: number;
}

// Example
const results = await searchPosts(db, 'machine learning', {
  fields: ['title', 'content'],
  fuzzy: true,
  limit: 50
});
```

## Hooks API

### Database Hooks

#### `useDatabase`
Primary hook for database operations.

```typescript
function useDatabase(): UseDatabaseReturn

interface UseDatabaseReturn {
  db: Database | null;
  loading: boolean;
  error: Error | null;
  executeQuery: <T>(query: string, params?: any[]) => Promise<T[]>;
  refresh: () => Promise<void>;
}

// Example
function MyComponent() {
  const { db, loading, error, executeQuery } = useDatabase();
  
  useEffect(() => {
    if (db) {
      executeQuery<Post>('SELECT * FROM posts LIMIT 10')
        .then(setPosts);
    }
  }, [db]);
}
```

#### `usePosts`
Hook for fetching and managing posts.

```typescript
function usePosts(params?: GetPostsParams): UsePostsReturn

interface UsePostsReturn {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  totalCount: number;
}

// Example
function PostsList() {
  const { posts, loading, loadMore, hasMore } = usePosts({
    platform: 'reddit',
    limit: 20
  });
}
```

### UI Hooks

#### `useInfiniteScroll`
Implements infinite scrolling functionality.

```typescript
function useInfiniteScroll(options: InfiniteScrollOptions): InfiniteScrollReturn

interface InfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
}

// Example
const { observerRef } = useInfiniteScroll({
  onLoadMore: loadMorePosts,
  hasMore: hasMorePosts,
  threshold: 0.8
});
```

#### `useVirtualizer`
Virtualizes large lists for performance.

```typescript
function useVirtualizer<T>(options: VirtualizerOptions<T>): VirtualizerReturn<T>

interface VirtualizerOptions<T> {
  items: T[];
  itemHeight: number | ((index: number) => number);
  overscan?: number;
  scrollElement?: HTMLElement | null;
}

// Example
const virtualizer = useVirtualizer({
  items: posts,
  itemHeight: 80,
  overscan: 5
});
```

#### `useTheme`
Manages theme state and preferences.

```typescript
function useTheme(): UseThemeReturn

interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

// Example
const { theme, setTheme } = useTheme();
```

## Utility Functions

### Data Formatting

#### `formatNumber`
Formats numbers with appropriate units.

```typescript
function formatNumber(
  value: number,
  options?: FormatNumberOptions
): string

interface FormatNumberOptions {
  notation?: 'standard' | 'compact' | 'scientific';
  decimals?: number;
  locale?: string;
}

// Examples
formatNumber(1234567);              // "1.2M"
formatNumber(1234567, {             // "1,234,567"
  notation: 'standard'
});
```

#### `formatDate`
Formats dates with various options.

```typescript
function formatDate(
  date: Date | string,
  format?: DateFormat
): string

type DateFormat = 
  | 'relative'     // "2 hours ago"
  | 'short'        // "Jan 1"
  | 'medium'       // "Jan 1, 2024"
  | 'long'         // "January 1, 2024"
  | 'datetime'     // "Jan 1, 2024 3:45 PM"

// Examples
formatDate(new Date(), 'relative');  // "just now"
formatDate('2024-01-01', 'medium');  // "Jan 1, 2024"
```

### Data Export

#### `exportToCSV`
Exports data to CSV format.

```typescript
function exportToCSV<T>(
  data: T[],
  filename: string,
  options?: ExportOptions
): void

interface ExportOptions {
  columns?: string[];
  headers?: Record<string, string>;
  delimiter?: string;
}

// Example
exportToCSV(posts, 'posts-export.csv', {
  columns: ['title', 'author', 'score', 'created_at'],
  headers: {
    created_at: 'Date Posted'
  }
});
```

#### `exportToJSON`
Exports data to JSON format.

```typescript
function exportToJSON<T>(
  data: T[],
  filename: string,
  options?: { pretty?: boolean }
): void

// Example
exportToJSON(posts, 'posts-export.json', { pretty: true });
```

### Filtering and Searching

#### `applyFilters`
Applies multiple filters to a dataset.

```typescript
function applyFilters<T>(
  items: T[],
  filters: FilterConfig<T>
): T[]

interface FilterConfig<T> {
  [key: string]: FilterFunction<T> | any;
}

// Example
const filtered = applyFilters(posts, {
  platform: 'reddit',
  minScore: 100,
  dateRange: { start: '2024-01-01', end: '2024-12-31' }
});
```

#### `searchItems`
Performs fuzzy search on items.

```typescript
function searchItems<T>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[]

// Example
const results = searchItems(posts, 'javascript', ['title', 'content']);
```

## Component Props

### Chart Components

#### `TimeSeriesChart`
```typescript
interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  height?: number;
  width?: number;
  margin?: ChartMargin;
  xAxisKey?: string;
  yAxisKey?: string;
  lineColor?: string;
  areaFill?: boolean;
  tooltip?: boolean;
  legend?: boolean;
  animate?: boolean;
}
```

#### `GrowthChart`
```typescript
interface GrowthChartProps {
  data: GrowthData[];
  metrics: MetricConfig[];
  height?: number;
  showComparison?: boolean;
  timeRange?: 'day' | 'week' | 'month' | 'year';
  interactive?: boolean;
}
```

### Table Components

#### `PostsTable`
```typescript
interface PostsTableProps {
  posts: Post[];
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (post: Post) => void;
  selectable?: boolean;
  onSelectionChange?: (selected: Post[]) => void;
  virtualized?: boolean;
  rowHeight?: number;
  loading?: boolean;
}
```

#### `VirtualizedTable`
```typescript
interface VirtualizedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowHeight?: number | ((index: number) => number);
  overscan?: number;
  onScroll?: (event: ScrollEvent) => void;
  className?: string;
}
```

## Type Definitions

### Core Types

```typescript
interface Post {
  id: string;
  platform: 'reddit' | 'hackernews' | 'other';
  title: string;
  author: string;
  content: string;
  url: string;
  score: number;
  comments: number;
  created_at: string;
  metadata?: Record<string, any>;
}

interface AnalyticsData {
  date: string;
  value: number;
  platform?: string;
  metric: string;
  comparison?: number;
}

interface ChartData {
  x: number | string | Date;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

interface FilterState {
  platforms: string[];
  dateRange: { start: Date | null; end: Date | null };
  searchTerm: string;
  authors: string[];
  minScore: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
```

### Response Types

```typescript
interface QueryResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}
```

## Error Handling

### Error Types

```typescript
class DatabaseError extends Error {
  code: 'DB_CONNECTION' | 'DB_QUERY' | 'DB_TIMEOUT';
  query?: string;
  params?: any[];
}

class ValidationError extends Error {
  field: string;
  value: any;
  constraint: string;
}
```

### Error Handling Pattern

```typescript
try {
  const result = await executeQuery(db, query, params);
  return { success: true, data: result };
} catch (error) {
  if (error instanceof DatabaseError) {
    console.error('Database error:', error.code);
    return { success: false, error: error.message };
  }
  throw error;
}
```

## Performance Considerations

### Query Optimization
- Use indexes for frequently queried columns
- Limit result sets with LIMIT clause
- Use prepared statements for repeated queries
- Cache expensive queries

### Memory Management
- Virtualize large lists
- Implement pagination
- Clean up event listeners
- Use React.memo for expensive components

## Examples

### Complete Data Fetching Example

```typescript
import { useDatabase, usePosts } from '@/lib/hooks';
import { PostsTable } from '@/components/tables';
import { exportToCSV } from '@/lib/utils/export';

function PostsExplorer() {
  const { db } = useDatabase();
  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    dateRange: { start: null, end: null },
    searchTerm: '',
    authors: [],
    minScore: 0,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const { 
    posts, 
    loading, 
    error, 
    loadMore, 
    hasMore 
  } = usePosts({
    ...filters,
    limit: 50
  });

  const handleExport = () => {
    exportToCSV(posts, `posts-${Date.now()}.csv`, {
      columns: ['title', 'author', 'platform', 'score', 'created_at']
    });
  };

  if (error) return <ErrorBoundary error={error} />;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <FilterPanel filters={filters} onChange={setFilters} />
      <PostsTable 
        posts={posts}
        virtualized={posts.length > 100}
        onRowClick={(post) => window.open(post.url)}
      />
      {hasMore && (
        <button onClick={loadMore}>Load More</button>
      )}
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  );
}
```

## Migration Guide

### From v1 to v2

```typescript
// v1 (deprecated)
const posts = await db.query('SELECT * FROM posts');

// v2 (current)
const posts = await executeQuery<Post>(
  db,
  'SELECT * FROM posts'
);
```

## Support

For issues, questions, or contributions, please refer to:
- [GitHub Issues](https://github.com/neonwatty/fscrape-frontend/issues)
- [Contributing Guide](../CONTRIBUTING.md)
- [Architecture Documentation](./ARCHITECTURE.md)