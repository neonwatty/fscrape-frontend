# fscrape Frontend - Data Visualization Dashboard
## Modern Next.js Static Site with sql.js Integration

## Overview
A beautiful, responsive web application for visualizing and exploring data collected by the fscrape tool. Built with Next.js (static export), sql.js for browser-based SQLite queries, and modern visualization libraries.

## Tech Stack
- **Framework**: Next.js 14+ with App Router (static export)
- **Database**: sql.js (SQLite in the browser)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts or Chart.js (responsive, performant)
- **Tables**: TanStack Table (formerly React Table)
- **State Management**: Zustand or React Context
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Mobile**: Responsive-first design with touch gestures

## Project Structure
```
fscrape-frontend/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Dashboard/home page
│   ├── posts/
│   │   └── page.tsx           # Posts explorer
│   ├── analytics/
│   │   └── page.tsx           # Analytics & trends
│   ├── compare/
│   │   └── page.tsx           # Compare subreddits/sources
│   └── api/
│       └── db-stats/route.ts  # Optional API routes
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Navigation header
│   │   ├── MobileNav.tsx      # Mobile navigation
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx     # Key metrics cards
│   │   ├── RecentPosts.tsx    # Latest posts table
│   │   ├── TrendChart.tsx     # Main trend visualization
│   │   └── PlatformPicker.tsx # Platform selector
│   ├── charts/
│   │   ├── TimeSeriesChart.tsx
│   │   ├── HeatMap.tsx        # Posting time heatmap
│   │   ├── BarChart.tsx
│   │   └── PieChart.tsx
│   ├── tables/
│   │   ├── PostsTable.tsx     # Sortable, filterable table
│   │   ├── TablePagination.tsx
│   │   └── TableFilters.tsx
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   └── ...
│   └── providers/
│       ├── DatabaseProvider.tsx # sql.js context
│       └── ThemeProvider.tsx   # Dark mode support
├── lib/
│   ├── db/
│   │   ├── sql-loader.ts      # sql.js initialization
│   │   ├── queries.ts         # SQL query functions
│   │   ├── cache.ts           # Query result caching
│   │   └── types.ts           # Database types matching backend
│   ├── utils/
│   │   ├── formatters.ts      # Date, number formatting
│   │   ├── filters.ts         # Data filtering helpers
│   │   └── export.ts          # Export to CSV/JSON
│   └── hooks/
│       ├── useDatabase.ts     # Database hook
│       ├── useMediaQuery.ts   # Responsive hooks
│       └── usePagination.ts
├── public/
│   ├── .fscrape/              # Matches backend structure
│   │   └── forum_posts.db     # SQLite database file
│   └── data/                  # Legacy path (deprecated)
├── styles/
│   └── globals.css            # Tailwind directives
├── next.config.js             # Static export config
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## Key Features

### 1. Dashboard (Home Page)
```typescript
// Main metrics displayed
- Total posts collected (by platform)
- Active platforms & sources
- Posts in last 24h/7d/30d
- Top performing posts
- Posting frequency trends
- Data freshness indicator (last scraped_at)
- Active scraping sessions status
- Success rate from recent sessions
```

**Mobile Layout**:
- Stacked cards for metrics
- Swipeable chart views
- Collapsible sections

### 2. Posts Explorer
**Features**:
- Full-text search across titles and content
- Filters:
  - Platform (Reddit, HN, etc.)
  - Source (subreddit, category)
  - Date range picker (created_utc or scraped_at)
  - Score/comment thresholds
  - Author search
  - Time period (hour/day/week/month/year/all)
  - Category (hot/new/top/rising/controversial)
  - Post status (deleted/removed)
- Sorting:
  - Score (highest/lowest)
  - Comments
  - Date (newest/oldest)
  - Engagement ratio (upvote_ratio)
  - Awards count
- Infinite scroll or pagination
- Quick actions:
  - Open original post
  - Copy link
  - Export selection

**Mobile Optimizations**:
- Card view for posts on mobile
- Swipe gestures for actions
- Bottom sheet filters

### 3. Analytics & Trends
**Visualizations**:
- **Posting Time Heatmap**: Best times to post by day/hour
- **Growth Trends**: Posts over time by platform/source
- **Engagement Patterns**: Score vs. time of day
- **Top Authors**: Most prolific posters
- **Word Cloud**: Common terms in titles
- **Sentiment Analysis**: If text content available

**Interactive Features**:
- Zoom and pan on charts
- Toggle data series
- Export charts as images
- Custom date ranges

### 4. Compare Sources
- Side-by-side comparison of:
  - Different subreddits
  - Reddit vs. Hacker News
  - Posting patterns
  - Engagement metrics
- Normalized metrics for fair comparison

### 5. Mobile-First Features
```typescript
// Responsive breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: > 1024px

