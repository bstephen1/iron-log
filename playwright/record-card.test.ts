import { expect, test } from './fixtures'

test.describe('without hidden actions', () => {
  test.use({
    viewport: {
      height: 800,
      width: 1000,
    },
  })

  test('handles header action buttons', async ({ page, sessionsPage }) => {
    await sessionsPage.addRecord('squats', '2000-01-01')
    await sessionsPage.addRecord('curls')

    // add record note
    await page.getByRole('button', { name: 'Record notes' }).first().click()
    await page.getByRole('textbox', { name: 'Add note' }).fill('record note')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // add session note
    await page.getByText('Record', { exact: true }).first().click()
    await page.getByRole('option', { name: 'Session' }).click()
    await page.getByRole('textbox', { name: 'Add note' }).fill('Session note')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('textbox', { name: 'note 1' }).press('Escape')

    // add exercise note
    await page.getByRole('button', { name: 'Exercise notes' }).first().click()
    await page.getByRole('textbox', { name: 'Add note' }).fill('exercise note')
    await page.getByRole('button', { name: 'Confirm' }).click()
    await page.getByRole('textbox', { name: 'Add note' }).press('Escape')

    // the name appends the badge counts, so this is Record 1 + {record notes} + {exercise notes}
    await expect(page.getByText('Record 121')).toBeVisible()

    // add set data
    await page.getByLabel('Set 0').getByLabel('weight').first().fill('10')
    await page.getByLabel('Set 0').getByLabel('reps').first().fill('6')
    await page.getByRole('button', { name: 'Add new set' }).first().click()

    // change units
    await page.getByRole('button', { name: 'Change units' }).first().click()
    await page.getByRole('radio', { name: 'lbs' }).check()
    await page.getByRole('radio', { name: 'lbs' }).press('Escape')
    await expect(
      page.getByLabel('Set 0').getByLabel('weight').first()
    ).toHaveValue('22.05')

    // move record
    await page
      .getByText('Record 121')
      .getByLabel('Move current record to the right')
      .click()
    await page
      .getByText('Record 221')
      .getByLabel('Move current record to the left')
      .click()

    // delete -- other record has the session note
    await page.getByText('Record 121').getByLabel('Delete record').click()
    await expect(page.getByText('Record 110')).toBeVisible()
  })
})
