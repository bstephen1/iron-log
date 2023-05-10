import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  root: './',
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text-summary', 'html'],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
  },
})