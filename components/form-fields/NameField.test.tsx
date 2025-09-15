import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/testUtils'
import NameField from './NameField'

const mockHandleUpdate = vi.fn()

it('submits valid edits', async () => {
  const existingName = 'existing'
  const initialName = 'init'
  const { user } = render(
    <NameField
      name={initialName}
      existingNames={[existingName]}
      handleUpdate={mockHandleUpdate}
    />
  )

  const input = screen.getByDisplayValue(initialName)

  // clear out the input
  await user.clear(input)
  expect(screen.getByText('Cannot be blank')).toBeVisible()

  // type in an existing name
  await user.paste(existingName)
  expect(screen.getByText('Already exists!')).toBeVisible()

  // save a valid name
  await user.type(input, 'x')
  await user.click(screen.getByLabelText('Submit'))
  expect(mockHandleUpdate).toHaveBeenCalledWith({ name: `${existingName}x` })
})

it('does not count own name as an existing name', async () => {
  const initialName = 'init'
  const { user } = render(
    <NameField
      name={initialName}
      existingNames={[initialName]}
      handleUpdate={mockHandleUpdate}
    />
  )

  const input = screen.getByDisplayValue(initialName)

  // dirty the input
  await user.type(input, 'x')
  await user.type(input, '[Backspace]')

  expect(screen.getByLabelText('Reset')).not.toBeVisible()
})
