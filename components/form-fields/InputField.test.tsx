import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/testUtils'
import InputField from './InputField'

const mockHandleSubmit = vi.fn()

it('calls submit/reset handlers', async () => {
  const initial = 'initial'
  const { user } = render(
    <InputField
      label="label"
      initialValue={initial}
      handleSubmit={mockHandleSubmit}
    />
  )

  expect(screen.getByLabelText('Submit')).not.toBeVisible()
  expect(screen.getByLabelText('Reset')).not.toBeVisible()

  await user.type(screen.getByDisplayValue(initial), 'x')
  await user.click(screen.getByLabelText('Submit'))

  expect(mockHandleSubmit).toHaveBeenCalledWith(`${initial}x`)

  await user.click(screen.getByLabelText('Reset'))

  expect(screen.getByDisplayValue(initial)).toBeVisible()
})

it('submits with keypress', async () => {
  const initial = 'initial'
  const { user } = render(
    <InputField
      label="label"
      initialValue={initial}
      showSubmit
      handleSubmit={mockHandleSubmit}
    />
  )

  // submit visible because of showSubmit
  expect(screen.getByLabelText('Submit')).toBeVisible()

  await user.type(screen.getByDisplayValue(initial), '{Enter}')
  expect(mockHandleSubmit).toHaveBeenCalledWith(initial)
})
