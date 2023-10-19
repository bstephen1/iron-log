import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// See: https://vitest.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    coverage: {
      reporter: ['html'],
      all: true,
      enabled: true,
      include: ['components', 'lib', 'pages', 'models'],
      // thresholdAutoUpdate: true,
      // branches: 77.48,
      // functions: 45.13,
      // lines: 31.5,
      // statements: 31.5,
    },
    // todo: turn off globals to avoid conflict with cypress
    // non-global should work currently, but vscode can't consistently detect vitest imports,
    // so all test files would need to manually manage any vitest imports
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
