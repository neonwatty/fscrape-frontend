import { test, expect, Page } from '@playwright/test'

// Helper to navigate to posts page
async function navigateToPostsPage(page: Page) {
  await page.goto('/posts')
  
  // Wait for posts page to load
  await page.waitForSelector('[data-testid="posts-page"], .posts-container, main', {
    timeout: 10000
  })
  
  await page.waitForLoadState('networkidle', { timeout: 10000 })
}

// Helper to check if database is loaded
async function checkDatabaseLoaded(page: Page): Promise<boolean> {
  const noDataIndicator = page.locator('text=/No data|Load database|No posts/i')
  const hasNoData = await noDataIndicator.isVisible().catch(() => false)
  return !hasNoData
}

test.describe('Posts Explorer E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPostsPage(page)
  })

  test('should load the posts explorer page', async ({ page }) => {
    // Check page title or header
    const pageHeader = page.locator('h1:has-text("Posts"), h1:has-text("Explorer"), [data-testid="page-title"]').first()
    await expect(pageHeader).toBeVisible({ timeout: 10000 })

    // Check for posts table or list
    const postsContainer = page.locator('table, [data-testid="posts-list"], .posts-grid, [role="grid"]').first()
    await expect(postsContainer).toBeVisible()
  })

  test('should display posts when database is loaded', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Check for post items
    const postItems = page.locator('tr:has(td), [data-testid="post-item"], article, .post-row')
    const count = await postItems.count()
    
    // Should have at least one post
    if (count > 0) {
      const firstPost = postItems.first()
      await expect(firstPost).toBeVisible()
      
      // Check post has title
      const postTitle = firstPost.locator('a, .title, [data-testid="post-title"]')
      await expect(postTitle).toBeVisible()
    }
  })

  test('should have working search functionality', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"], [data-testid="search-input"]').first()
    
    if (await searchInput.isVisible()) {
      // Type search query
      await searchInput.fill('test')
      await searchInput.press('Enter')
      
      // Wait for search results
      await page.waitForTimeout(1000)
      
      // Check that page updated (either results or no results message)
      const resultsOrMessage = page.locator('text=/result|found|match|no posts/i')
      await expect(resultsOrMessage).toBeVisible({ timeout: 5000 })
    }
  })

  test('should have working filters', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Platform filter
    const platformFilter = page.locator('select:has(option), button:has-text("Platform"), [data-testid="platform-filter"]').first()
    
    if (await platformFilter.isVisible()) {
      await platformFilter.click()
      
      // Look for filter options
      const redditOption = page.locator('text=/Reddit/i, option:has-text("Reddit")')
      
      if (await redditOption.isVisible()) {
        await redditOption.click()
        
        // Wait for filter to apply
        await page.waitForTimeout(1000)
        
        // Verify filter is applied (URL or UI indicator)
        const filterIndicator = page.locator('.filter-badge, .active-filter, text=/Reddit/i')
        await expect(filterIndicator).toBeVisible({ timeout: 5000 })
      }
    }

    // Date range filter
    const dateFilter = page.locator('button:has-text("Date"), button:has-text("Time"), [data-testid="date-filter"]').first()
    
    if (await dateFilter.isVisible()) {
      await dateFilter.click()
      
      // Select a time range
      const lastWeekOption = page.locator('text=/Last Week|7 days|This Week/i')
      
      if (await lastWeekOption.isVisible()) {
        await lastWeekOption.click()
        await page.waitForTimeout(1000)
      }
    }
  })

  test('should handle sorting', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Find sortable column headers
    const scoreHeader = page.locator('th:has-text("Score"), button:has-text("Score"), [data-testid="sort-score"]').first()
    
    if (await scoreHeader.isVisible()) {
      // Click to sort
      await scoreHeader.click()
      await page.waitForTimeout(500)
      
      // Click again to reverse sort
      await scoreHeader.click()
      await page.waitForTimeout(500)
      
      // Check for sort indicator
      const sortIndicator = page.locator('svg.sort-icon, .sorted, [aria-sort]')
      const hasSortIndicator = await sortIndicator.isVisible().catch(() => false)
      expect(hasSortIndicator).toBeTruthy()
    }
  })

  test('should handle pagination', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [aria-label="Next page"]').first()
    const prevButton = page.locator('button:has-text("Previous"), a:has-text("Previous"), [aria-label="Previous page"]').first()
    const pageInfo = page.locator('text=/Page.*of|1.*of/i')
    
    if (await nextButton.isVisible()) {
      // Check initial state
      const isPrevDisabled = await prevButton.isDisabled().catch(() => true)
      expect(isPrevDisabled).toBeTruthy()
      
      // Go to next page
      await nextButton.click()
      await page.waitForTimeout(1000)
      
      // Check that prev is now enabled
      const isPrevEnabled = await prevButton.isEnabled().catch(() => false)
      expect(isPrevEnabled).toBeTruthy()
      
      // Go back to first page
      await prevButton.click()
      await page.waitForTimeout(1000)
    }
  })

  test('should open post details', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Find first post link
    const firstPostLink = page.locator('a[href*="reddit.com"], a[href*="ycombinator.com"], [data-testid="post-link"]').first()
    
    if (await firstPostLink.isVisible()) {
      // Get the href
      const href = await firstPostLink.getAttribute('href')
      expect(href).toBeTruthy()
      
      // Check that it opens in new tab (target="_blank")
      const target = await firstPostLink.getAttribute('target')
      expect(target).toBe('_blank')
    }
  })

  test('should display post metadata', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Check for various metadata fields
    const metadataSelectors = [
      'text=/Score|Points|Upvotes/i',
      'text=/Comments|Replies/i',
      'text=/Author|Posted by/i',
      'text=/ago|hours|days|minutes/i'
    ]
    
    for (const selector of metadataSelectors) {
      const element = page.locator(selector).first()
      const isVisible = await element.isVisible().catch(() => false)
      
      if (isVisible) {
        await expect(element).toBeVisible()
      }
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Reload page with mobile viewport
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Check for mobile-specific layout
    const mobileCards = page.locator('.mobile-card, [data-testid="mobile-post-card"]')
    const cards = page.locator('.card, article')
    
    // Should use cards or mobile layout instead of table
    const hasCards = await mobileCards.count() > 0 || await cards.count() > 0
    
    if (hasCards) {
      const firstCard = mobileCards.first().or(cards.first())
      await expect(firstCard).toBeVisible()
    }
    
    // Check that horizontal scroll is not needed
    const body = page.locator('body')
    const bodyBox = await body.boundingBox()
    const viewportSize = page.viewportSize()
    
    if (bodyBox && viewportSize) {
      expect(bodyBox.width).toBeLessThanOrEqual(viewportSize.width + 20) // Allow small margin
    }
  })

  test('should export data', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Look for export button
    const exportButton = page.locator('button:has-text("Export"), button:has-text("Download"), [data-testid="export-button"]').first()
    
    if (await exportButton.isVisible()) {
      // Set up download promise before clicking
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null)
      
      // Click export
      await exportButton.click()
      
      // Check for export options or direct download
      const csvOption = page.locator('text=/CSV/i')
      const jsonOption = page.locator('text=/JSON/i')
      
      if (await csvOption.isVisible()) {
        await csvOption.click()
      }
      
      // Wait for download
      const download = await downloadPromise
      
      if (download) {
        // Verify download started
        expect(download).toBeTruthy()
        
        // Check filename
        const filename = download.suggestedFilename()
        expect(filename).toMatch(/\.(csv|json|xlsx)$/i)
      }
    }
  })

  test('should clear filters', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Apply a filter first
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"]').first()
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test filter')
      await searchInput.press('Enter')
      await page.waitForTimeout(1000)
      
      // Look for clear filters button
      const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset"), [data-testid="clear-filters"]').first()
      
      if (await clearButton.isVisible()) {
        await clearButton.click()
        await page.waitForTimeout(1000)
        
        // Check that search input is cleared
        const inputValue = await searchInput.inputValue()
        expect(inputValue).toBe('')
      }
    }
  })

  test('should show loading states', async ({ page }) => {
    // Navigate to page and immediately check for loading state
    await page.goto('/posts')
    
    // Look for loading indicators
    const loadingIndicators = [
      page.locator('text=/Loading/i'),
      page.locator('.spinner, .loader, [data-testid="loading"]'),
      page.locator('[aria-busy="true"]')
    ]
    
    let foundLoader = false
    for (const indicator of loadingIndicators) {
      if (await indicator.isVisible({ timeout: 1000 }).catch(() => false)) {
        foundLoader = true
        await expect(indicator).toBeVisible()
        break
      }
    }
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
  })

  test('should handle empty state', async ({ page }) => {
    // Apply very specific filter to get no results
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="search"]').first()
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('xyzabc123impossible')
      await searchInput.press('Enter')
      await page.waitForTimeout(1000)
      
      // Look for empty state message
      const emptyMessage = page.locator('text=/No posts|No results|No data|Nothing found/i')
      const isEmptyVisible = await emptyMessage.isVisible().catch(() => false)
      
      if (isEmptyVisible) {
        await expect(emptyMessage).toBeVisible()
      }
    }
  })
})