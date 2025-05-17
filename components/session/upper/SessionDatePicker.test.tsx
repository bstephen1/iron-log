import dayjs from 'dayjs'
import { expect, it, vi } from 'vitest'
import { render, screen, useServer } from '../../../lib/testUtils'
import { createSessionLog } from '../../../models/SessionLog'
import SessionDatePicker from './SessionDatePicker'

const mockHandleDateChange = vi.fn()

it('updates date from keyboard input', async () => {
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-02')}
      handleDayChange={mockHandleDateChange}
    />
  )

  await user.click(screen.getByText('01'))

  // input day, month, and year separately
  await user.paste('03')
  await user.paste('09')
  await user.paste('22')

  await user.keyboard('{Enter}')

  expect(mockHandleDateChange).toHaveBeenCalledTimes(1)
})

it('updates date from picker', async () => {
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-02')}
      handleDayChange={mockHandleDateChange}
    />
  )

  await user.click(screen.getByLabelText(/Choose date/))

  // click a new day
  await user.click(screen.getByText('15'))

  // automatically submits
  expect(mockHandleDateChange).toHaveBeenCalledTimes(1)
})

it('Shows correct aria label for picker button', async () => {
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-02')}
      handleDayChange={mockHandleDateChange}
    />
  )

  expect(screen.getByLabelText(/Jan 2, 2020/))

  await user.click(screen.getByText('01'))
  await user.keyboard('{Backspace}')

  // exact label -- doesn't have a date
  expect(screen.getByLabelText('Choose date'))
})

it('shows existing session data with badges', async () => {
  useServer('/api/sessions/*', [
    createSessionLog('2020-01-05', ['dummyRecordID']),
    createSessionLog('2020-01-10'),
  ])
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-01')}
      handleDayChange={mockHandleDateChange}
    />
  )

  await user.click(screen.getByLabelText(/choose date/i))

  expect(screen.getByLabelText('2020-01-05, Session data exists')).toBeVisible()
  // session exists, but is empty -- should be displayed as "no session"
  expect(screen.getByLabelText('2020-01-10, No session data')).toBeVisible()
  // no session exists
  expect(screen.getByLabelText('2020-01-04, No session data')).toBeVisible()
})

it('handles changing month', async () => {
  useServer('/api/sessions/*', [
    createSessionLog('2020-01-05', ['dummyRecordID']),
    createSessionLog('2020-01-10'),
  ])
  const { user } = render(
    <SessionDatePicker
      day={dayjs('2020-01-01')}
      handleDayChange={mockHandleDateChange}
      // don't really need to test this, just define it for the coverage
      textFieldProps={{}}
    />
  )

  await user.click(screen.getByLabelText(/choose date/i))
  await user.click(screen.getByLabelText(/next month/i))

  expect(screen.getByText(/february/i)).toBeVisible()
})
