import dayjs from 'dayjs'
import { expect, it, vi } from 'vitest'
import { DATE_FORMAT } from '../../lib/frontend/constants'
import { render, screen } from '../../lib/test/rtl'
import QueryDateRangePicker from './QueryDateRangePicker'

const mockUpdate = vi.fn()
const today = dayjs().format(DATE_FORMAT)

it('updates with custom dates', async () => {
  const { user } = render(
    <QueryDateRangePicker
      query={{
        start: '2000-01-01',
        end: '2000-05-01',
      }}
      updateQuery={mockUpdate}
    />
  )

  // mui adds a hidden second label to the dom
  await user.type(screen.getAllByLabelText('Start date')[0], '02')
  expect(mockUpdate).toHaveBeenCalled()

  await user.type(screen.getAllByLabelText('End date')[0], '06')
  expect(mockUpdate).toHaveBeenCalled()
})

it('updates with quick options', async () => {
  const { user } = render(
    <QueryDateRangePicker
      // init as custom (different than what we're trying to select later)
      query={{ start: '2000-01-01', end: '2000-01-01' }}
      updateQuery={mockUpdate}
    />
  )

  await user.click(screen.getByLabelText('Date range'))
  await user.click(screen.getByText('Last 3 months'))

  expect(mockUpdate).toHaveBeenCalledWith({
    start: dayjs().add(-3, 'months').format(DATE_FORMAT),
    end: undefined,
  })

  await user.click(screen.getByLabelText('Date range'))
  await user.click(screen.getByText('No filter'))

  expect(mockUpdate).toHaveBeenCalledWith({ start: undefined, end: undefined })
})

it('updates to custom mode', async () => {
  const { user } = render(
    <QueryDateRangePicker
      query={{}} // no filter
      updateQuery={mockUpdate}
    />
  )

  await user.click(screen.getByLabelText('Date range'))
  await user.click(screen.getByText('Custom'))

  expect(mockUpdate).toHaveBeenCalledWith({ start: today, end: today })
})
