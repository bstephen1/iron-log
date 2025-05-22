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
  eslint: {
    // next lint defaults to only linting ['lib', 'components', 'pages', 'app', 'src']
    dirs: ['lib', 'components', 'pages', 'models', 'scripts'],
  },
  // Note: this currently breaks npx next lint
  // experimental: {
  //   // optimization for dev mode performance.
  //   // Note this will not affect test speed (it's only for the next server)
  //   // See https://nextjs.org/docs/app/guides/package-bundling#optimizing-package-imports
  //   optimizePackageImports: true,
  // },
  pageExtensions: ['page.tsx', 'api.ts'],
}

export default nextConfig
