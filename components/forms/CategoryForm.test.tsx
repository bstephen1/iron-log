import { expect, it, vi } from 'vitest'
import {
  deleteCategory,
  fetchExercises,
  updateCategoryFields,
} from '../../lib/backend/mongoService'
import { render, screen, waitFor, within } from '../../lib/test/rtl'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import { createModifier } from '../../models/AsyncSelectorOption/Modifier'
import CategoryForm from './CategoryForm'

const category = createModifier('biceps')

it('updates', async () => {
  const { user } = render(<CategoryForm category={category} />)

  await user.type(screen.getByLabelText('Name'), 'x')
  await user.click(screen.getByLabelText('Submit'))

  expect(updateCategoryFields).toHaveBeenCalled()
})

it('deletes', async () => {
  const { user } = render(<CategoryForm category={category} />)

  await user.click(screen.getByText('Delete'))
  // confirmation dialog
  await user.click(within(screen.getByRole('dialog')).getByText('Delete'))

  expect(deleteCategory).toHaveBeenCalled()
})

it('disables deleting if there is usage', async () => {
  vi.mocked(fetchExercises).mockResolvedValue([
    createExercise('squats', { categories: [category.name] }),
  ])
  render(<CategoryForm category={category} />)

  await waitFor(() => {
    expect(screen.getByText('Delete')).toBeDisabled()
  })
})
