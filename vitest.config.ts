import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  root: './',
  test: {
    coverage: {
      reporter: ['text-summary', 'html'],
      all: true,
      // skipFull: true, // only works for 'text'
      enabled: true,
      include: ['components', 'lib', 'pages', 'models'],
      // exclude: ['cypress', '.next', 'styles', 'msw-mocks'],
      thresholdAutoUpdate: true,
      // branches: 0,
      // functions: 0,
      // lines: 0,
      // statements: 0,
    },
    // todo: turn off globals to avoid conflict with cypress
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
