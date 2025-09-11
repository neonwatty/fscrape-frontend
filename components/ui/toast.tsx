'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 150) // Wait for animation to complete
  }

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  }

  const colors = {
    success: 'bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100',
    error: 'bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100',
    warning: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
    info: 'bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100',
  }

  const iconColors = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto min-w-[300px] max-w-md rounded-lg border shadow-lg transition-all duration-150',
        colors[toast.type],
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('mt-0.5', iconColors[toast.type])}>{icons[toast.type]}</div>
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.description && (
              <p className="mt-1 text-sm opacity-90">{toast.description}</p>
            )}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="mt-2 text-sm font-medium underline hover:no-underline"
              >
                {toast.action.label}
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper hook for toast actions
export function useToastActions() {
  const { addToast } = useToast()
  
  return {
    success: (title: string, description?: string) => {
      addToast({ type: 'success', title, description })
    },
    error: (title: string, description?: string) => {
      addToast({ type: 'error', title, description })
    },
    warning: (title: string, description?: string) => {
      addToast({ type: 'warning', title, description })
    },
    info: (title: string, description?: string) => {
      addToast({ type: 'info', title, description })
    },
  }
}