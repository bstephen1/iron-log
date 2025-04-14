import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const DEV_USER = path.join(__dirname, 'playwright/.cache/devUser.json')
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : [['list'], ['html']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'http://localhost:7357',
    /** For CI. Local tests can use --ui to automatically create traces.
     *  Traces show a ui view of what made the test fail.
     *  See https://playwright.dev/docs/trace-viewer
     */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: DEV_USER,
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    {
      name: 'Mobile Safari',
      dependencies: ['setup'],

      use: { ...devices['iPhone 12'], storageState: DEV_USER },
    },
    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:7357',
    reuseExistingServer: !process.env.CI,
  },
})
