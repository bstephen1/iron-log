import { test, expect } from './fixtures'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'

test(`navigates to today's session from home page`, async ({ page }) => {
  await page.goto('/')
  await page.getByText(`Today's log`).click()

  const today = dayjs()

  // DatePicker input splits MM DD and YYYY into separate spans in the input,
  // but getByText can combine them all together
  await expect(page.getByText(today.format('MM/DD/YYYY'))).toBeVisible()
  // page.url() is synchronous. To wait for a url use page.waitForUrl().
  expect(page.url().includes(today.format(DATE_FORMAT)))
})

test('navigates home when clicking navbar logo', async ({ page }) => {
  await page.goto('/manage')
  await page.getByRole('heading', { name: 'Iron Log' }).click()

  await expect(page.getByText('Welcome')).toBeVisible()
})
