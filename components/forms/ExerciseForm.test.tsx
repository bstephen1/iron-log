import { expect, it } from 'vitest'
import {
  deleteExercise,
  updateExerciseFields,
} from '../../lib/backend/mongoService'
import { render, screen, within } from '../../lib/test/rtl'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import ExerciseForm from './ExerciseForm'

const exercise = createExercise('squats', {
  modifiers: ['mod'],
  categories: ['cat'],
})

it('updates', async () => {
  const { user } = render(<ExerciseForm exercise={exercise} />)

  // notes
  await user.type(screen.getByPlaceholderText('Add note'), 'x')
  await user.click(screen.getByLabelText('Confirm'))
  expect(updateExerciseFields).toHaveBeenLastCalledWith(exercise._id, {
    notes: [expect.objectContaining({ value: 'x' })],
  })

  // categories / modifiers
  const [categories, modifiers] = screen.getAllByTestId('CancelIcon')
  await user.click(categories)
  expect(updateExerciseFields).toHaveBeenLastCalledWith(exercise._id, {
    categories: [],
  })
  await user.click(modifiers)
  expect(updateExerciseFields).toHaveBeenLastCalledWith(exercise._id, {
    modifiers: [],
  })
})

it('deletes', async () => {
  const { user } = render(<ExerciseForm exercise={exercise} />)

  await user.click(screen.getByText('Delete'))
  // confirmation dialog
  await user.click(within(screen.getByRole('dialog')).getByText('Delete'))

  expect(deleteExercise).toHaveBeenCalled()
})

it('duplicates', async () => {
  const { user } = render(<ExerciseForm exercise={exercise} />)

  await user.click(screen.getByText('Duplicate'))

  expect(screen.getByText(/Duplicated/)).toBeVisible()
})
