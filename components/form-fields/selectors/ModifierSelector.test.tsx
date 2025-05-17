import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/testUtils'
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
