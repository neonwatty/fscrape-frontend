'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Database } from 'sql.js'
import { initializeDatabase, isDatabaseInitialized, closeDatabase } from './sql-loader'
import type { ForumPost, PlatformStats } from './types'
import { getDatabaseSummary, getPosts } from './queries'

interface DatabaseContextType {
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  database: Database | null
  summary: {
    totalPosts: number
    totalAuthors: number
    dateRange: {
      from: Date | null
      to: Date | null
    }
    platforms: PlatformStats[]
  } | null
  recentPosts: ForumPost[]
  loadDatabase: (path?: string) => Promise<void>
  refreshData: () => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [database, setDatabase] = useState<Database | null>(null)
  const [summary, setSummary] = useState<DatabaseContextType['summary']>(null)
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([])

  const loadDatabase = async (path?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const db = await initializeDatabase(path ? { databasePath: path } : undefined)
      setDatabase(db)
      setIsInitialized(true)

      // Load initial data
      await refreshData()
    } catch (err) {
      console.error('Failed to load database:', err)
      setError(err instanceof Error ? err.message : 'Failed to load database')
      setIsInitialized(false)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    if (!isDatabaseInitialized()) {
      return
    }

    try {
      // Get database summary
      const dbSummary = getDatabaseSummary()
      setSummary(dbSummary)

      // Get recent posts (last 10)
      const posts = getPosts({ limit: 10, sortBy: 'created_utc', sortOrder: 'desc' })
      setRecentPosts(posts)
    } catch (err) {
      console.error('Failed to refresh data:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh data')
    }
  }

  // Clean up database on unmount
  useEffect(() => {
    return () => {
      if (isDatabaseInitialized()) {
        closeDatabase()
      }
    }
  }, [])

  const value: DatabaseContextType = {
    isLoading,
    isInitialized,
    error,
    database,
    summary,
    recentPosts,
    loadDatabase,
    refreshData,
  }

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}