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
      branches: 71.87,
      functions: 37.98,
      lines: 25.58,
      statements: 25.58,
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
