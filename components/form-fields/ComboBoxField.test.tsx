import { vi, it, expect } from 'vitest'
import { render, screen } from '../../lib/testUtils'
import ComboBoxField from './ComboBoxField'

const mockHandleChange = vi.fn()
const mockHandleSubmit = vi.fn()

it('calls handlers on remove', async () => {
  const options = ['one', 'two', 'three']
  const { user } = render(
    <ComboBoxField
      initialValue={options}
      options={options}
      handleChange={mockHandleChange}
      handleSubmit={mockHandleSubmit}
    />
  )

  // remove  middle value
  await user.click(screen.getAllByTestId('CancelIcon')[1])
  expect(mockHandleSubmit).toHaveBeenCalledWith(['one', 'three'])
  expect(mockHandleChange).toHaveBeenCalledWith('two', 'removeOption')
})

it('calls handlers on add', async () => {
  const options = ['one', 'two', 'three']
  const { user } = render(
    <ComboBoxField
      // without setting an initialValue tests cause infinite rerenders, unsure why
      initialValue={[]}
      options={options}
      handleChange={mockHandleChange}
      handleSubmit={mockHandleSubmit}
    />
  )

  // open dropbox and add value
  await user.click(screen.getByRole('combobox'))
  await user.click(screen.getByText('one'))

  expect(mockHandleSubmit).toHaveBeenCalledWith(['one'])
  expect(mockHandleChange).toHaveBeenCalledWith('one', 'selectOption')
})
