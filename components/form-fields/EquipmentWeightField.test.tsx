import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import { DEFAULT_DISPLAY_FIELDS } from '../../models/DisplayFields'
import { convertUnit, DB_UNITS } from '../../models/Units'
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

it('clears out existing weight', async () => {
  const { user } = render(
    <>
      <div>other</div>
      <EquipmentWeightField handleUpdate={mockHandleUpdate} weight={5} />
    </>
  )

  await user.clear(screen.getByDisplayValue('5'))
  // trigger save on blur
  await user.click(screen.getByText('other'))

  // this cannot be called with "undefined" because it gets jsonified when being
  // passed to the backend, which strips undefined values
  expect(mockHandleUpdate).toHaveBeenCalledWith({ weight: null })
})

it('handles changing units', async () => {
  DEFAULT_DISPLAY_FIELDS.units = { ...DB_UNITS, weight: 'lbs' }
  const { user } = render(
    <>
      <div>other</div>
      <EquipmentWeightField weight={2} handleUpdate={mockHandleUpdate} />
    </>
  )

  expect(screen.getByText('lbs')).toBeVisible()

  // this replaces the whole value
  await user.type(screen.getByDisplayValue('4.41'), '9')
  await user.click(screen.getByText('other'))

  expect(mockHandleUpdate).toHaveBeenCalledWith({
    weight: convertUnit(9, 'weight', 'lbs', 'kg'),
  })

  DEFAULT_DISPLAY_FIELDS.units = DB_UNITS
})
