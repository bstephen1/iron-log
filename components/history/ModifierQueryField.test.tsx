import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import ModifierQueryField from './ModifierQueryField'

const mockUpdate = vi.fn()

it('updates match type', async () => {
  const { user } = render(<ModifierQueryField updateQuery={mockUpdate} />)

  await user.click(screen.getByLabelText(/Exact/))
  await user.click(screen.getByText('Partial match'))

  expect(mockUpdate).toHaveBeenCalled()
})
