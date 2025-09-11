import type { Metadata, Viewport } from 'next'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { FadeTransition } from '@/components/layout/PageTransition'
import { ThemeProvider, ThemeScript } from '@/components/providers/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'fscrape Frontend',
  description: 'Data visualization and exploration for scraped forum posts',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'fscrape',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased touch-manipulation">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="fscrape-theme"
        >
          <Header />
          <main className="min-h-screen bg-background pb-20 md:pb-0">
            <FadeTransition>
              {children}
            </FadeTransition>
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
