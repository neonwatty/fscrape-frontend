/**
 * Test utilities and examples for the LRU Cache implementation
 */

import { LRUCache, generateCacheKey, withCache, getGlobalCache, clearGlobalCache } from './cache'

/**
 * Test cache hits and misses
 */
export function testCacheHitsMisses() {
  console.log('\n=== Testing Cache Hits/Misses ===')
  
  const cache = new LRUCache<string>({
    maxEntries: 3,
    defaultTTL: 1000, // 1 second
    enableStats: true,
  })
  
  // Test misses
  console.log('Getting non-existent key:', cache.get('key1')) // null - miss
  
  // Test setting and hitting
  cache.set('key1', 'value1')
  console.log('Getting existing key:', cache.get('key1')) // value1 - hit
  console.log('Getting existing key again:', cache.get('key1')) // value1 - hit
  
  // Test multiple entries
  cache.set('key2', 'value2')
  cache.set('key3', 'value3')
  
  const stats = cache.getStats()
  console.log('Cache stats:', {
    hits: stats.hits,
    misses: stats.misses,
    hitRate: (stats.hitRate * 100).toFixed(2) + '%',
    entries: stats.entries,
  })
  
  cache.stopCleanupTimer()
  return stats.hits === 2 && stats.misses === 1
}

/**
 * Test TTL expiration
 */
export async function testTTLExpiration() {
  console.log('\n=== Testing TTL Expiration ===')
  
  const cache = new LRUCache<string>({
    defaultTTL: 100, // 100ms
    checkInterval: 50, // Check every 50ms
  })
  
  cache.set('expiring', 'value')
  console.log('Immediately after set:', cache.get('expiring')) // value
  
  // Wait for expiration
  await new Promise(resolve => setTimeout(resolve, 150))
  
  console.log('After TTL expiration:', cache.get('expiring')) // null
  
  const stats = cache.getStats()
  console.log('Entries after expiration:', stats.entries) // 0
  
  cache.stopCleanupTimer()
  return cache.get('expiring') === null
}

/**
 * Test LRU eviction
 */
export function testLRUEviction() {
  console.log('\n=== Testing LRU Eviction ===')
  
  const cache = new LRUCache<string>({
    maxEntries: 3,
    enableStats: true,
  })
  
  // Fill cache to capacity
  cache.set('a', 'valueA')
  cache.set('b', 'valueB')
  cache.set('c', 'valueC')
  
  // Access 'a' and 'b' to make them more recently used
  cache.get('a')
  cache.get('b')
  
  // Add new entry - should evict 'c' (least recently used)
  cache.set('d', 'valueD')
  
  console.log('Has a:', cache.has('a')) // true
  console.log('Has b:', cache.has('b')) // true
  console.log('Has c:', cache.has('c')) // false (evicted)
  console.log('Has d:', cache.has('d')) // true
  
  const stats = cache.getStats()
  console.log('Evictions:', stats.evictions) // 1
  
  cache.stopCleanupTimer()
  return !cache.has('c') && stats.evictions === 1
}

/**
 * Test memory management
 */
export function testMemoryManagement() {
  console.log('\n=== Testing Memory Management ===')
  
  const cache = new LRUCache<any>({
    maxSize: 1024, // 1KB max
    enableStats: true,
  })
  
  // Add small entries
  cache.set('small1', { data: 'a' })
  cache.set('small2', { data: 'b' })
  
  console.log('Size after small entries:', cache.getSizeInfo())
  
  // Try to add large entry
  const largeData = {
    data: 'x'.repeat(500), // ~500 bytes
  }
  cache.set('large', largeData)
  
  const sizeInfo = cache.getSizeInfo()
  console.log('Size after large entry:', {
    used: sizeInfo.used,
    max: sizeInfo.max,
    percentage: sizeInfo.percentage.toFixed(2) + '%',
  })
  
  // Add another large entry - should trigger eviction
  cache.set('large2', largeData)
  
  const finalStats = cache.getStats()
  console.log('Final stats:', {
    entries: finalStats.entries,
    size: finalStats.size,
    evictions: finalStats.evictions,
  })
  
  cache.stopCleanupTimer()
  return sizeInfo.used <= sizeInfo.max
}

/**
 * Test cache key generation
 */
export function testCacheKeyGeneration() {
  console.log('\n=== Testing Cache Key Generation ===')
  
  const key1 = generateCacheKey('getPosts', { limit: 10, offset: 0 })
  const key2 = generateCacheKey('getPosts', { offset: 0, limit: 10 }) // Different order
  const key3 = generateCacheKey('getPosts', { limit: 20, offset: 0 })
  
  console.log('Key 1:', key1)
  console.log('Key 2:', key2)
  console.log('Key 3:', key3)
  console.log('Keys 1 and 2 are equal:', key1 === key2) // true (order doesn't matter)
  console.log('Keys 1 and 3 are different:', key1 !== key3) // true (different params)
  
  return key1 === key2 && key1 !== key3
}

