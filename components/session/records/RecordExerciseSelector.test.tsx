import { expect, it, vi } from 'vitest'
import {
  fetchCategories,
  fetchExercises,
} from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import { createCategory } from '../../../models/AsyncSelectorOption/Category'
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

it('updates category filter', async () => {
  const cat1 = createCategory('one')
  const cat2 = createCategory('two')
  const exercise = createExercise('all', {
    categories: [cat1.name, cat2.name],
  })
  vi.mocked(fetchCategories).mockResolvedValue([cat1, cat2])
  vi.mocked(fetchExercises).mockResolvedValue([exercise])
  const { user } = render(
    <RecordExerciseSelector
      exercise={exercise}
      mutateRecordFields={mockMutate}
      activeModifiers={[]}
      category={cat1.name}
    />
  )

  await user.click(screen.getByText(cat1.name))
  await user.click(screen.getByText(cat2.name))

  expect(mockMutate).toHaveBeenCalledWith({
    category: cat2.name,
  })
})
