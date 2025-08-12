import { expect, it, vi } from 'vitest'
import { updateExerciseFields } from '../../lib/backend/mongoService'
import { URI_EXERCISES } from '../../lib/frontend/constants'
import { render, screen, useServer } from '../../lib/testUtils'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import UsageComboBox from './UsageComboBox'

it('adds category to exercise', async () => {
  const category = 'my category'
  const exercise = createExercise('my exercise')
  useServer(URI_EXERCISES, [exercise])
  const { user } = render(
    <UsageComboBox field="categories" name={category} usage={[]} />
  )

  await user.click(screen.getByRole('combobox'))
  await user.click(screen.getByText(exercise.name))

  expect(vi.mocked(updateExerciseFields)).toHaveBeenCalledWith(exercise, {
    categories: [category],
  })
})

it('removes modifirie from exercise', async () => {
  const modifier = 'my modifier'
  const exercise = createExercise('my exercise')
  useServer(URI_EXERCISES, [exercise])
  const { user } = render(
    <UsageComboBox field="modifiers" name={modifier} usage={[exercise]} />
  )

  // click the X on the chip
  await user.click(screen.getByTestId('CancelIcon'))

  expect(vi.mocked(updateExerciseFields)).toHaveBeenCalledWith(exercise, {
    modifiers: [],
  })
})
