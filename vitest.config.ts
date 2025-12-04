import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// See: https://vitest.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    exclude: ['playwright', 'node_modules'],
    bail: process.env.CI ? 1 : 0,
    reporters: process.env.CI ? ['dot', 'github-actions'] : ['default', 'html'],
    outputFile: {
      html: 'vitest/html/index.html',
    },
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
    // clear mock history, restore each implementation to its original, and restore original descriptors of spied-on objects
    mockReset: true,
    unstubEnvs: true,
    coverage: {
      // enable coverage
      enabled: true,
      // json reporters are needed for github action summary report
      reporter: ['text-summary', 'html', 'json-summary', 'json'],
      include: ['components', 'lib', 'app', 'models'],
      exclude: [
        // swiper components can't really be tested in jsdom. Should use e2e tests instead.
        '**/*Swiper*.tsx',
        '**/swiper/**',
        '**/useNoSwipingDesktop.ts',
        // tested implicitly
        '**/restService.ts',
        // recharts can't be meaningfully tested in vitest.
        // jsdom basically can't render svg graphs at all. There's no
        // way to get any info about the graph state.
        '**/HistoryGraph.tsx',
        // app router files are mostly scaffolding; should only test if actually needed
        '**/page.tsx',
        '**/layout.tsx',
        '**/auth/**',
        // behavior is based on queryState; not testable in jsdom
        '**/app/manage/**',
        '**/models/TabValue.ts',
        // nothing to meaningfully test or cannot test in jsdom
        '**/getQueryClient.ts',
        '**/mongoConnect.ts',
        '**/user.ts',
        '**/LoadingSpinner.tsx',
        '**/ManageWelcomeCard.tsx',
        '**/Layout.tsx',
        '**/Navbar.tsx',
      ],
    },
  },
})
