import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import RecordDisplaySelect from './RecordDisplaySelect'

const mockUpdate = vi.fn()

it('updates', async () => {
  const { user } = render(
    <RecordDisplaySelect
      recordDisplay={{
        grouping: 'daily',
        operator: 'highest',
        field: 'weight',
      }}
      updateRecordDisplay={mockUpdate}
      // slotProps should not override internals
      slotProps={{ select: {} }}
    />
  )

  await user.click(screen.getByText('daily highest weight'))
  await user.click(screen.getByText('monthly'))

  expect(mockUpdate).toHaveBeenCalledWith({ grouping: 'monthly' })

  // close
  await user.keyboard('{Escape}')
})