// Touch optimizations
- Swipe navigation between sections
- Pull-to-refresh data
- Touch-friendly buttons (min 44px)
- Bottom navigation on mobile
- Gesture controls for charts
```

## Database Integration

### Database Types (Matching Backend Schema)
```typescript
// lib/db/types.ts

export interface ForumPost {
  id: number;
  platform: 'reddit' | 'hackernews' | string;
  platform_id: string;
  source: string;
  title: string;
  author: string | null;
  created_utc: number;
  score: number | null;
  num_comments: number | null;
  post_url: string;
  selftext: string | null;
  is_video: boolean;
  is_self: boolean;
  is_crosspost: boolean;
  media_url: string | null;
  thumbnail: string | null;
  flair: string | null;
  awards_count: number;
  upvote_ratio: number | null;
  post_hint: string | null;
  is_deleted: boolean;
  is_removed: boolean;
  platform_metadata: Record<string, any> | null;
  scraped_at: string;
  time_period: string | null;
  category: string | null;
  // Generated columns
  year: number;
  month: number;
  day_of_week: string;
  hour: number;
}

export interface ScrapingSession {
  id: number;
  session_id: string;
  platform: string;
  source: string;
  time_period: string | null;
  category: string | null;
  started_at: string;
  completed_at: string | null;
  posts_found: number;
  posts_new: number;
  posts_updated: number;
  status: 'running' | 'completed' | 'failed';
  error_message: string | null;
}

export interface ScrapingMetric {
  id: number;
  session_id: string;
  metric_name: string;
  metric_value: number;
  recorded_at: string;
}

export type TimePeriod = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
export type Category = 'hot' | 'new' | 'top' | 'rising' | 'controversial';
export type Platform = 'reddit' | 'hackernews';
```

### sql.js Setup
```typescript
// lib/db/sql-loader.ts
import initSqlJs from 'sql.js';

