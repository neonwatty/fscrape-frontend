'use client'

import { useState, useEffect } from 'react'
import { SourceSelector, Source } from '@/components/compare/SourceSelector'
import { ComparisonChart, ComparisonData } from '@/components/compare/ComparisonChart'
import { MetricsCard, MetricData } from '@/components/compare/MetricsCard'
import { NormalizedView, NormalizedMetric } from '@/components/compare/NormalizedView'
import { BarChart3, LineChart, TrendingUp, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data generation for demonstration
const generateMockSources = (): Source[] => [
  {
    id: 'reddit-tech',
    name: 'r/technology',
    platform: 'Reddit',
    postCount: 15234,
    dateRange: { start: '2024-01-01', end: '2024-01-31' },
    color: '#FF4500'
  },
  {
    id: 'reddit-prog',
    name: 'r/programming',
    platform: 'Reddit',
    postCount: 12456,
    dateRange: { start: '2024-01-01', end: '2024-01-31' },
    color: '#5296DD'
  },
  {
    id: 'hn-main',
    name: 'HackerNews',
    platform: 'HackerNews',
    postCount: 8932,
    dateRange: { start: '2024-01-01', end: '2024-01-31' },
    color: '#FF6600'
  },
  {
    id: 'reddit-webdev',
    name: 'r/webdev',
    platform: 'Reddit',
    postCount: 10234,
    dateRange: { start: '2024-01-01', end: '2024-01-31' },
    color: '#00D4AA'
  },
  {
    id: 'reddit-ml',
    name: 'r/MachineLearning',
    platform: 'Reddit',
    postCount: 7823,
    dateRange: { start: '2024-01-01', end: '2024-01-31' },
    color: '#8B5CF6'
  }
]

const generateTimeSeriesData = (sources: string[]): ComparisonData[] => {
  const days = 30
  const data: ComparisonData[] = []
  
  for (let i = 0; i < days; i++) {
    const date = new Date(2024, 0, i + 1)
    const dataPoint: ComparisonData = {
      date: date.toISOString().split('T')[0]
    }
    
    sources.forEach(sourceId => {
      dataPoint[sourceId] = Math.floor(Math.random() * 500) + 100
    })
    
    data.push(dataPoint)
  }
  
  return data
}

const generateMetricData = (sources: string[]): MetricData[] => {
  return sources.map(sourceId => ({
    sourceId,
    value: Math.floor(Math.random() * 10000) + 1000,
    change: (Math.random() - 0.5) * 20,
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'neutral' as 'up' | 'down' | 'neutral',
    sparklineData: Array.from({ length: 10 }, () => Math.random() * 100)
  }))
}

const generateNormalizedMetrics = (sources: string[]): NormalizedMetric[] => {
  const rawValues = sources.map(() => Math.floor(Math.random() * 10000) + 1000)
  const min = Math.min(...rawValues)
  const max = Math.max(...rawValues)
  const mean = rawValues.reduce((a, b) => a + b, 0) / rawValues.length
  const stdDev = Math.sqrt(rawValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / rawValues.length)
  
  return sources.map((sourceId, index) => {
    const rawValue = rawValues[index]
    return {
      sourceId,
      rawValue,
      normalizedValue: (rawValue - min) / (max - min),
      percentile: (rawValues.filter(v => v <= rawValue).length / rawValues.length) * 100,
      zScore: (rawValue - mean) / stdDev
    }
  })
}

export default function ComparePage() {
  const [sources] = useState<Source[]>(generateMockSources())
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<ComparisonData[]>([])
  const [metricData, setMetricData] = useState<MetricData[]>([])
  const [normalizedMetrics, setNormalizedMetrics] = useState<NormalizedMetric[]>([])
  const [activeTab, setActiveTab] = useState<'charts' | 'metrics' | 'normalized'>('charts')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'composed'>('line')

  useEffect(() => {
    if (selectedSources.length > 0) {
      setTimeSeriesData(generateTimeSeriesData(selectedSources))
      setMetricData(generateMetricData(selectedSources))
      setNormalizedMetrics(generateNormalizedMetrics(selectedSources))
    }
  }, [selectedSources])

  const selectedSourceObjects = sources.filter(s => selectedSources.includes(s.id))

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Compare Sources</h1>
        <p className="text-muted-foreground">
          Analyze and compare metrics across different platforms and sources
        </p>
      </div>

      {/* Source Selector */}
      <div className="mb-6">
        <SourceSelector
          sources={sources}
          selectedSources={selectedSources}
          onSourcesChange={setSelectedSources}
          maxSources={4}
        />
      </div>

      {selectedSources.length > 0 && (
        <>
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('charts')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 min-h-[44px]',
                'font-medium text-sm transition-colors',
                activeTab === 'charts'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LineChart className="h-4 w-4" />
              Time Series
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 min-h-[44px]',
                'font-medium text-sm transition-colors',
                activeTab === 'metrics'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TrendingUp className="h-4 w-4" />
              Metrics
            </button>
            <button
              onClick={() => setActiveTab('normalized')}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 min-h-[44px]',
                'font-medium text-sm transition-colors',
                activeTab === 'normalized'
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Layers className="h-4 w-4" />
              Normalized
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'charts' && (
            <div className="space-y-6">
              {/* Chart type selector */}
              <div className="flex flex-wrap gap-2">
                {(['line', 'bar', 'area', 'composed'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                      'min-h-[44px]',
                      chartType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    {type === 'composed' ? 'Mixed' : type}
                  </button>
                ))}
              </div>

              <div className="grid gap-6">
                <ComparisonChart
                  data={timeSeriesData}
                  sources={selectedSourceObjects}
                  metric="posts"
                  chartType={chartType}
                  height={400}
                />
                
                <ComparisonChart
                  data={timeSeriesData}
                  sources={selectedSourceObjects}
                  metric="engagement"
                  chartType={chartType}
                  showDualAxis={selectedSources.length > 2}
                  height={400}
                />
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <MetricsCard
                title="Total Posts"
                description="Post volume comparison across sources"
                metrics={metricData}
                sources={selectedSourceObjects}
                showSparkline
                compareMode="absolute"
              />
              
              <MetricsCard
                title="Relative Performance"
                description="Percentage difference from baseline"
                metrics={metricData}
                sources={selectedSourceObjects}
                compareMode="percentage"
                baselineSourceId={selectedSources[0]}
              />
              
              <MetricsCard
                title="Indexed Comparison"
                description="All sources indexed to baseline (100)"
                metrics={metricData}
                sources={selectedSourceObjects}
                compareMode="indexed"
                baselineSourceId={selectedSources[0]}
              />
              
              <MetricsCard
                title="Growth Metrics"
                description="Period-over-period growth rates"
                metrics={metricData}
                sources={selectedSourceObjects}
                format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`}
              />
            </div>
          )}

          {activeTab === 'normalized' && (
            <div className="grid gap-6">
              <NormalizedView
                title="Normalized Comparison"
                metrics={normalizedMetrics}
                sources={selectedSourceObjects}
                showRawValues
              />
            </div>
          )}
        </>
      )}

      {selectedSources.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">No Sources Selected</p>
          <p className="text-muted-foreground">
            Select sources from the dropdown above to start comparing metrics
          </p>
        </div>
      )}
    </div>
  )
}
