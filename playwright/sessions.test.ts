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

test('loads calendar', async ({ page, sessionsPage }) => {
  // add records (broswer stays on the last page)
  await sessionsPage.addRecord('squats', '2000-01-01')
  await sessionsPage.addRecord('squats', '2000-01-05')

  // open date picker
  await page.getByLabel('selected date is Jan 5').click()

  // confirm the populated sessions have badges
  await expect(page.getByLabel('2000-01-01, Session data exists')).toBeVisible()
  await expect(page.getByLabel('2000-01-05, Session data exists')).toBeVisible()
  // and other dates do not
  await expect(page.getByLabel('2000-01-22, No session data')).toBeVisible()
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
