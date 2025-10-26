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
    restoreMocks: true,
    unstubEnvs: true,
    coverage: {
      // enable coverage
      enabled: true,
      // json reporters are needed for github action summary report
      reporter: ['text-summary', 'html', 'json-summary', 'json'],
      include: ['components', 'lib', 'app', 'models'],
      // thresholdAutoUpdate: true,
      // branches: 77.48,
      // functions: 45.13,
      // lines: 31.5,
      // statements: 31.5,
    },
  },
})
