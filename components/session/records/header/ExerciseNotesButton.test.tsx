import { expect, it } from 'vitest'
import { updateExerciseFields } from '../../../../lib/backend/mongoService'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { createNote } from '../../../../models/Note'
import ExerciseNotesButton from './ExerciseNotesButton'

it('submits notes', async () => {
  const { user } = render(<ExerciseNotesButton _id="1" />)

  await user.click(screen.getByRole('button'))
  await user.type(screen.getByPlaceholderText(/Add/), 'x')
  await user.click(screen.getByLabelText('Confirm'))

  expect(updateExerciseFields).toHaveBeenCalled()

  // close dialog
  await user.keyboard('[Escape]')
  await waitFor(() => {
    expect(screen.queryByPlaceholderText(/Add/)).not.toBeInTheDocument()
  })
})

it('renders as readonly', async () => {
  const { user } = render(
    <ExerciseNotesButton notes={[createNote('some note')]} />
  )

  await user.click(screen.getByRole('button'))

  expect(screen.getByText('some note')).toBeVisible()
  expect(screen.queryByLabelText(/Add/)).not.toBeInTheDocument()
})

it('renders as disabled', async () => {
  render(<ExerciseNotesButton disabled />)

  expect(screen.getByRole('button')).toBeDisabled()
})
