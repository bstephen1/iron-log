import { expect, it, vi } from 'vitest'
import { fetchExercises } from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import {
  createExercise,
  type Exercise,
} from '../../../models/AsyncSelectorOption/Exercise'
import RecordExerciseSelector from './RecordExerciseSelector'

const mockMutate = vi.fn()

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
      mutateRecordFields={mockMutate}
      activeModifiers={all.modifiers}
    />
  )

  await user.click(screen.getByDisplayValue(all.name))
  await user.click(screen.getByText(some.name))

  expect(mockMutate).toHaveBeenCalledWith({
    exercise: some,
    activeModifiers: some.modifiers,
  })
})