export async function loadDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `/sql-js/${file}`
  });
  
  // Support configurable database path
  const dbPath = process.env.NEXT_PUBLIC_DB_PATH || '/.fscrape/forum_posts.db';
  const response = await fetch(dbPath);
  const buffer = await response.arrayBuffer();
  
  const db = new SQL.Database(new Uint8Array(buffer));
  
  // Verify schema version and tables exist
  const tables = db.exec(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    AND name IN ('forum_posts', 'scraping_sessions', 'scraping_metrics')
  `);
  
  if (tables[0]?.values?.length !== 3) {
    console.warn('Database schema may be outdated or incomplete');
  }
  
  return db;
}
```

### Query Examples
```typescript
// lib/db/queries.ts
export const queries = {
  recentPosts: `
    SELECT 
      id, platform, platform_id, source, title, author,
      created_utc, score, num_comments, post_url, selftext,
      is_video, is_self, is_crosspost, media_url, thumbnail,
      flair, awards_count, upvote_ratio, post_hint,
      is_deleted, is_removed, platform_metadata,
      scraped_at, time_period, category,
      year, month, day_of_week, hour
    FROM forum_posts 
    WHERE datetime(created_utc, 'unixepoch') > datetime('now', '-7 days')
    ORDER BY created_utc DESC 
    LIMIT ?
  `,
  
  postsByHour: `
    SELECT 
      hour,
      COUNT(*) as count,
      AVG(score) as avg_score,
      AVG(num_comments) as avg_comments,
      AVG(upvote_ratio) as avg_upvote_ratio
    FROM forum_posts
    WHERE platform = ?
    GROUP BY hour
    ORDER BY hour
  `,
  
  topSources: `
    SELECT 
      source, 
      platform,
      COUNT(*) as post_count, 
      AVG(score) as avg_score,
      AVG(num_comments) as avg_comments,
      MAX(created_utc) as last_post_time
    FROM forum_posts
    WHERE platform = ?
    GROUP BY source, platform
    ORDER BY post_count DESC
    LIMIT 10
  `,
  
  scrapingSessions: `
    SELECT 
      session_id, platform, source, time_period, category,
      started_at, completed_at, posts_found, posts_new, 
      posts_updated, status, error_message,
      CAST((julianday(completed_at) - julianday(started_at)) * 24 * 60 AS INTEGER) as duration_minutes
    FROM scraping_sessions
    ORDER BY started_at DESC
    LIMIT ?
  `,
  
  sessionMetrics: `
    SELECT 
      metric_name, 
      metric_value, 
      recorded_at
    FROM scraping_metrics
    WHERE session_id = ?
    ORDER BY recorded_at
  `,
  
  platformComparison: `
    SELECT 
      platform,
      COUNT(*) as total_posts,
      AVG(score) as avg_score,
      AVG(num_comments) as avg_comments,
      COUNT(DISTINCT source) as unique_sources,
      COUNT(DISTINCT author) as unique_authors
    FROM forum_posts
    WHERE datetime(created_utc, 'unixepoch') > datetime('now', '-30 days')
    GROUP BY platform
  `,
  
  postingHeatmap: `
    SELECT 
      day_of_week,
      hour,
      COUNT(*) as post_count,
      AVG(score) as avg_score
    FROM forum_posts
    WHERE platform = ? AND source = ?
    GROUP BY day_of_week, hour
    ORDER BY day_of_week, hour
  `,
  
  authorStats: `
    SELECT 
      author,
      platform,
      COUNT(*) as post_count,
      AVG(score) as avg_score,
      SUM(num_comments) as total_comments,
      MAX(created_utc) as last_post_time
    FROM forum_posts
    WHERE author IS NOT NULL AND author != '[deleted]'
    GROUP BY author, platform
    ORDER BY post_count DESC
    LIMIT ?
  `
};
```

### Performance Optimizations
- **Lazy Loading**: Load database only when needed
- **Query Caching**: Cache results with TTL
- **Web Workers**: Run heavy queries in background
- **Indexed Queries**: Utilize SQLite indexes
- **Pagination**: Limit result sets

## UI/UX Design

### Color Scheme
```css
/* Light mode */
--background: white;
--foreground: black;
--primary: blue-600;
--secondary: gray-600;

/* Dark mode */
--background: gray-900;
--foreground: white;
--primary: blue-400;
--secondary: gray-400;
```

### Component Examples

#### Stats Card
```tsx
<Card className="p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Total Posts</p>
      <p className="text-2xl font-bold">12,543</p>
      <p className="text-xs text-green-600">↑ 12% from last week</p>
    </div>
    <TrendingUpIcon className="h-8 w-8 text-muted-foreground" />
  </div>
</Card>
```

#### Mobile Navigation
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
  <div className="flex justify-around py-2">
    <NavItem icon={<HomeIcon />} label="Home" href="/" />
    <NavItem icon={<SearchIcon />} label="Posts" href="/posts" />
    <NavItem icon={<ChartIcon />} label="Analytics" href="/analytics" />
    <NavItem icon={<SettingsIcon />} label="Settings" href="/settings" />
  </div>
</nav>
```

## Build & Deployment

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  output: 'export',  // Static HTML export
  basePath: '/fscrape-frontend', // If deploying to GitHub Pages subfolder
  images: {
    unoptimized: true  // Required for static export
  }
};
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next build && next export",
    "serve": "npx serve@latest out",
    "update-db": "cp ../fscrape/.fscrape/forum_posts.db public/.fscrape/",
    "update-db:legacy": "cp ../fscrape/data/forum_posts.db public/data/",
    "sync": "npm run update-db && npm run build",
    "deploy": "npm run build && gh-pages -d out"
  }
}
```

### GitHub Actions Deployment
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build static site
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## Progressive Enhancement

### Initial Load Strategy
1. Show loading skeleton
2. Load sql.js library
3. Fetch and load database
4. Render initial dashboard
5. Prefetch other routes

### Offline Support
```javascript
// Enable PWA features
- Service worker for caching
- Offline database access
- Background sync for updates
```

## Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sql.js": "^1.8.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "latest",
    "recharts": "^2.8.0",
    "@tanstack/react-table": "^8.10.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.290.0",
    "zustand": "^4.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/sql.js": "^1.4.4",
    "typescript": "^5.2.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "gh-pages": "^6.0.0"
  }
}
```

## Performance Targets
- **Lighthouse Score**: > 90 for all metrics
- **Initial Load**: < 3s on 3G
- **Time to Interactive**: < 5s
- **Database Load**: < 2s for databases up to 50MB
- **Query Response**: < 100ms for most queries

## Future Enhancements
1. **Real-time Updates**: WebSocket connection to live data
2. **AI Insights**: GPT-powered trend analysis
3. **Collaborative Features**: Share and comment on findings
4. **Custom Dashboards**: User-created dashboard layouts
5. **Advanced Analytics**: ML-based predictions
6. **Export Reports**: PDF generation with charts
7. **Notifications**: Alert on specific keywords/thresholds
8. **API Access**: REST API for programmatic access

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Copy latest database from fscrape
npm run update-db

# Start development server
npm run dev

# Build for production
npm run build

# Test production build locally
npm run serve
```

### Testing Strategy
- Unit tests for utility functions
- Integration tests for database queries
- E2E tests for critical user flows
- Visual regression tests for charts
- Performance testing with Lighthouse

## Mobile App Considerations
While this is a web app, it's designed to work excellently as a PWA:
- Add to home screen capability
- Native-like navigation
- Offline functionality
- Push notifications (future)

## Security Considerations
- No sensitive data in the database
- Read-only database access
- Content Security Policy headers
- Safe SQL query construction
- XSS prevention in user inputs
