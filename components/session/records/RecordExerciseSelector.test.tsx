import { expect, it, vi } from 'vitest'
import {
  fetchExercises,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import {
  createExercise,
  type Exercise,
} from '../../../models/AsyncSelectorOption/Exercise'
import RecordExerciseSelector from './RecordExerciseSelector'

it('filters modifiers to match the new exercise on switch', async () => {
  const all = createExercise('all', {
    modifiers: ['one', 'two', 'three', 'four'],
  })
  const some = createExercise('some', { modifiers: ['two', 'three'] })
  const exercises: Exercise[] = [all, some]
  vi.mocked(fetchExercises).mockResolvedValue(exercises)
  const { user } = render(
    <RecordExerciseSelector
      exercise={all}
      _id="1"
      date="2000-01-01"
      activeModifiers={all.modifiers}
    />
  )

  await user.click(screen.getByDisplayValue(all.name))
  await user.click(screen.getByText(some.name))

  expect(updateRecordFields).toHaveBeenCalledWith('1', {
    exercise: some,
    activeModifiers: some.modifiers,
  })
})
