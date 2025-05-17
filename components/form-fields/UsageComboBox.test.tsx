import { URI_EXERCISES } from '../../lib/frontend/constants'
import { render, screen, useServer } from '../../lib/testUtils'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import UsageComboBox from './UsageComboBox'
import * as restService from '../../lib/frontend/restService'
import { it, vi, expect } from 'vitest'

it('adds category to exercise', async () => {
  // spy must be inside the test
  const updateFieldsSpy = vi.spyOn(restService, 'updateExerciseFields')
  const category = 'my category'
  const exercise = createExercise('my exercise')
  useServer(URI_EXERCISES, [exercise])
  const { user } = render(
    <UsageComboBox field="categories" name={category} usage={[]} />
  )

  await user.click(screen.getByRole('combobox'))
  await user.click(screen.getByText(exercise.name))

  expect(updateFieldsSpy).toHaveBeenCalledWith(exercise, {
    categories: [category],
  })
})

it('removes modifirie from exercise', async () => {
  const updateFieldsSpy = vi.spyOn(restService, 'updateExerciseFields')
  const modifier = 'my modifier'
  const exercise = createExercise('my exercise')
  useServer(URI_EXERCISES, [exercise])
  const { user } = render(
    <UsageComboBox field="modifiers" name={modifier} usage={[exercise]} />
  )

  // click the X on the chip
  await user.click(screen.getByTestId('CancelIcon'))

  expect(updateFieldsSpy).toHaveBeenCalledWith(exercise, {
    modifiers: [],
  })
})
