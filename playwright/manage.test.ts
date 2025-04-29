import { expect, test } from './fixtures'

test('adds an exercise', async ({ page }) => {
  // should default to exercise tab
  await page.goto('/manage')

  // add an exercise
  await page.getByLabel('Exercise').fill('squats')
  await page.getByText('Add "squats"').click()

  // -----------
  // EDIT FIELDS
  // -----------

  // note: fill clears existing text in the input
  const newName = 'SSB squats'
  await page.getByLabel('Name').fill(newName)
  await page.getByRole('button', { name: 'Submit' }).click()
  // name change should immediately update name/exercise inputs and url
  await expect(page.getByLabel('Exercise')).toHaveValue(newName)
  await expect(page.getByLabel('Name')).toHaveValue(newName)
  await expect(page).toHaveURL(/SSB\+squats/)

  await page.getByText('Active').click()
  await page.getByText('Archived').click()

  await page.getByLabel('Equipment weight').fill('7.5')

  await page.getByText('Bodyweight').click()

  await page.getByPlaceholder('Add note').fill('my note')
  await page.getByRole('button', { name: 'Confirm' }).click()

  // confirm edits persist on reload
  await page.reload()

  await expect(page.getByLabel('Exercise')).toHaveValue(newName, {
    // reload seems to frequently be the cause of test timeouts
    timeout: 15_000,
  })
  await expect(page.getByLabel('Name')).toHaveValue(newName)
  await expect(page.getByText('Archived')).toBeVisible()
  await expect(page.getByLabel('Equipment weight')).toHaveValue('7.5')
  await expect(page.getByLabel('Bodyweight')).toBeChecked()
  await expect(page.getByText('my note')).toBeVisible()
})
