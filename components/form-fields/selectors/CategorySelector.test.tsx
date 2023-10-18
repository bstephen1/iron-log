import { render, screen } from 'lib/testUtils'
import { expect, it, vi } from 'vitest'
import CategorySelector from './CategorySelector'

it('renders with expected text', async () => {
  render(
    <CategorySelector
      category={null}
      categories={[]}
      handleChange={vi.fn()}
      mutate={vi.fn()}
    />
  )

  expect(screen.getByLabelText(/category/i)).toBeVisible()
  expect(screen.getByPlaceholderText(/add new category/i)).toBeVisible()
})
