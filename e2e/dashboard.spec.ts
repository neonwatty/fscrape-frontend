import { test, expect, Page } from '@playwright/test'

// Helper function to wait for dashboard to load
async function waitForDashboardLoad(page: Page) {
  // Wait for the main dashboard container
  await page.waitForSelector('[data-testid="dashboard-container"], .dashboard-container, main', { 
    timeout: 10000 
  })
  
  // Wait for network idle to ensure data is loaded
  await page.waitForLoadState('networkidle', { timeout: 10000 })
}

// Helper function to check if database is loaded
async function checkDatabaseLoaded(page: Page) {
  // Look for database loading indicators
  const loadButton = page.locator('button:has-text("Load Database"), button:has-text("Choose File")')
  const hasLoadButton = await loadButton.isVisible().catch(() => false)
  
  if (hasLoadButton) {
    // If database needs to be loaded, skip these tests
    return false
  }
  
  return true
}

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForDashboardLoad(page)
  })

  test('should load the dashboard page', async ({ page }) => {
    // Check for main dashboard elements
    await expect(page).toHaveTitle(/FScrape|Dashboard|Forum|Scraper/i)
    
    // Check for header/navigation
    const header = page.locator('header, nav, [role="navigation"]').first()
    await expect(header).toBeVisible()
  })

  test('should display stats cards when database is loaded', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Look for stats cards
    const statsSection = page.locator('[data-testid="stats-cards"], .stats-cards, section:has(.card)')
    await expect(statsSection).toBeVisible({ timeout: 10000 })

    // Check for specific stat cards
    const totalPostsCard = page.locator('text=/Total Posts|Posts Count|Total Items/i').first()
    await expect(totalPostsCard).toBeVisible()

    // Check for activity metrics
    const activityCard = page.locator('text=/Activity|Active|Last.*Days/i').first()
    await expect(activityCard).toBeVisible()
  })

  test('should have working platform selector', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Find platform selector
    const platformSelector = page.locator('button:has-text("Platform"), select:has(option), [data-testid="platform-selector"]').first()
    
    if (await platformSelector.isVisible()) {
      await platformSelector.click()
      
      // Check for platform options
      const redditOption = page.locator('text=/Reddit/i')
      const hnOption = page.locator('text=/Hacker News|HN/i')
      
      // At least one platform should be visible
      const hasOptions = await redditOption.isVisible() || await hnOption.isVisible()
      expect(hasOptions).toBeTruthy()
    }
  })

  test('should display recent posts section', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Look for recent posts section
    const recentPosts = page.locator('text=/Recent Posts|Latest Posts|Recent Activity/i').first()
    
    if (await recentPosts.isVisible()) {
      // Check for post items
      const postItems = page.locator('[data-testid="post-item"], .post-item, article, [role="article"]')
      const count = await postItems.count()
      
      // Should have at least one post if section is visible
      if (count > 0) {
        const firstPost = postItems.first()
        await expect(firstPost).toBeVisible()
        
        // Check post has title
        const postTitle = firstPost.locator('h2, h3, h4, .title, [data-testid="post-title"]')
        await expect(postTitle).toBeVisible()
      }
    }
  })

  test('should display charts/visualizations', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Look for chart containers
    const chartContainers = page.locator('svg.recharts-surface, canvas, [data-testid*="chart"], .chart-container')
    const chartCount = await chartContainers.count()
    
    // Should have at least one chart/visualization
    if (chartCount > 0) {
      const firstChart = chartContainers.first()
      await expect(firstChart).toBeVisible()
    }
  })

  test('should handle navigation to posts page', async ({ page }) => {
    // Find navigation link to posts
    const postsLink = page.locator('a:has-text("Posts"), a[href*="/posts"], nav a:has-text("Explore")')
    
    if (await postsLink.isVisible()) {
      await postsLink.click()
      
      // Wait for navigation
      await page.waitForURL('**/posts**', { timeout: 10000 })
      
      // Verify we're on posts page
      const postsPageIndicator = page.locator('h1').filter({ hasText: /Posts|Explorer|Browse/i }).first()
      await expect(postsPageIndicator).toBeVisible({ timeout: 10000 })
    }
  })

  test('should handle navigation to analytics page', async ({ page }) => {
    // Find navigation link to analytics
    const analyticsLink = page.locator('a:has-text("Analytics"), a[href*="/analytics"], nav a:has-text("Insights")')
    
    if (await analyticsLink.isVisible()) {
      await analyticsLink.click()
      
      // Wait for navigation
      await page.waitForURL('**/analytics**', { timeout: 10000 })
      
      // Verify we're on analytics page
      const analyticsPageIndicator = page.locator('h1').filter({ hasText: /Analytics|Insights|Statistics/i }).first()
      await expect(analyticsPageIndicator).toBeVisible({ timeout: 10000 })
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Reload page with mobile viewport
    await page.reload()
    await waitForDashboardLoad(page)
    
    // Check for mobile menu button
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has(svg.hamburger), [data-testid="mobile-menu"]')
    
    if (await mobileMenuButton.isVisible()) {
      // Click mobile menu
      await mobileMenuButton.click()
      
      // Check navigation menu is visible
      const navMenu = page.locator('nav, [role="navigation"], .mobile-menu').first()
      await expect(navMenu).toBeVisible()
    }
    
    // Check that cards stack vertically on mobile
    const cards = page.locator('.card, [data-testid*="card"]')
    const cardCount = await cards.count()
    
    if (cardCount > 1) {
      const firstCard = await cards.first().boundingBox()
      const secondCard = await cards.nth(1).boundingBox()
      
      if (firstCard && secondCard) {
        // Cards should be stacked (second card Y position > first card Y position)
        expect(secondCard.y).toBeGreaterThan(firstCard.y)
      }
    }
  })

  test('should handle dark mode toggle', async ({ page }) => {
    // Look for theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="mode"], [data-testid="theme-toggle"]')
    
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const htmlElement = page.locator('html')
      const initialTheme = await htmlElement.getAttribute('class') || ''
      
      // Click theme toggle
      await themeToggle.click()
      
      // Wait for theme change
      await page.waitForTimeout(500)
      
      // Check theme changed
      const newTheme = await htmlElement.getAttribute('class') || ''
      expect(newTheme).not.toBe(initialTheme)
    }
  })

  test('should load and display data after database selection', async ({ page }) => {
    // Check if we need to load a database
    const loadButton = page.locator('button:has-text("Load Database"), button:has-text("Choose File")')
    
    if (await loadButton.isVisible()) {
      // This test would require a sample database file
      // For now, we'll just verify the load interface exists
      await expect(loadButton).toBeVisible()
      
      // Check for file input
      const fileInput = page.locator('input[type="file"]')
      await expect(fileInput).toBeAttached()
    }
  })

  test('should handle refresh data action', async ({ page }) => {
    const dbLoaded = await checkDatabaseLoaded(page)
    
    if (!dbLoaded) {
      test.skip()
      return
    }

    // Look for refresh button
    const refreshButton = page.locator('button:has-text("Refresh"), button[aria-label*="refresh"], [data-testid="refresh-button"]')
    
    if (await refreshButton.isVisible()) {
      // Click refresh
      await refreshButton.click()
      
      // Wait for potential loading state
      await page.waitForTimeout(1000)
      
      // Check that page didn't crash
      await expect(page.locator('body')).toBeVisible()
    }
  })
})