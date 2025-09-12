import React from 'react'
import { render as rtlRender, RenderOptions, waitFor, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { vi, expect } from 'vitest'

// Create a custom render function that includes providers
export function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    )
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything from RTL
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

// Test data factories
export const createMockPost = (overrides = {}) => ({
  id: '1',
  title: 'Test Post',
  content: 'Test content',
  author: 'TestAuthor',
  source: 'reddit',
  score: 100,
  comments: 50,
  created_utc: 1640995200,
  url: 'https://example.com',
  ...overrides,
})

export const createMockTimeSeriesData = (count = 7) => {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000

  return Array.from({ length: count }, (_, i) => ({
    date: new Date(now - (count - i - 1) * day).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 100) + 50,
    avgScore: Math.floor(Math.random() * 1000) + 100,
    avgComments: Math.floor(Math.random() * 100) + 10,
  }))
}

export const createMockAuthorStats = (overrides = {}) => ({
  author: 'TestAuthor',
  post_count: 10,
  total_score: 1000,
  total_comments: 500,
  avg_score: 100,
  avg_comments: 50,
  ...overrides,
})

// Wait utilities
export const waitForLoadingToFinish = () =>
  waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

// Mock fetch responses
export const mockFetch = (data: any, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as Response)
}
