import { render, screen } from 'lib/testUtils'
import { vi } from 'vitest'
import ModifierSelector from './ModifierSelector'

it('renders with expected text', async () => {
  render(
    <ModifierSelector
      modifier={null}
      modifiers={[]}
      handleChange={vi.fn()}
      mutate={vi.fn()}
    />
  )

  expect(screen.getByLabelText(/modifier/i)).toBeVisible()
  expect(screen.getByPlaceholderText(/add new modifier/i)).toBeVisible()
})
