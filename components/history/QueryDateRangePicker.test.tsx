import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import QueryDateRangePicker from './QueryDateRangePicker'

const mockUpdate = vi.fn()

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

  expect(screen.queryByLabelText('Start date')).not.toBeInTheDocument()

  await user.click(screen.getByLabelText('Date range'))
  await user.click(screen.getByText('Custom'))

  // mui adds a hidden second label to the dom
  await user.type(screen.getAllByLabelText('Start date')[0], '02')
  expect(mockUpdate).toHaveBeenCalled()

  await user.type(screen.getAllByLabelText('End date')[0], '06')
  expect(mockUpdate).toHaveBeenCalled()
})

it('updates with quick options', async () => {
  const { user } = render(
    <QueryDateRangePicker query={{}} updateQuery={mockUpdate} />
  )

  await user.click(screen.getByLabelText('Date range'))
  await user.click(screen.getByText('Last 3 months'))

  expect(mockUpdate).toHaveBeenCalled()

  await user.click(screen.getByLabelText('Date range'))
  await user.click(screen.getByText('No filter'))

  expect(mockUpdate).toHaveBeenCalledWith({ start: undefined, end: undefined })
})
