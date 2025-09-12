'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { PerformanceMonitor, collectWebVitals } from '@/lib/performance-monitor'

interface PerformanceData {
  renderTime: number
  updateCount: number
  lastUpdateTime: number
  averageUpdateTime: number
  memoryUsage?: number
}

interface WebVitalsData {
  ttfb?: number
  fcp?: number
  lcp?: number
  fid?: number
  cls?: number
}

export function usePerformanceMonitor(componentName: string) {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    renderTime: 0,
    updateCount: 0,
    lastUpdateTime: 0,
    averageUpdateTime: 0,
  })

  const [webVitals, setWebVitals] = useState<WebVitalsData>({})
  const renderStartTime = useRef<number>(0)
  const updateTimes = useRef<number[]>([])
  const monitorRef = useRef<PerformanceMonitor | null>(null)

  useEffect(() => {
    renderStartTime.current = performance.now()

    // Initialize performance monitor
    if (typeof window !== 'undefined') {
      monitorRef.current = new PerformanceMonitor()

      // Collect web vitals
      collectWebVitals((metrics) => {
        setWebVitals({
          ttfb: metrics.ttfb,
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          fid: metrics.fid,
          cls: metrics.cls,
        })
      })
    }

    return () => {
      if (monitorRef.current) {
        monitorRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    const renderEndTime = performance.now()
    const renderTime = renderEndTime - renderStartTime.current

    updateTimes.current.push(renderTime)

    // Keep only last 10 measurements
    if (updateTimes.current.length > 10) {
      updateTimes.current.shift()
    }

    const averageUpdateTime =
      updateTimes.current.reduce((a, b) => a + b, 0) / updateTimes.current.length

    // Get memory usage if available
    let memoryUsage: number | undefined
    if ('memory' in performance) {
      memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576
    }

    setPerformanceData((prev) => ({
      renderTime: prev.updateCount === 0 ? renderTime : prev.renderTime,
      updateCount: prev.updateCount + 1,
      lastUpdateTime: renderTime,
      averageUpdateTime,
      memoryUsage,
    }))

    // Log performance in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(`[${componentName}] Slow render detected: ${renderTime.toFixed(2)}ms`)
    }

    renderStartTime.current = performance.now()
  })

  const logPerformance = useCallback(() => {
    console.log(`[${componentName}] Performance Data:`, {
      ...performanceData,
      webVitals,
      bundleSize: monitorRef.current?.getBundleSize(),
    })
  }, [componentName, performanceData, webVitals])

  return {
    performanceData,
    webVitals,
    logPerformance,
  }
}

// Hook for monitoring render performance
export function useRenderMonitor(componentName: string, threshold: number = 16) {
  const renderCount = useRef(0)
  const renderStartTime = useRef<number>(0)

  useEffect(() => {
    renderStartTime.current = performance.now()
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current
    renderCount.current++

    if (renderTime > threshold) {
      console.warn(
        `[${componentName}] Slow render #${renderCount.current}: ${renderTime.toFixed(2)}ms`
      )
    }

    if (process.env.NODE_ENV === 'development') {
      // Track unnecessary re-renders
      if (renderCount.current > 10) {
        console.warn(`[${componentName}] High render count: ${renderCount.current} renders`)
      }
    }
  })

  return {
    renderCount: renderCount.current,
    lastRenderTime: performance.now() - renderStartTime.current,
  }
}

// Hook for lazy loading with performance tracking
export function useLazyLoadWithTracking<T>(importFn: () => Promise<T>, componentName: string) {
  const [module, setModule] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const loadStartTime = useRef<number>(0)

  const load = useCallback(async () => {
    if (module || loading) return

    setLoading(true)
    loadStartTime.current = performance.now()

    try {
      const imported = await importFn()
      const loadTime = performance.now() - loadStartTime.current

      if (process.env.NODE_ENV === 'development') {
        console.log(`[${componentName}] Lazy loaded in ${loadTime.toFixed(2)}ms`)
      }

      setModule(imported)
    } catch (err) {
      setError(err as Error)
      console.error(`[${componentName}] Failed to lazy load:`, err)
    } finally {
      setLoading(false)
    }
  }, [module, loading, importFn, componentName])

  useEffect(() => {
    // Auto-load if IntersectionObserver is not available
    if (!('IntersectionObserver' in window)) {
      load()
    }
  }, [load])

  return { module, loading, error, load }
}

// Hook for monitoring component mount/unmount performance
export function useMountMonitor(componentName: string) {
  const mountTime = useRef<number>(0)

  useEffect(() => {
    mountTime.current = performance.now()

    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Mounted`)
    }

    return () => {
      const lifetime = performance.now() - mountTime.current

      if (process.env.NODE_ENV === 'development') {
        console.log(`[${componentName}] Unmounted after ${lifetime.toFixed(2)}ms`)
      }
    }
  }, [componentName])

  return {
    mountTime: mountTime.current,
    lifetime: performance.now() - mountTime.current,
  }
}
