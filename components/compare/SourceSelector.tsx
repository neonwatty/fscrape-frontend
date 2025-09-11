'use client'

import { useState, useEffect } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Source {
  id: string
  name: string
  platform: string
  postCount: number
  dateRange: {
    start: string
    end: string
  }
  color?: string
}

interface SourceSelectorProps {
  sources: Source[]
  selectedSources: string[]
  onSourcesChange: (sources: string[]) => void
  maxSources?: number
  className?: string
}

export function SourceSelector({
  sources,
  selectedSources,
  onSourcesChange,
  maxSources = 4,
  className
}: SourceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.platform.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSource = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      onSourcesChange(selectedSources.filter(id => id !== sourceId))
    } else if (selectedSources.length < maxSources) {
      onSourcesChange([...selectedSources, sourceId])
    }
  }

  const removeSource = (sourceId: string) => {
    onSourcesChange(selectedSources.filter(id => id !== sourceId))
  }

  const selectedSourceObjects = sources.filter(s => selectedSources.includes(s.id))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.source-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Select Sources to Compare
          <span className="text-muted-foreground ml-2">
            ({selectedSources.length}/{maxSources})
          </span>
        </label>
        
        {/* Selected sources pills */}
        {selectedSourceObjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedSourceObjects.map(source => (
              <div
                key={source.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm"
                style={{
                  backgroundColor: source.color ? `${source.color}20` : undefined,
                  borderLeft: source.color ? `3px solid ${source.color}` : undefined
                }}
              >
                <span className="font-medium">{source.name}</span>
                <span className="text-muted-foreground">({source.platform})</span>
                <button
                  onClick={() => removeSource(source.id)}
                  className="ml-1 hover:bg-background/50 rounded-full p-0.5"
                  aria-label={`Remove ${source.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropdown selector */}
        <div className="source-selector relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2.5',
              'border rounded-lg bg-background',
              'hover:bg-accent/50 transition-colors',
              'min-h-[44px]', // Mobile-friendly touch target
              isOpen && 'ring-2 ring-primary'
            )}
            disabled={selectedSources.length >= maxSources}
          >
            <span className="text-sm">
              {selectedSources.length === 0
                ? 'Select sources...'
                : `${selectedSources.length} source${selectedSources.length > 1 ? 's' : ''} selected`}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-lg border bg-background shadow-lg">
              {/* Search input */}
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Search sources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                  autoFocus
                />
              </div>

              {/* Sources list */}
              <div className="max-h-64 overflow-y-auto">
                {filteredSources.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No sources found
                  </div>
                ) : (
                  filteredSources.map(source => {
                    const isSelected = selectedSources.includes(source.id)
                    const isDisabled = !isSelected && selectedSources.length >= maxSources

                    return (
                      <button
                        key={source.id}
                        onClick={() => !isDisabled && toggleSource(source.id)}
                        disabled={isDisabled}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3',
                          'hover:bg-accent/50 transition-colors text-left',
                          'min-h-[44px]', // Mobile-friendly touch target
                          isSelected && 'bg-primary/10',
                          isDisabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {source.color && (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: source.color }}
                              />
                            )}
                            <span className="font-medium text-sm">{source.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {source.platform}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {source.postCount.toLocaleString()} posts • 
                            {' '}{new Date(source.dateRange.start).toLocaleDateString()} - 
                            {' '}{new Date(source.dateRange.end).toLocaleDateString()}
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {selectedSources.length >= maxSources && (
                <div className="p-2 border-t text-xs text-center text-muted-foreground">
                  Maximum {maxSources} sources can be compared
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}