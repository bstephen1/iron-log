import { createExercise } from '../models/AsyncSelectorOption/Exercise'
import { createRecord } from '../models/Record'
import { expect, test } from './fixtures'

// WARNING: since the tests in this file are creating records, they need to
// use different dates and exercises. Tests in the same file use the same worker so the data
// is NOT isolated.

test.describe('without hidden actions', () => {
  test.use({
    viewport: {
      height: 800,
      width: 1000,
    },
  })

  test('handles header action buttons', async ({ page, sessionsPage }) => {
    await sessionsPage.addRecord('bench ', '2000-01-01')
    await sessionsPage.addRecord('deadlift')

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
    await page.getByLabel('Set 1').getByLabel('weight').first().fill('10')
    await page.getByLabel('Set 1').getByLabel('reps').first().fill('6')
    await page.getByRole('button', { name: 'Add new set' }).first().click()

    // change units
    await page.getByRole('button', { name: 'Change units' }).first().click()
    await page.getByRole('radio', { name: 'lbs' }).click() // do NOT use check(), it fails in CI
    await page.getByRole('radio', { name: 'lbs' }).press('Escape')
    await expect(
      page.getByLabel('Set 1').getByLabel('weight').first()
    ).toHaveValue('22.05')

    // move record -- second num is record notes, third is exercise notes
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
    await expect(page.getByText('Record 11')).toBeVisible()
  })
})

test.describe('with hidden actions', () => {
  test.use({
    viewport: {
      height: 800,
      width: 275,
    },
  })

  test('handles header action buttons', async ({
    page,
    extendedPage,
    sessionsPage,
  }) => {
    await sessionsPage.addRecord('squats', '2000-02-01')
    await sessionsPage.addRecord('curls')

    // change units
    await page.getByLabel('Set 1').getByLabel('weight').first().fill('10')
    await page.getByRole('button', { name: 'More...' }).first().click()
    await page.getByLabel('Change units').click()
    await page.getByRole('radio', { name: 'lbs' }).click() // do NOT use check(), it fails in CI
    await page.getByRole('radio', { name: 'lbs' }).press('Escape')
    await expect(
      page.getByLabel('Set 1').getByLabel('weight').first()
    ).toHaveValue('22.05')

    // move record
    await page.getByRole('button', { name: 'More...' }).first().click()
    await page.getByLabel('Move current record to the right').click()
    await expect(page.getByLabel('Exercise').first()).toHaveValue('curls')
    await extendedPage.waitForSave()

    // delete
    await page.keyboard.press('ArrowLeft') // have to swipe back to first card
    await page.getByRole('button', { name: 'More...' }).first().click()
    await page.getByLabel('Delete record').click()

    await expect(page.getByText('Record 2')).not.toBeVisible()
    await expect(page.getByLabel('Exercise').first()).toHaveValue('squats')
  })
})

test.describe('history', () => {
  test.use({
    viewport: {
      // must ensure viewport is tall enough to show history or test may fail due
      // to elements being outside the viewport not being considered visible
      height: 1500,
      width: 800,
    },
  })
  test('shows history for single value set type', async ({
    page,
    api,
    sessionsPage,
  }) => {
    const pullups = await api.addData(createExercise('pullups'))
    await api.addData(
      createRecord('2000-03-01', pullups._id, {
        sets: [{ weight: 10 }],
        setType: {
          operator: 'exactly',
          field: 'reps',
          value: 8,
          // leftover fields from other operator
          min: 3,
          max: 6,
        },
      })
    )
    await api.addData(
      createRecord('2000-03-02', pullups._id, {
        setType: { operator: 'exactly', field: 'reps', value: 8 },
      })
    )

    await sessionsPage.addRecord('pullups', '2000-03-02')

    await expect(page.getByText('No history found')).not.toBeVisible()
    await expect(page.getByText('2000-03-01')).toBeVisible()
    await expect(page.getByText('10')).toBeVisible()
  })

  test.use({
    viewport: {
      height: 1500,
      width: 800,
    },
  })
  test('shows history for min/max set type', async ({
    page,
    sessionsPage,
    api,
  }) => {
    const pullups = await api.addData(createExercise('pullups'))
    await api.addData(
      createRecord('2000-03-01', pullups._id, {
        sets: [{ weight: 10 }],
        setType: {
          operator: 'between',
          field: 'reps',
          min: 3,
          max: 6,
          // leftover field from other operator
          value: 8,
        },
      })
    )
    await api.addData(
      createRecord('2000-03-02', pullups._id, {
        setType: { operator: 'between', field: 'reps', min: 3, max: 6 },
      })
    )

    await sessionsPage.goto('2000-03-02')

    await expect(page.getByText('No history found')).not.toBeVisible()
    await expect(page.getByText('2000-03-01')).toBeVisible()
    await expect(page.getByText('10')).toBeVisible()
  })
})
