import { test, expect } from './fixtures'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'

test(`navigates to today's session from home page`, async ({ page }) => {
  await page.goto('/')
  await page.getByText(`Today's log`).click()

  const today = dayjs()

  // mobile and desktop have different labels for the date picker
  // due to mobile not showing the date select button, so mobile conflicts
  // with the previous session picker for copying sessions
  // Desktop: "Date"
  // Mobile: "Choose date, selected date is Apr 23, 2025"
  await expect(
    page.locator(`input[value="${today.format('MM/DD/YYYY')}"]`)
  ).toBeVisible()
  // page.url() is synchronous. To wait for a url use page.waitForUrl().
  expect(page.url().includes(today.format(DATE_FORMAT)))
})

test('navigates home when clicking navbar logo', async ({ page }) => {
  await page.goto('/manage')
  await page.getByRole('heading', { name: 'Iron Log' }).click()

  await expect(page.getByText('Welcome')).toBeVisible()
})
