import { expect, test } from './fixtures'

test('adds an exercise', async ({ page }) => {
  // should default to exercise tab
  await page.goto('/manage')

  // mui is rendering multiple inputs with the same name or something
  // while it is hydrating so use the first and click to make sure it's loaded
  // (even though fill() is already supposed to wait until it's interactable...)
  await page.getByLabel('Exercise').first().click()
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
  await expect(page).toHaveURL(/exercise=/)

  await page.getByText('Active').click()
  await page.getByText('Archived').click()

  await page.getByLabel('Equipment weight').fill('7.5')

  await page.getByText('Bodyweight').click()

  await page.getByPlaceholder('Add note').fill('my note')
  await page.getByRole('button', { name: 'Confirm' }).click()

  // wait for processing to finish -- reloading while a db save is in progress
  // will abort it
  // NOTE: Should fix the underlying issue that reloading aborts saving data
  // reloading causes [Error: aborted] { code: 'ECONNRESET', digest: '4181194784' }
  await page.waitForTimeout(1000)

  // confirm edits persist on reload
  await page.reload()

  // for no reason they all have multiple inputs now so have to call first() on everything
  await expect(page.getByLabel('Exercise').first()).toHaveValue(newName, {
    // reload seems to frequently be the cause of test timeouts
    timeout: 15_000,
  })
  await expect(page.getByLabel('Name').first()).toHaveValue(newName)
  await expect(page.getByText('Archived').first()).toBeVisible()
  await expect(page.getByLabel('Equipment weight').first()).toHaveValue('7.5')
  await expect(page.getByLabel('Bodyweight').first()).toBeChecked()
  await expect(page.getByText('my note').first()).toBeVisible()
})
