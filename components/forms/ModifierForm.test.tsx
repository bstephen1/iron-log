import { expect, it, vi } from 'vitest'
import {
  deleteModifier,
  fetchExercises,
  updateModifierFields,
} from '../../lib/backend/mongoService'
import { render, screen, waitFor, within } from '../../lib/test/rtl'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import { createModifier } from '../../models/AsyncSelectorOption/Modifier'
import ModifierForm from './ModifierForm'

const modifier = createModifier('belt')

it('updates', async () => {
  const { user } = render(<ModifierForm modifier={modifier} />)

  await user.type(screen.getByLabelText('Name'), 'x')
  await user.click(screen.getByLabelText('Submit'))

  expect(updateModifierFields).toHaveBeenCalled()
})

it('deletes', async () => {
  const { user } = render(<ModifierForm modifier={modifier} />)

  await user.click(screen.getByText('Delete'))
  // confirmation dialog
  await user.click(within(screen.getByRole('dialog')).getByText('Delete'))

  expect(deleteModifier).toHaveBeenCalled()
})

it('disables deleting if there is usage', async () => {
  vi.mocked(fetchExercises).mockResolvedValue([
    createExercise('squats', { modifiers: [modifier.name] }),
  ])
  render(<ModifierForm modifier={modifier} />)

  await waitFor(() => {
    expect(screen.getByText('Delete')).toBeDisabled()
  })
})
