import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Forum Scraper/)
  })

  test('displays main navigation', async ({ page }) => {
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()

    // Check for main navigation links
    await expect(page.locator('a[href="/"]')).toBeVisible()
    await expect(page.locator('a[href="/posts"]')).toBeVisible()
    await expect(page.locator('a[href="/analytics"]')).toBeVisible()
    await expect(page.locator('a[href="/compare"]')).toBeVisible()
  })

  test('shows dashboard stats cards', async ({ page }) => {
    // Wait for stats to load
    await page.waitForSelector('[data-testid="stats-card"]', { timeout: 10000 })

    const statsCards = page.locator('[data-testid="stats-card"]')
    await expect(statsCards).toHaveCount(4)

    // Check for specific stat labels
    await expect(page.locator('text=Total Posts')).toBeVisible()
    await expect(page.locator('text=Total Authors')).toBeVisible()
    await expect(page.locator('text=Avg Score')).toBeVisible()
    await expect(page.locator('text=Avg Comments')).toBeVisible()
  })

  test('displays trend chart', async ({ page }) => {
    const chart = page.locator('[data-testid="trend-chart"]')
    await expect(chart).toBeVisible()
  })

  test('shows recent posts table', async ({ page }) => {
    const postsTable = page.locator('[data-testid="recent-posts"]')
    await expect(postsTable).toBeVisible()

    // Check for table headers
    await expect(page.locator('text=Title')).toBeVisible()
    await expect(page.locator('text=Author')).toBeVisible()
    await expect(page.locator('text=Score')).toBeVisible()
    await expect(page.locator('text=Comments')).toBeVisible()
  })

  test('theme toggle works', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]')

    // Get initial theme
    const htmlElement = page.locator('html')
    const initialTheme = await htmlElement.getAttribute('class')

    // Click theme toggle
    await themeToggle.click()

    // Check theme changed
    const newTheme = await htmlElement.getAttribute('class')
    expect(newTheme).not.toBe(initialTheme)
  })

  test('platform selector opens and works', async ({ page }) => {
    const platformSelector = page.locator('[data-testid="platform-selector"]')
    await platformSelector.click()

    // Check dropdown is visible
    const dropdown = page.locator('[role="listbox"]')
    await expect(dropdown).toBeVisible()

    // Select a platform
    await page.locator('text=Reddit').click()

    // Check URL updated
    await expect(page).toHaveURL(/platforms=reddit/)
  })

  test('responsive menu works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check mobile menu button is visible
    const menuButton = page.locator('[data-testid="mobile-menu"]')
    await expect(menuButton).toBeVisible()

    // Open menu
    await menuButton.click()

    // Check menu items are visible
    const mobileNav = page.locator('[data-testid="mobile-nav"]')
    await expect(mobileNav).toBeVisible()
  })

  test('loads data without errors', async ({ page }) => {
    // Check for no error messages
    await expect(page.locator('text=Error loading')).not.toBeVisible()
    await expect(page.locator('text=Something went wrong')).not.toBeVisible()

    // Wait for data to load
    await page.waitForLoadState('networkidle')

    // Check data is displayed
    const hasData = await page.locator('[data-testid="data-loaded"]').count()
    expect(hasData).toBeGreaterThan(0)
  })
})
