// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: () => [],
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock fetch
global.fetch = jest.fn()

// Mock SQL.js database
jest.mock('sql.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    Database: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
      exec: jest.fn().mockReturnValue([{ values: [] }]),
      prepare: jest.fn().mockReturnValue({
        bind: jest.fn(),
        step: jest.fn(),
        getAsObject: jest.fn(),
        free: jest.fn(),
      }),
      close: jest.fn(),
    })),
  }),
}))

// Mock database context
jest.mock('@/lib/db/database-context', () => ({
  useDatabase: jest.fn(() => ({
    isInitialized: true,
    db: {
      run: jest.fn(),
      exec: jest.fn(),
      prepare: jest.fn(),
    },
    error: null,
    loading: false,
  })),
  DatabaseProvider: ({ children }) => children,
}))

// Setup environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})
