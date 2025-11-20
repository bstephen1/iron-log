import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from '@playwright/test'

// NOTE: webkit (safari) tests seem to just be inherently slower than
// chrome / firefox. There are multiple github issues remarking on this
// but playwright doesn't even recognize it as an issue. Timing is slow
// for every action so it compounds over especially long tests and can
// lead to timeout failures. It's probably not vital to run on webkit
// so our solution is to just not bother.
// See: https://github.com/microsoft/playwright/issues/18119

/** limited project list to run locally  */
const localProjects: PlaywrightTestConfig['projects'] = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
    },
  },
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  },
]

/** extra projects to run in CI */
const CIProjects: PlaywrightTestConfig['projects'] = [
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
]

const isCI = !!process.env.CI
export const baseURL = 'http://localhost:7357'

// See: https://playwright.dev/docs/test-configuration.
export default defineConfig({
  testDir: './playwright',
  outputDir: 'playwright/test-results',
  forbidOnly: isCI,
  retries: 1,
  // Runs individual tests in each file in parallel.
  // Has proven to be too unstable to use; causes a lot of flakiness.
  fullyParallel: false,
  timeout: 65_000,
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
    baseURL,
    // Traces show a ui view of what made the test fail.
    // Local tests can use --ui to automatically create traces.
    //  See: https://playwright.dev/docs/trace-viewer
    trace: isCI ? 'off' : 'on-first-retry',
    screenshot: isCI ? 'off' : 'on-first-failure',
  },
  projects: localProjects.concat(isCI ? CIProjects : []),
  webServer: {
    command: isCI ? 'npm run start:test' : 'npm run dev:test',
    url: baseURL,
    // NOTE: in dev mode it's much more stable to run the test server separately.
    // Playwright can spin up the server on its own but it frequently causes flakiness.
    reuseExistingServer: !isCI,
  },
})
