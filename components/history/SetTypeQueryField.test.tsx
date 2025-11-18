import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import { DB_UNITS } from '../../models/Units'
import SetTypeQueryField from './SetTypeQueryField'

const mockUpdate = vi.fn()

it('updates match type', async () => {
  const { user } = render(
    <SetTypeQueryField units={DB_UNITS} query={{}} updateQuery={mockUpdate} />
  )

  await user.click(screen.getByLabelText(/Disabled/))
  await user.click(screen.getByText('Exact match'))

  expect(mockUpdate).toHaveBeenCalled()
})
