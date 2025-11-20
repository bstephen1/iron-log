import { expect, it } from 'vitest'
import {
  deleteExercise,
  updateExerciseFields,
} from '../../lib/backend/mongoService'
import { render, screen, within } from '../../lib/test/rtl'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import ExerciseForm from './ExerciseForm'

const exercise = createExercise('squats')

it('updates', async () => {
  const { user } = render(<ExerciseForm exercise={exercise} />)

  await user.type(screen.getByLabelText('Name'), 'x')
  await user.click(screen.getByLabelText('Submit'))

  expect(updateExerciseFields).toHaveBeenCalled()
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
