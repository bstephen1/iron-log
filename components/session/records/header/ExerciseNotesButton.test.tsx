import { expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '../../../../lib/testUtils'
import { createNote } from '../../../../models/Note'
import ExerciseNotesButton from './ExerciseNotesButton'

const mockMutate = vi.fn()

it('submits notes', async () => {
  const { user } = render(
    <ExerciseNotesButton mutateExerciseFields={mockMutate} />
  )

  await user.click(screen.getByRole('button'))
  await user.type(screen.getByPlaceholderText(/Add/), 'x')
  await user.click(screen.getByLabelText('Confirm'))

  expect(mockMutate).toHaveBeenCalled()

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
