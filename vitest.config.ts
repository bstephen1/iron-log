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
      thresholdAutoUpdate: true,
      include: ['components', 'lib', 'pages', 'models'],
      // exclude: ['cypress', '.next', 'styles', 'msw-mocks'],
    },
    globals: true,
    // happy-dom?
    environment: 'jsdom',
    // environmentMatchGlobs: [
    //   ['*.tsx', 'jsdom'],
    //   ['*.ts', 'node'],
    // ],
    setupFiles: 'vitest.setup.ts',
    restoreMocks: true,
  },
})
