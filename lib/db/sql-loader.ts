import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'

let db: Database | null = null
let sqliteInitialized = false

export async function initializeDatabase(databasePath?: string): Promise<Database> {
  if (db) {
    return db
  }

  try {
    // Initialize sql.js with wasm file
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    })

    // Default database path
    const dbPath = databasePath || '/fscrape.db'

    // Fetch the database file
    const response = await fetch(dbPath)
    if (!response.ok) {
      throw new Error(`Failed to load database from ${dbPath}: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const data = new Uint8Array(buffer)

    // Create database instance
    db = new SQL.Database(data)
    sqliteInitialized = true

    console.log('Database initialized successfully')
    return db
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw new Error(
      `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

export function isDatabaseInitialized(): boolean {
  return sqliteInitialized && db !== null
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
    sqliteInitialized = false
  }
}

// Execute a query and return results
export function executeQuery<T = any>(sql: string, params: any[] = []): T[] {
  const database = getDatabase()
  const stmt = database.prepare(sql)
  stmt.bind(params)

  const results: T[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject()
    results.push(row as T)
  }

  stmt.free()
  return results
}

// Execute a query and return the first result
export function executeQueryFirst<T = any>(sql: string, params: any[] = []): T | null {
  const results = executeQuery<T>(sql, params)
  return results.length > 0 ? results[0] : null
}

// Get database statistics
export function getDatabaseStats() {
  if (!isDatabaseInitialized()) {
    return null
  }

  try {
    const totalPosts = executeQueryFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM forum_posts'
    )

    const platforms = executeQuery<{ platform: string; count: number }>(
      'SELECT platform, COUNT(*) as count FROM forum_posts GROUP BY platform'
    )

    const lastScraped = executeQueryFirst<{ last_scraped: string }>(
      'SELECT MAX(scraped_at) as last_scraped FROM forum_posts'
    )

    return {
      totalPosts: totalPosts?.count || 0,
      platforms,
      lastScraped: lastScraped?.last_scraped || null,
      isInitialized: true,
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    return null
  }
}
