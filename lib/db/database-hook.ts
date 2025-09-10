'use client'

import { useEffect, useState } from 'react'
import { Database } from 'sql.js'
import { initializeDatabase, isDatabaseInitialized, closeDatabase } from './sql-loader'

interface UseDatabaseOptions {
  autoLoad?: boolean
  databasePath?: string
}

interface UseDatabaseReturn {
  database: Database | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  loadDatabase: (path?: string) => Promise<void>
  closeDb: () => void
}

export function useDatabaseInitializer(options: UseDatabaseOptions = {}): UseDatabaseReturn {
  const { autoLoad = false, databasePath } = options
  const [database, setDatabase] = useState<Database | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDatabase = async (path?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const db = await initializeDatabase(
        path || databasePath ? { databasePath: path || databasePath } : undefined
      )
      setDatabase(db)
      setIsInitialized(true)
    } catch (err) {
      console.error('Failed to initialize database:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize database')
      setIsInitialized(false)
    } finally {
      setIsLoading(false)
    }
  }

  const closeDb = () => {
    if (isDatabaseInitialized()) {
      closeDatabase()
      setDatabase(null)
      setIsInitialized(false)
    }
  }

  useEffect(() => {
    if (autoLoad && !isInitialized && !isLoading) {
      loadDatabase()
    }

    // Cleanup on unmount
    return () => {
      if (isDatabaseInitialized()) {
        closeDatabase()
      }
    }
  }, [autoLoad])

  return {
    database,
    isLoading,
    isInitialized,
    error,
    loadDatabase,
    closeDb,
  }
}