/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/fscrape-frontend' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fscrape-frontend' : '',
}

export default nextConfig
