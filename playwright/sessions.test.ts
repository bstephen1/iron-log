import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'
import { expect, test } from './fixtures'

test('adds bodyweight', async ({ page }) => {
  await page.goto('/sessions/2000-01-01')

  // bodyweight is done loading
  await expect(page.getByText('No existing official weigh-ins')).toBeVisible()

  await page.getByLabel('Bodyweight', { exact: true }).fill('50')
  await page.getByRole('button', { name: 'Submit' }).click()

  // bw has updated
  await expect(page.getByLabel('Bodyweight', { exact: true })).toHaveValue('50')
  await expect(page.getByText('Using latest official weight')).toBeVisible()
})

// The redirect is stored in local storage. This value is set in the settings
// page, but it should redirect by default without first visiting settings
// to set the value.
test.skip(`redirects to today's log if url has no date`, async ({ page }) => {
  await page.goto('/sessions')

  const today = dayjs().format(DATE_FORMAT)
  expect(page.url()).toContain(today)
})
