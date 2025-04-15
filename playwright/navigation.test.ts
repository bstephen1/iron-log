import { test, expect } from '@playwright/test'
import dayjs from 'dayjs'
import { DATE_FORMAT } from '../lib/frontend/constants'

test(`navigates to today's session from home page`, async ({ page }) => {
  await page.goto('/')
  await page.getByText(`Today's log`).click()

  const today = dayjs()

  await expect(page.getByRole('textbox', { name: 'Date' })).toHaveValue(
    today.format('MM/DD/YYYY')
  )
  expect(page.url().includes(today.format(DATE_FORMAT)))
})

test('navigates home when clicking navbar logo', async ({ page }) => {
  await page.goto('/manage')
  await page.getByRole('heading', { name: 'Iron Log' }).click()

  await expect(page.getByText('Welcome')).toBeVisible()
})
