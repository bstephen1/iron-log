import dayjs from 'dayjs'
import { vi } from 'vitest'
import { render, screen, useServer } from '../../../lib/testUtils'
import SessionLog from '../../../models/SessionLog'
import SessionDatePicker from './SessionDatePicker'

const mockHandleDateChange = vi.fn()

it('triggers date change when the new value is a valid date', async () => {
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-01')}
      handleDayChange={mockHandleDateChange}
    />,
  )

  const input = screen.getByDisplayValue('01/01/2020')

  await user.clear(input)
  // input day, month, and year separately
  await user.paste('03')
  await user.paste('15')
  await user.paste('2022')

  // should only have called once, not three times
  expect(mockHandleDateChange).toHaveBeenCalledTimes(1)
})

it('shows existing session data with badges', async () => {
  useServer('/api/sessions/*', [
    new SessionLog('2020-01-05', ['dummyRecordID']),
    new SessionLog('2020-01-10'),
  ])
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-01')}
      handleDayChange={mockHandleDateChange}
    />,
  )

  await user.click(screen.getByLabelText(/choose date/i))

  expect(screen.getByLabelText('2020-01-05, Session data exists')).toBeVisible()
  // session exists, but is empty -- should be displayed as "no session"
  expect(screen.getByLabelText('2020-01-10, No session')).toBeVisible()
  // no session exists
  expect(screen.getByLabelText('2020-01-04, No session')).toBeVisible()
})

it('handles changing month', async () => {
  useServer('/api/sessions/*', [
    new SessionLog('2020-01-05', ['dummyRecordID']),
    new SessionLog('2020-01-10'),
  ])
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-01')}
      handleDayChange={mockHandleDateChange}
      // don't really need to test this, just define it for the coverage
      textFieldProps={{}}
    />,
  )

  await user.click(screen.getByLabelText(/choose date/i))
  await user.click(screen.getByLabelText(/next month/i))

  expect(screen.getByText(/february/i)).toBeVisible()
})
