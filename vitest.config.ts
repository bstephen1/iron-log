import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  root: './',
  test: {
    coverage: {
      provider: 'v8', // default is v8
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
    // import suggestions aren't picking up certain vitest functions (mainly describe / it).
    // If those aren't able to be suggested it will be a huge a pain to manually type out imports
    // for every test file and seems not worth.
    // globals: true,
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
