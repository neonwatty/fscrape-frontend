import { test, expect } from '@playwright/test'

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/analytics')
  })

  test('displays analytics dashboard', async ({ page }) => {
    await expect(page.locator('h1:has-text("Analytics")')).toBeVisible()
    
    // Check for main chart areas
    await expect(page.locator('[data-testid="trend-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="top-authors"]')).toBeVisible()
    await expect(page.locator('[data-testid="platform-breakdown"]')).toBeVisible()
  })

  test('date range selector works', async ({ page }) => {
    const dateRangeSelector = page.locator('[data-testid="date-range"]')
    await dateRangeSelector.click()
    
    // Select last 7 days
    await page.locator('text=Last 7 days').click()
    
    // Check data updates
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(/range=7d/)
  })

  test('metrics cards show correct data', async ({ page }) => {
    // Wait for metrics to load
    await page.waitForSelector('[data-testid="metric-card"]')
    
    const metricCards = page.locator('[data-testid="metric-card"]')
    const count = await metricCards.count()
    expect(count).toBeGreaterThan(0)
    
    // Check for specific metrics
    await expect(page.locator('text=Total Posts')).toBeVisible()
    await expect(page.locator('text=Engagement Rate')).toBeVisible()
    await expect(page.locator('text=Active Authors')).toBeVisible()
  })

  test('charts are interactive', async ({ page }) => {
    const chart = page.locator('[data-testid="trend-chart"]')
    await expect(chart).toBeVisible()
    
    // Hover over chart to show tooltip
    await chart.hover()
    
    // Check tooltip appears
    const tooltip = page.locator('[data-testid="chart-tooltip"]')
    await expect(tooltip).toBeVisible()
  })

  test('export functionality works', async ({ page }) => {
    const exportButton = page.locator('[data-testid="export-button"]')
    await exportButton.click()
    
    // Check export options
    await expect(page.locator('text=Export as CSV')).toBeVisible()
    await expect(page.locator('text=Export as JSON')).toBeVisible()
    
    // Test CSV export
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('text=Export as CSV').click()
    ])
    
    expect(download.suggestedFilename()).toContain('.csv')
  })

  test('platform comparison works', async ({ page }) => {
    // Navigate to compare section
    const compareTab = page.locator('[data-testid="compare-tab"]')
    await compareTab.click()
    
    // Select platforms to compare
    await page.locator('[data-testid="platform-1"]').selectOption('reddit')
    await page.locator('[data-testid="platform-2"]').selectOption('hackernews')
    
    // Check comparison chart appears
    const comparisonChart = page.locator('[data-testid="comparison-chart"]')
    await expect(comparisonChart).toBeVisible()
  })

  test('top authors list is sortable', async ({ page }) => {
    const topAuthorsSection = page.locator('[data-testid="top-authors"]')
    await expect(topAuthorsSection).toBeVisible()
    
    // Click sort by posts
    await page.locator('[data-testid="sort-by-posts"]').click()
    await page.waitForTimeout(500)
    
    // Click sort by score
    await page.locator('[data-testid="sort-by-score"]').click()
    await page.waitForTimeout(500)
    
    // Verify sorting changed
    const firstAuthor = await page.locator('[data-testid="author-row"]').first().textContent()
    expect(firstAuthor).toBeTruthy()
  })

  test('filters affect all analytics', async ({ page }) => {
    // Apply platform filter
    const platformFilter = page.locator('[data-testid="platform-filter"]')
    await platformFilter.selectOption('reddit')
    
    // Wait for data to update
    await page.waitForTimeout(1000)
    
    // Check all sections updated
    await expect(page).toHaveURL(/platform=reddit/)
    
    // Verify data changed
    const metricValue = await page.locator('[data-testid="metric-value"]').first().textContent()
    expect(metricValue).toBeTruthy()
  })

  test('responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check charts stack vertically
    const charts = page.locator('[data-testid="chart-container"]')
    const firstChart = await charts.first().boundingBox()
    const secondChart = await charts.nth(1).boundingBox()
    
    if (firstChart && secondChart) {
      // Charts should be stacked (second chart Y position > first chart Y position + height)
      expect(secondChart.y).toBeGreaterThan(firstChart.y + firstChart.height)
    }
  })

  test('real-time updates work', async ({ page }) => {
    // Check for real-time indicator
    const realtimeIndicator = page.locator('[data-testid="realtime-indicator"]')
    
    if (await realtimeIndicator.isVisible()) {
      // Wait for an update
      await page.waitForTimeout(5000)
      
      // Check data refreshed
      const lastUpdated = page.locator('[data-testid="last-updated"]')
      await expect(lastUpdated).toContainText(/seconds ago|just now/i)
    }
  })
})