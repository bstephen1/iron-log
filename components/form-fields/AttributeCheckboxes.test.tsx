import { render, screen } from '../../lib/testUtils'
import { Attributes } from '../../models/Attributes'
import AttributeCheckboxes from './AttributeCheckboxes'

const mockHandleSubmit = vi.fn()

it('calls submit handler on change', async () => {
  const defaults: Attributes = { bodyweight: true }

  const { user } = render(
    <AttributeCheckboxes
      attributes={defaults}
      handleSubmit={mockHandleSubmit}
    />
  )

  // starts with defaults checked
  expect(screen.getByLabelText('Bodyweight')).toBeChecked()
  expect(screen.getByLabelText('Unilateral')).not.toBeChecked()

  // mark as checked
  await user.click(screen.getByText('Unilateral'))

  expect(mockHandleSubmit).toHaveBeenCalledWith({
    unilateral: true,
    bodyweight: true,
  })
})
