'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MobileNav } from './MobileNav'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Posts', href: '/posts' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Compare', href: '/compare' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <MobileNav />
            <Link href="/" className="text-lg sm:text-xl font-bold">
              fscrape
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground">Data Explorer v1.0</span>
          </div>
        </div>
      </div>
    </header>
  )
}
