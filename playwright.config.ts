import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test'

/** limited project list to run locally  */
const localProjects: PlaywrightTestConfig['projects'] = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
    },
  },
  {
    name: 'Mobile Safari',

    use: { ...devices['iPhone 12'] },
  },
]

/** extra projects to run in CI */
const CIProjects: PlaywrightTestConfig['projects'] = [
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  },
]

const isCI = !!process.env.CI

// See: https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './playwright',
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  // this runs individual tests in each file in parallel, which is causing
  // test failures due to hitting the db simultaneously
  fullyParallel: false,
  // Opt out of parallel tests on CI for more reliability / avoid concurrency issues
  workers: isCI ? 1 : undefined,
  // See: https://playwright.dev/docs/test-reporters
  reporter: isCI ? 'github' : [['list'], ['html']],
  // Shared settings for all the projects below.
  // See: https://playwright.dev/docs/api/class-testoptions.
  use: {
    baseURL: 'http://localhost:7357',
    // For CI. Local tests can use --ui to automatically create traces.
    // Traces show a ui view of what made the test fail.
    //  See: https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: localProjects.concat(isCI ? CIProjects : []),
  webServer: {
    command: 'npm run dev:test',
    url: 'http://localhost:7357',
    reuseExistingServer: !isCI,
  },
})
