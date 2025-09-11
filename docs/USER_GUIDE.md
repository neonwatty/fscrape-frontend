# User Guide - Forum Scraper Frontend

## Welcome!

Forum Scraper Frontend is a powerful analytics platform for exploring and analyzing forum data from Reddit, Hacker News, and other platforms. This guide will help you get the most out of the application.

## Table of Contents
- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Exploring Posts](#exploring-posts)
- [Analytics Features](#analytics-features)
- [Comparison Tools](#comparison-tools)
- [Mobile Usage](#mobile-usage)
- [Data Export](#data-export)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tips & Tricks](#tips--tricks)
- [Troubleshooting](#troubleshooting)

## Getting Started

### First Time Setup

1. **Access the Application**
   - Open your browser and navigate to the application URL
   - The dashboard will load automatically with sample data
   - No login or registration required!

2. **Load Your Data**
   - Click the "Upload Database" button in the top-right corner
   - Select your `.db` file containing forum data
   - Or use the sample data to explore features

3. **Choose Your Theme**
   - Click the theme toggle (sun/moon icon) in the header
   - Select Light, Dark, or System theme
   - Your preference is saved automatically

### Understanding the Interface

The application has four main sections accessible from the navigation:

- **Dashboard** - Overview of all your forum data
- **Posts** - Detailed post exploration and searching
- **Analytics** - Deep dive into trends and patterns
- **Compare** - Platform comparison tools

## Dashboard Overview

The dashboard provides a bird's-eye view of your forum data:

### Key Metrics Cards

At the top of the dashboard, you'll find four key metric cards:

1. **Total Posts** - The complete count of all forum posts in your database
2. **Active Authors** - Number of unique users who have posted
3. **Average Engagement** - Mean score across all posts
4. **Posts Today** - New posts from the last 24 hours

Each card shows:
- Current value (large number)
- Percentage change from previous period
- Trend indicator (up/down arrow)

### Activity Trends Chart

The main chart displays posting activity over time:

- **Time Range Selector**: Choose from 7 days, 30 days, 3 months, or 1 year
- **Platform Filter**: View all platforms or select specific ones
- **Hover for Details**: Move your mouse over the chart to see exact values
- **Zoom Controls**: Click and drag to zoom into specific time periods

### Recent Posts Table

The bottom section shows the latest posts:

- **Quick Preview**: See title, author, platform, and engagement metrics
- **Sort Options**: Click column headers to sort by date, score, or comments
- **Quick Actions**: Click any post to view on the original platform
- **Load More**: Scroll to bottom to load additional posts

## Exploring Posts

The Posts page is your command center for finding specific content:

### Search and Filter

#### Search Bar
- Type keywords to search across titles and content
- Use quotes for exact phrases: `"machine learning"`
- Combine terms with AND/OR: `python AND tutorial`
- Exclude terms with minus: `javascript -jquery`

#### Filter Panel

**Platform Selection**
- Toggle platforms on/off with checkboxes
- Select multiple platforms to compare

**Date Range**
- Use the calendar picker for custom dates
- Quick options: Today, This Week, This Month, This Year
- Clear button to remove date filters

**Score Range**
- Set minimum and maximum scores
- Use slider for quick adjustments
- Popular presets: Viral (1000+), Hot (100+), Rising (10+)

**Author Filter**
- Type to search for specific authors
- Select from dropdown of frequent posters
- Multi-select supported

### Posts Table Features

#### Viewing Options
- **Compact View**: See more posts at once
- **Detailed View**: Include post preview text
- **Card View**: Visual grid layout with thumbnails

#### Sorting
Click any column header to sort:
- Title (alphabetical)
- Author (alphabetical)
- Platform (grouped)
- Score (highest/lowest)
- Comments (most/least discussed)
- Date (newest/oldest)

#### Bulk Actions
- Select multiple posts with checkboxes
- Export selected posts
- Mark as read/unread
- Add to collections

### Post Details

Click on any post to open the detail view:

- **Full Content**: Read the complete post text
- **Engagement Metrics**: Score, comments, awards
- **Metadata**: Posted date, last updated, post ID
- **External Link**: Open on original platform
- **Share Options**: Copy link, share via social media
- **Related Posts**: Similar posts based on content

## Analytics Features

The Analytics page provides deep insights into your forum data:

### Engagement Heatmap

Visualize posting patterns:

- **Day/Hour Grid**: See when posts get most engagement
- **Color Intensity**: Darker colors = higher activity
- **Hover Details**: Exact post count and average score
- **Time Zone**: Automatically adjusted to your local time

Best times to post are highlighted with a star indicator.

### Growth Metrics

Track platform growth over time:

#### Metrics Available
- **Post Volume**: Number of posts per period
- **User Growth**: New authors joining
- **Engagement Rate**: Average score trends
- **Comment Activity**: Discussion levels

#### Visualization Options
- Line chart for trends
- Bar chart for comparisons
- Area chart for cumulative data
- Toggle between absolute and percentage values

### Top Authors Analysis

Discover influential posters:

#### Author Metrics
- **Post Count**: Total contributions
- **Average Score**: Engagement quality
- **Total Reach**: Combined post scores
- **Activity Timeline**: When they post

#### Filtering Options
- Time period selection
- Minimum post threshold
- Platform specific
- Sort by different metrics

### Content Analysis

Understand what resonates:

#### Word Cloud
- Most frequent terms in titles
- Click words to filter posts
- Adjust minimum frequency
- Export as image

#### Topic Trends
- Emerging topics (growing mentions)
- Declining topics (reducing mentions)
- Seasonal patterns
- Correlation with engagement

## Comparison Tools

Compare performance across platforms:

### Platform Comparison

Side-by-side platform analysis:

1. **Select Platforms**: Choose 2-4 platforms to compare
2. **Choose Metrics**: 
   - Post volume
   - Average engagement
   - Author diversity
   - Peak posting times
3. **Time Period**: Select comparison window
4. **View Results**: Interactive charts and tables

### Metric Comparison

Compare different metrics:

- **Correlation Analysis**: See how metrics relate
- **Scatter Plots**: Identify patterns and outliers
- **Trend Lines**: Spot diverging patterns
- **Statistical Summary**: Mean, median, standard deviation

### Benchmark Analysis

Compare against benchmarks:

- Platform averages
- Historical performance
- Custom targets
- Industry standards

## Mobile Usage

The application is fully responsive and touch-optimized:

### Mobile Navigation

- **Hamburger Menu**: Tap the menu icon for navigation
- **Swipe Gestures**: 
  - Swipe right to open menu
  - Swipe left to close menu
  - Swipe up/down to scroll

### Touch Interactions

- **Long Press**: Opens context menu for posts
- **Pinch to Zoom**: Zoom charts and graphs
- **Pull to Refresh**: Update data on any page
- **Double Tap**: Quick actions on posts

### Mobile-Specific Features

- **Simplified Layout**: Optimized for small screens
- **Offline Mode**: View cached data without connection
- **Progressive Web App**: Install as app on your device
- **Data Saver Mode**: Reduced data usage option

## Data Export

Export your data in multiple formats:

### Export Options

#### CSV Export
Perfect for spreadsheets:
```
1. Select posts to export
2. Click "Export" button
3. Choose "CSV Format"
4. Select columns to include
5. Download file
```

#### JSON Export
For developers and APIs:
```
1. Choose data to export
2. Select "JSON Format"
3. Configure options (pretty print, nested)
4. Download or copy to clipboard
```

#### PDF Reports
Professional reports:
```
1. Go to Analytics
2. Click "Generate Report"
3. Select sections to include
4. Choose template
5. Download PDF
```

### Scheduled Exports

Set up automatic exports:

1. Click Settings → Export Schedule
2. Choose frequency (daily, weekly, monthly)
3. Select data and format
4. Enter email for delivery
5. Save schedule

## Keyboard Shortcuts

Navigate faster with keyboard shortcuts:

### Global Shortcuts
- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + /` - Show all shortcuts
- `Esc` - Close modals/panels
- `?` - Open help

### Navigation
- `G then D` - Go to Dashboard
- `G then P` - Go to Posts
- `G then A` - Go to Analytics
- `G then C` - Go to Compare

### Actions
- `N` - New filter
- `E` - Export data
- `R` - Refresh data
- `S` - Save current view
- `Ctrl/Cmd + Z` - Undo last action

### Table Navigation
- `J` - Next row
- `K` - Previous row
- `Enter` - Open selected post
- `Space` - Select/deselect row
- `Shift + Click` - Select range

## Tips & Tricks

### Power User Features

1. **Custom Dashboards**
   - Save multiple dashboard layouts
   - Share dashboards with URL
   - Subscribe to dashboard updates

2. **Advanced Search**
   - Regular expressions: `/pattern/flags`
   - Field-specific search: `author:username`
   - Date ranges: `created:2024-01-01..2024-12-31`

3. **Data Combinations**
   - Create calculated metrics
   - Combine multiple databases
   - Cross-reference platforms

### Performance Tips

- **Large Datasets**: Enable virtualization in settings
- **Slow Loading**: Clear cache and reload
- **Memory Issues**: Limit date ranges and use pagination
- **Export Large Data**: Use chunked exports for better performance

### Customization

1. **Appearance**
   - Custom color themes
   - Font size adjustment
   - Compact/comfortable/spacious density

2. **Behavior**
   - Default filters
   - Preferred sort order
   - Auto-refresh intervals

3. **Notifications**
   - New post alerts
   - Threshold notifications
   - Daily summaries

## Troubleshooting

### Common Issues

#### Data Not Loading
```
Solution:
1. Check internet connection
2. Verify database file is valid
3. Clear browser cache
4. Try incognito/private mode
```

#### Charts Not Displaying
```
Solution:
1. Enable JavaScript
2. Update browser to latest version
3. Disable ad blockers
4. Check console for errors
```

#### Export Failing
```
Solution:
1. Reduce data selection
2. Try different format
3. Check browser downloads
4. Increase memory limit
```

#### Search Not Working
```
Solution:
1. Check search syntax
2. Clear search filters
3. Rebuild search index
4. Report persistent issues
```

### Getting Help

If you encounter issues:

1. **Check Documentation**: Review this guide and FAQ
2. **Community Forum**: Ask questions and share tips
3. **GitHub Issues**: Report bugs and request features
4. **Email Support**: Contact support team for urgent issues

### Error Messages

Common error messages and solutions:

| Error | Meaning | Solution |
|-------|---------|----------|
| "Database connection failed" | Cannot read database file | Re-upload database or use sample data |
| "Query timeout" | Operation took too long | Reduce data range or simplify filters |
| "Invalid filter" | Filter syntax error | Check filter format and values |
| "Export too large" | Too much data to export | Select smaller date range or fewer columns |

## Best Practices

### For Optimal Performance
- Keep browser updated
- Use Chrome, Firefox, or Edge for best experience
- Close unnecessary tabs to free memory
- Enable hardware acceleration

### For Data Analysis
- Start with broad filters, then narrow down
- Save frequently used filter combinations
- Export data regularly for backup
- Document your analysis process

### For Collaboration
- Share specific URLs with filters applied
- Use consistent naming for saved views
- Export reports in universal formats
- Add notes to significant findings

---

## Quick Reference Card

### Most Used Features

| Feature | Location | Shortcut |
|---------|----------|----------|
| Quick Search | Header | Ctrl+K |
| Filter Posts | Posts Page | N |
| Export Data | Any Table | E |
| Change Theme | Header | T |
| Refresh Data | Any Page | R |
| View Post | Posts Table | Enter |
| Dashboard | Navigation | G,D |

### Filter Syntax

| Type | Example | Result |
|------|---------|--------|
| Keyword | `python` | Posts containing "python" |
| Exact | `"machine learning"` | Exact phrase match |
| Exclude | `-javascript` | Exclude term |
| Author | `author:john` | Posts by John |
| Score | `score:>100` | Score greater than 100 |
| Date | `date:2024-01` | Posts from January 2024 |

---

**Need more help?** Visit our [GitHub repository](https://github.com/neonwatty/fscrape-frontend) or check the [FAQ section](./FAQ.md).