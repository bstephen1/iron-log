import { test, expect } from '@playwright/test'

test('navigates home when clicking navbar logo', async ({ page }) => {
  await page.goto('/manage')
  await page.getByRole('heading', { name: 'Iron Log' }).click()

  await expect(page.getByText('Welcome')).toBeVisible()
})
