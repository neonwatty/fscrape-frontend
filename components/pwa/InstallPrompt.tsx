'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useServiceWorker } from '@/lib/hooks/useServiceWorker'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)
  const { isSupported, isRegistered, isOnline, isUpdateAvailable, updateServiceWorker } = useServiceWorker()

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if running as installed PWA (iOS)
    if ((window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay if user hasn't dismissed it before
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      const dismissedTime = dismissed ? parseInt(dismissed) : 0
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
      
      if (!dismissed || daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Show update notification when update is available
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdateNotification(true)
    }
  }, [isUpdateAvailable])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      await deferredPrompt.prompt()
      
      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA installed')
        setIsInstalled(true)
      } else {
        console.log('PWA installation dismissed')
        localStorage.setItem('pwa-install-dismissed', Date.now().toString())
      }
      
      setShowPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  const handleUpdate = () => {
    updateServiceWorker()
    setShowUpdateNotification(false)
  }

  // Don't render if not supported or already installed
  if (!isSupported || isInstalled) {
    return null
  }

  return (
    <>
      {/* Install Prompt Banner */}
      {showPrompt && deferredPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
          <Alert className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-2xl">
            <Smartphone className="h-5 w-5" />
            <AlertDescription className="flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-lg mb-1">Install Forum Scraper</h3>
                <p className="text-sm opacity-90">
                  Get the full app experience with offline access and faster loading
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  Not Now
                </Button>
              </div>
            </AlertDescription>
            
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        </div>
      )}

      {/* Update Notification */}
      {showUpdateNotification && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-down">
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="flex flex-col gap-2">
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Update Available
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  A new version of the app is ready to install
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdate}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Update Now
                </Button>
                <Button
                  onClick={() => setShowUpdateNotification(false)}
                  size="sm"
                  variant="ghost"
                >
                  Later
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          <p className="text-sm font-medium">
            You're offline - Some features may be limited
          </p>
        </div>
      )}
    </>
  )
}

// Mini install button for manual trigger
export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  if (isInstalled || !deferredPrompt) {
    return null
  }

  return (
    <Button
      onClick={handleInstall}
      size="sm"
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Install App
    </Button>
  )
}