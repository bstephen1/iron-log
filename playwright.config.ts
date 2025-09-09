import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from '@playwright/test'

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
  outputDir: 'playwright/test-results',
  forbidOnly: isCI,
  retries: isCI ? 1 : 1,
  // Runs individual tests in each file in parallel.
  // Has proven to be too unstable to use; causes a lot of flakiness.
  fullyParallel: false,
  timeout: 35_000,
  expect: {
    timeout: 15_000,
  },
  // too many workers cause intense flakiness
  workers: 2,
  // See: https://playwright.dev/docs/test-reporters
  reporter: isCI
    ? 'github'
    : [['list'], ['html', { outputFolder: 'playwright/html-report' }]],
  // Shared settings for all the projects below.
  // See: https://playwright.dev/docs/api/class-testoptions.
  use: {
    baseURL: 'http://localhost:7357',
    // Traces show a ui view of what made the test fail.
    // Local tests can use --ui to automatically create traces.
    //  See: https://playwright.dev/docs/trace-viewer
    trace: isCI ? 'off' : 'retain-on-failure',
    screenshot: isCI ? 'off' : 'only-on-failure',
  },
  projects: localProjects.concat(isCI ? CIProjects : []),
  webServer: {
    command: isCI ? 'npm run start:test' : 'npm run dev:test',
    url: 'http://localhost:7357',
    // NOTE: in dev mode it's much more stable to run the test server separately.
    // Playwright can spin up the server on its own but it frequently causes flakiness.
    reuseExistingServer: !isCI,
  },
})
