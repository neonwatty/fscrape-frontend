import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'fscrape Frontend',
  description: 'Data visualization and exploration for scraped forum posts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen bg-background">{children}</main>
      </body>
    </html>
  )
}