/**
 * Test cache decorator
 */
export function testCacheDecorator() {
  console.log('\n=== Testing Cache Decorator ===')
  
  let callCount = 0
  
  // Original function that tracks calls
  function expensiveOperation(x: number, y: number): number {
    callCount++
    console.log(`Executing expensive operation (call #${callCount})`)
    return x + y
  }
  
  // Wrap with cache
  const cachedOperation = withCache(expensiveOperation, {
    keyGenerator: (x, y) => `add:${x}:${y}`,
    ttl: 1000,
  })
  
  // First call - executes function
  console.log('Result 1:', cachedOperation(2, 3)) // 5
  
  // Second call with same args - uses cache
  console.log('Result 2:', cachedOperation(2, 3)) // 5
  
  // Different args - executes function
  console.log('Result 3:', cachedOperation(3, 4)) // 7
  
  console.log('Total function calls:', callCount) // 2 (not 3)
  
  clearGlobalCache()
  return callCount === 2
}

/**
 * Test cache import/export
 */
export function testCacheImportExport() {
  console.log('\n=== Testing Cache Import/Export ===')
  
  const cache1 = new LRUCache<string>()
  
  // Add data to first cache
  cache1.set('key1', 'value1')
  cache1.set('key2', 'value2')
  cache1.set('key3', 'value3')
  
  // Export data
  const exported = cache1.export()
  console.log('Exported entries:', exported.length)
  
  // Create new cache and import
  const cache2 = new LRUCache<string>()
  cache2.import(exported)
  
  // Verify imported data
  console.log('Imported key1:', cache2.get('key1')) // value1
  console.log('Imported key2:', cache2.get('key2')) // value2
  console.log('Imported key3:', cache2.get('key3')) // value3
  
  const stats = cache2.getStats()
  console.log('Imported cache entries:', stats.entries) // 3
  
  cache1.stopCleanupTimer()
  cache2.stopCleanupTimer()
  
  return stats.entries === 3
}

/**
 * Test cache performance under load
 */
export function testCachePerformance() {
  console.log('\n=== Testing Cache Performance ===')
  
  const cache = new LRUCache<number>({
    maxEntries: 1000,
    maxSize: 1024 * 1024, // 1MB
    enableStats: true,
  })
  
  const startTime = Date.now()
  
  // Add many entries
  for (let i = 0; i < 1000; i++) {
    cache.set(`key${i}`, i)
  }
  
  // Access entries randomly
  for (let i = 0; i < 5000; i++) {
    const key = `key${Math.floor(Math.random() * 1000)}`
    cache.get(key)
  }
  
  const endTime = Date.now()
  const duration = endTime - startTime
  
  const stats = cache.getStats()
  console.log('Performance test results:', {
    duration: `${duration}ms`,
    operations: 6000,
    opsPerSecond: Math.round(6000 / (duration / 1000)),
    hitRate: (stats.hitRate * 100).toFixed(2) + '%',
    entries: stats.entries,
    size: `${(stats.size / 1024).toFixed(2)}KB`,
  })
  
  cache.stopCleanupTimer()
  return duration < 1000 // Should complete in under 1 second
}

/**
 * Run all cache tests
 */
export async function runAllCacheTests() {
  console.log('🧪 Running Cache System Tests...\n')
  
  const results = {
    hitsMisses: testCacheHitsMisses(),
    ttlExpiration: await testTTLExpiration(),
    lruEviction: testLRUEviction(),
    memoryManagement: testMemoryManagement(),
    keyGeneration: testCacheKeyGeneration(),
    decorator: testCacheDecorator(),
    importExport: testCacheImportExport(),
    performance: testCachePerformance(),
  }
  
  console.log('\n📊 Test Results:')
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`  ${passed ? '✅' : '❌'} ${test}`)
  })
  
  const allPassed = Object.values(results).every(r => r)
  console.log(`\n${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`)
  
  return allPassed
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).testCache = {
    runAll: runAllCacheTests,
    testHitsMisses: testCacheHitsMisses,
    testTTLExpiration: testTTLExpiration,
    testLRUEviction: testLRUEviction,
    testMemoryManagement: testMemoryManagement,
    testKeyGeneration: testCacheKeyGeneration,
    testDecorator: testCacheDecorator,
    testImportExport: testCacheImportExport,
    testPerformance: testCachePerformance,
  }
}