import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/testUtils'
import ModifierSelector from './ModifierSelector'

it('renders with expected text', async () => {
  render(<ModifierSelector modifier={null} handleChange={vi.fn()} />)

  expect(screen.getByLabelText(/modifier/i)).toBeVisible()
  expect(screen.getByPlaceholderText(/add new modifier/i)).toBeVisible()
})
