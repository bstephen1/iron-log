import { beforeEach, expect, it, vi } from 'vitest'
import { LOCAL_STORAGE } from '../../../lib/frontend/constants'
import { render, screen } from '../../../lib/test/rtl'
import IntervalSettingsDialog from './IntervalSettingsDialog'

const mockSubmit = vi.fn()

const TestWrapper = () => {
  return (
    <IntervalSettingsDialog
      open={true}
      setOpen={vi.fn()}
      handleSubmit={mockSubmit}
    />
  )
}

beforeEach(() => {
  localStorage.clear()
})

it('submits valid changes', async () => {
  const { user } = render(<TestWrapper />)

  await user.type(screen.getByLabelText('Delay'), '5')
  await user.type(screen.getByLabelText('Work'), '3')
  await user.type(screen.getByLabelText('Rest'), '7')
  await user.click(screen.getByText('Confirm'))

  expect(mockSubmit).toHaveBeenCalledWith({ delay: 5, work: 3, rest: 7 })
})

it('cancels', async () => {
  const { user } = render(<TestWrapper />)

  await user.click(screen.getByText('Cancel'))

  expect(mockSubmit).not.toHaveBeenCalled()
})

it('defaults to minimum values if provided invalid values', async () => {
  const { user } = render(<TestWrapper />)

  await user.type(screen.getByLabelText('Delay'), 'x')
  await user.type(screen.getByLabelText('Work'), '-3')
  await user.type(screen.getByLabelText('Rest'), '0')
  await user.click(screen.getByText('Confirm'))

  expect(mockSubmit).toHaveBeenCalledWith({ delay: 0, work: 1, rest: 1 })
})

it('defaults to minimum values if provided no values', async () => {
  const { user } = render(<TestWrapper />)

  await user.click(screen.getByText('Confirm'))

  expect(mockSubmit).toHaveBeenCalledWith({ delay: 0, work: 1, rest: 1 })
})

it('uses values from local storage', async () => {
  localStorage.setItem(
    LOCAL_STORAGE.intervalTimer,
    JSON.stringify({ delay: 3, work: 10, rest: 15 })
  )
  render(<TestWrapper />)

  expect(screen.getByDisplayValue('3')).toBeVisible()
  expect(screen.getByDisplayValue('10')).toBeVisible()
  expect(screen.getByDisplayValue('15')).toBeVisible()
})

it('does not show zero if input is cleared', async () => {
  localStorage.setItem(
    LOCAL_STORAGE.intervalTimer,
    JSON.stringify({ delay: 3 })
  )
  const { user } = render(<TestWrapper />)

  await user.clear(screen.getByDisplayValue('3'))

  expect(screen.queryByDisplayValue('0')).not.toBeInTheDocument()
  expect(screen.getAllByDisplayValue('').length).toBe(3)
})
