import { render, screen } from '../../lib/testUtils'
import NameField from './NameField'

const mockHandleUpdate = vi.fn()

it('submits valid edits', async () => {
  const existingName = 'existing'
  const initialName = 'init'
  const { user } = render(
    <NameField
      name={initialName}
      options={[existingName]}
      handleUpdate={mockHandleUpdate}
    />
  )

  const input = screen.getByDisplayValue(initialName)

  // clear out the input
  await user.clear(input)
  expect(screen.getByText('Must have a name')).toBeVisible()

  // type in an existing name
  await user.paste(existingName)
  expect(screen.getByText('Already exists!')).toBeVisible()

  // save a valid name
  await user.type(input, 'x')
  await user.click(screen.getByLabelText('Submit'))
  expect(mockHandleUpdate).toHaveBeenCalledWith({ name: existingName + 'x' })
})
