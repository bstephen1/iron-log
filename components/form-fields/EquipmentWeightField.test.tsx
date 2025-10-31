import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import EquipmentWeightField from './EquipmentWeightField'

const mockHandleUpdate = vi.fn()

it('calls update handler', async () => {
  const { user } = render(
    <>
      <div>other</div>
      <EquipmentWeightField handleUpdate={mockHandleUpdate} />
    </>
  )

  await user.type(screen.getByDisplayValue(''), '5')
  // trigger save on blur
  await user.click(screen.getByText('other'))

  expect(mockHandleUpdate).toHaveBeenCalledWith({ weight: 5 })
})
