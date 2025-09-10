import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'fscrape Frontend',
  description: 'Data visualization and exploration for scraped forum posts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
