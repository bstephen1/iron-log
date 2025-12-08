import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import type { Attributes } from '../../models/Attributes'
import AttributeCheckboxes from './AttributeCheckboxes'

const mockHandleUpdate = vi.fn()

it('calls submit handler on change', async () => {
  const defaults: Attributes = { bodyweight: true }

  const { user } = render(
    <AttributeCheckboxes
      attributes={defaults}
      handleUpdate={mockHandleUpdate}
    />
  )

  // starts with defaults checked
  expect(screen.getByLabelText('Bodyweight')).toBeChecked()
  expect(screen.getByLabelText('Unilateral')).not.toBeChecked()

  // mark as checked
  await user.click(screen.getByText('Unilateral'))

  expect(mockHandleUpdate).toHaveBeenCalledWith({
    attributes: {
      unilateral: true,
      bodyweight: true,
    },
  })
})
