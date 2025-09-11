import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Static export configuration
  trailingSlash: true,
  distDir: '.next',
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // GitHub Pages deployment paths
  basePath: process.env.NODE_ENV === 'production' ? '/fscrape-frontend' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fscrape-frontend' : '',
  
  // Optimize package imports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['recharts', 'react-window', 'date-fns', '@radix-ui/react-*'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    
    // Production optimizations
    if (!dev) {
      // Split chunks more aggressively
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunks
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return module.size() > 160000 &&
                  /node_modules[\\/]/.test(module.identifier())
              },
              name(module) {
                const hash = require('crypto').createHash('sha1')
                hash.update(module.identifier())
                return hash.digest('hex').substring(0, 8)
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                return `shared-${require('crypto')
                  .createHash('sha1')
                  .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                  .digest('hex')
                  .substring(0, 8)}`
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      }
      
      // Enable module concatenation
      config.optimization.concatenateModules = true
    }
    
    return config
  },
}

export default nextConfig
