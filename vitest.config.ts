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
    // Default is false. Keeping false avoids global conflicts with cypress, but has
    // historically had issues with vscode intellisense. Vscode has been flaky in whether
    // it detects it/describe for auto imports, forcing you to manually type in the imports.
    // May be a windows-specific issue. Also only works with the quick fix when typing, never
    // when you press "ctrl+.".
    // To re-enable globals, add "vitest/globals" type to tsconfig.
    globals: false,
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
