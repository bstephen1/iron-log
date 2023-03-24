/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.experiments.topLevelAwait = true
    return config
  },
  pageExtensions: ['page.tsx', 'api.ts'],
}

module.exports = nextConfig
