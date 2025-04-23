import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // todo: setup parallel workers so we can run multiple browsers.
  // need to manage multiple logins / reset db between tests
  // fullyParallel: true,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : [['list'], ['list']],
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
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
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

      use: { ...devices['iPhone 12'] },
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
