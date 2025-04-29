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

// todo: make 2 records and swap between the sessions
test('loads calendar', async ({ page }) => {
  await page.goto('/sessions/2000-01-01')

  // open date picker -- have to specifically click the picker's label.
  // On desktop there is a distinct icon, but on mobile the whole input opens the picker.
  await page.getByLabel('selected date is Jan 1').click()

  // pick an arbitrary date to confirm the calendar is loaded
  await expect(page.getByRole('gridcell', { name: '15' })).toBeVisible()
})

// The redirect is stored in local storage. This value is set in the settings
// page, but it should redirect by default without first visiting settings
// to set the value.
test(`redirects to today's log if url has no date`, async ({ page }) => {
  await page.goto('/sessions')

  await expect(page.getByText('Copy session')).toBeVisible()
})

test(`follows session redirect setting`, async ({ page }) => {
  await page.goto('/settings')

  // disable redirect
  await page.getByLabel('redirect').click()
  await page.getByText('sessions page').click()

  // shows no redirect page
  const enableRedirectButton = page.getByText('enable redirect')
  await expect(enableRedirectButton).toBeVisible()
  await enableRedirectButton.click()

  // redirects
  await expect(page.getByText('Copy session')).toBeVisible()
})
