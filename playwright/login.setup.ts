import { test } from '@playwright/test'
import { DEV_USER } from '../playwright.config'

test('login', async ({ page }) => {
  await page.goto('api/auth/signin')
  await page.getByRole('button', { name: 'dev user' }).click()

  await page.context().storageState({ path: DEV_USER })
})
