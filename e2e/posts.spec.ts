import { test, expect } from '@playwright/test'

test.describe('Posts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts')
  })

  test('displays posts list', async ({ page }) => {
    // Wait for posts to load
    await page.waitForSelector('[data-testid="post-card"]', { timeout: 10000 })
    
    const posts = page.locator('[data-testid="post-card"]')
    const count = await posts.count()
    expect(count).toBeGreaterThan(0)
  })

  test('search functionality works', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.fill('test search')
    await searchInput.press('Enter')
    
    // Wait for search results
    await page.waitForTimeout(1000)
    
    // Check URL updated with search query
    await expect(page).toHaveURL(/search=test\+search/)
  })

  test('filters can be applied', async ({ page }) => {
    // Open filters
    const filterButton = page.locator('[data-testid="filter-button"]')
    await filterButton.click()
    
    // Select a filter option
    const platformFilter = page.locator('[data-testid="platform-filter"]')
    await platformFilter.selectOption('reddit')
    
    // Apply filters
    const applyButton = page.locator('text=Apply Filters')
    await applyButton.click()
    
    // Check URL updated
    await expect(page).toHaveURL(/platform=reddit/)
  })

  test('sorting options work', async ({ page }) => {
    const sortDropdown = page.locator('[data-testid="sort-dropdown"]')
    await sortDropdown.click()
    
    // Select sort by score
    await page.locator('text=Score (High to Low)').click()
    
    // Wait for re-sort
    await page.waitForTimeout(500)
    
    // Check posts are sorted (get first two scores and compare)
    const scores = await page.locator('[data-testid="post-score"]').allTextContents()
    if (scores.length >= 2) {
      const firstScore = parseInt(scores[0].replace(/[^0-9]/g, ''))
      const secondScore = parseInt(scores[1].replace(/[^0-9]/g, ''))
      expect(firstScore).toBeGreaterThanOrEqual(secondScore)
    }
  })

  test('pagination works', async ({ page }) => {
    // Check if pagination exists
    const pagination = page.locator('[data-testid="pagination"]')
    const paginationExists = await pagination.isVisible()
    
    if (paginationExists) {
      // Click next page
      const nextButton = page.locator('[data-testid="next-page"]')
      await nextButton.click()
      
      // Check URL updated
      await expect(page).toHaveURL(/page=2/)
      
      // Check new posts loaded
      await page.waitForSelector('[data-testid="post-card"]')
    }
  })

  test('post details can be viewed', async ({ page }) => {
    // Click on first post
    const firstPost = page.locator('[data-testid="post-card"]').first()
    await firstPost.click()
    
    // Check modal or detail view opens
    const postDetail = page.locator('[data-testid="post-detail"]')
    await expect(postDetail).toBeVisible()
    
    // Check details are displayed
    await expect(page.locator('[data-testid="post-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
    await expect(page.locator('[data-testid="post-author"]')).toBeVisible()
  })

  test('infinite scroll loads more posts', async ({ page }) => {
    // Get initial post count
    const initialPosts = await page.locator('[data-testid="post-card"]').count()
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Wait for more posts to load
    await page.waitForTimeout(2000)
    
    // Check more posts loaded
    const newPosts = await page.locator('[data-testid="post-card"]').count()
    expect(newPosts).toBeGreaterThan(initialPosts)
  })

  test('empty state is shown when no posts', async ({ page }) => {
    // Apply impossible filter
    await page.goto('/posts?search=xyzabc123impossible')
    
    // Check empty state
    const emptyState = page.locator('[data-testid="empty-state"]')
    await expect(emptyState).toBeVisible()
    await expect(page.locator('text=No posts found')).toBeVisible()
  })

  test('loading state is shown', async ({ page }) => {
    // Navigate with network throttling
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 1000)
    })
    
    await page.goto('/posts')
    
    // Check loading state
    const loadingState = page.locator('[data-testid="loading-state"]')
    await expect(loadingState).toBeVisible()
  })

  test('error state handles failures gracefully', async ({ page }) => {
    // Block API calls to simulate error
    await page.route('**/api/**', route => route.abort())
    
    await page.goto('/posts')
    
    // Check error state
    const errorState = page.locator('[data-testid="error-state"]')
    await expect(errorState).toBeVisible()
    
    // Check retry button
    const retryButton = page.locator('text=Try Again')
    await expect(retryButton).toBeVisible()
  })
})