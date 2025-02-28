// This file is required for nextjs projects.
// Typescript is not currently supported. For ESM .mjs is required.
// See: https://nextjs.org/docs/pages/api-reference/next-config-js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments.topLevelAwait = true
    return config
  },
  pageExtensions: ['page.tsx', 'api.ts'],
}

export default nextConfig
