import { expect, it, vi } from 'vitest'
import {
  fetchExercises,
  updateExerciseFields,
} from '../../lib/backend/mongoService'
import { render, screen } from '../../lib/testUtils'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import UsageComboBox from './UsageComboBox'

it('adds category to exercise', async () => {
  const category = 'my category'
  const exercise = createExercise('my exercise')
  vi.mocked(fetchExercises).mockResolvedValue([exercise])
  const { user } = render(
    <UsageComboBox field="categories" name={category} usage={[]} />
  )

  await user.click(screen.getByRole('combobox'))
  await user.click(screen.getByText(exercise.name))

  expect(vi.mocked(updateExerciseFields)).toHaveBeenCalledWith(exercise._id, {
    categories: [category],
  })
})

it('removes modifier from exercise', async () => {
  const modifier = 'my modifier'
  const exercise = createExercise('my exercise')
  vi.mocked(fetchExercises).mockResolvedValue([exercise])
  const { user } = render(
    <UsageComboBox field="modifiers" name={modifier} usage={[exercise]} />
  )

  // click the X on the chip
  await user.click(screen.getByTestId('CancelIcon'))

  expect(vi.mocked(updateExerciseFields)).toHaveBeenCalledWith(exercise._id, {
    modifiers: [],
  })
})
