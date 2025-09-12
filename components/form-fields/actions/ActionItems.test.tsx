import type { ComponentProps } from 'react'
import { expect, it, vi } from 'vitest'
import { render, screen, within } from '../../../lib/testUtils'
import ActionItems from './ActionItems'

const mockHandleDelete = vi.fn()
const mockHandleDuplicate = vi.fn()

const defaultProps: ComponentProps<typeof ActionItems> = {
  id: 'id',
  name: 'name',
  type: 'category',
  handleDelete: mockHandleDelete,
  handleDuplicate: mockHandleDuplicate,
}

it('calls handlers when buttons are clicked', async () => {
  const { user } = render(<ActionItems {...defaultProps} />)

  await user.click(screen.getByRole('button', { name: /duplicate/i }))
  expect(mockHandleDuplicate).toHaveBeenCalledWith(defaultProps.id)

  await user.click(screen.getByRole('button', { name: /delete/i }))
  // confirmation popup
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: /delete/i,
    })
  )
  expect(mockHandleDelete).toHaveBeenCalledWith(defaultProps.id)

  // usage only is visible for type "exercise"
  expect(screen.queryByText(/usage/i)).not.toBeInTheDocument()
})

it('renders usage button', () => {
  render(<ActionItems {...defaultProps} type="exercise" deleteDisabled />)

  expect(screen.getByRole('button', { name: /usage/i })).toBeVisible()
  expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled()
})

it('does not render buttons if handlers are not provided', () => {
  render(
    <ActionItems
      {...defaultProps}
      handleDelete={undefined}
      handleDuplicate={undefined}
    />
  )

  expect(
    screen.queryByRole('button', { name: /duplicate/i })
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', { name: /delete/i })
  ).not.toBeInTheDocument()
})
