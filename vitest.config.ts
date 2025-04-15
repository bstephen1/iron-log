import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// See: https://vitest.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    exclude: ['playwright', 'node_modules'],
    coverage: {
      // json reporters are needed for github action summary report
      reporter: ['text-summary', 'html', 'json-summary', 'json'],
      all: true,
      enabled: true,
      include: ['components', 'lib', 'pages', 'models'],
      // thresholdAutoUpdate: true,
      // branches: 77.48,
      // functions: 45.13,
      // lines: 31.5,
      // statements: 31.5,
    },
    // Unlike jest, vitest has the option to not globally import describe/it etc keywords.
    // This is desireable to avoid conflicts with other testing libraries we may use (eg e2e tests).
    // However, disabling this causes two major issues with no easily traceable cause or solution:
    // - vscode can only sometimes detect vitest package to auto import keywords, so you have to manually type in imports
    // - tests start failing because apparently server.resetHandlers() stops being called before each test for unknown reasons
    // In light of these issues we've opted to keep globals enabled.
    globals: true,
    // happy-dom? Supposed to be faster, but seems to not work well with mui components
    environment: 'jsdom',
    // environmentMatchGlobs: [
    //   ['*.tsx', 'jsdom'],
    //   ['*.ts', 'node'],
    // ],
    setupFiles: 'vitest.setup.ts',
    restoreMocks: true,
  },
})
