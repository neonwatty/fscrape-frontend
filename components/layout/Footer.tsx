'use client'

import Link from 'next/link'
import { Github, Twitter, Globe, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Dashboard', href: '/' },
    { name: 'Posts', href: '/posts' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Compare', href: '/compare' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api-docs' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'Status', href: '/status' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
}

const socialLinks = [
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Website', href: '#', icon: Globe },
  { name: 'Email', href: 'mailto:contact@example.com', icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">fscrape</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Comprehensive forum data scraping and analytics platform. 
              Monitor discussions, track trends, and gain insights.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold">Product</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} fscrape. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}