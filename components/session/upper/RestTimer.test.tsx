import dayjs, { type ManipulateType } from 'dayjs'
import { beforeEach, vi } from 'vitest'
import { act, render, screen } from '../../../lib/testUtils'
import RestTimer from './RestTimer'

const initialTime = dayjs('2020-01-01T10:00:00')

beforeAll(() => {
  vi.useFakeTimers()
})

beforeEach(() => {
  vi.setSystemTime(initialTime.toDate())
})

afterAll(() => {
  vi.useRealTimers()
})

const renderAndStartTimer = async () => {
  const { user } = render(<RestTimer />, { useFakeTimers: true })

  await user.click(screen.getByText(/start/i))

  return { user }
}

/** Update system time and rerender component. Takes same args as dayjs().add() */
const addSystemTime = (value: number, unit?: ManipulateType) => {
  // must be wrapped in act() to properly update state
  act(() => {
    const cur = vi.getMockedSystemTime()
    vi.setSystemTime(dayjs(cur).add(value, unit).toDate())
    // This should be the same as the tick interval in the component,
    // but probably will still work fine as long as it's < 1000
    // (otherwise since it's longer than a second the tick may include the extra second)
    vi.advanceTimersByTime(100)
  })
}

it('resets timer', async () => {
  const { user } = await renderAndStartTimer()

  expect(screen.getByText('00:00:00')).toBeVisible()

  addSystemTime(1, 'hour')

  expect(screen.getByText('01:00:00')).toBeVisible()

  await user.click(screen.getByLabelText(/reset/i))

  expect(screen.getByText('00:00:00')).toBeVisible()
})

it('pauses and resumes timer', async () => {
  const { user } = await renderAndStartTimer()

  addSystemTime(1, 'hour')
  await user.click(screen.getByLabelText(/pause/i))
  addSystemTime(1, 'hour')

  expect(screen.getByText('01:00:00')).toBeVisible()

  await user.click(screen.getByLabelText(/resume/i))
  addSystemTime(1, 'hour')

  expect(screen.getByText('02:00:00')).toBeVisible()
})

it('stops timer', async () => {
  const { user } = await renderAndStartTimer()

  await user.click(screen.getByLabelText(/turn off/i))

  expect(screen.getByText(/start/i)).toBeVisible()
  expect(screen.queryByText('00:00:00')).not.toBeInTheDocument()
})

it('shows total time after finishing session', async () => {
  const { user } = await renderAndStartTimer()

  const reset = screen.getByLabelText(/reset/i)

  addSystemTime(1, 'hour')
  await user.click(reset)
  addSystemTime(15, 'minute')
  addSystemTime(15, 'minute')
  await user.click(reset)
  addSystemTime(30, 'minute')
  await user.click(screen.getByLabelText(/finish/i))

  expect(screen.getByText(/total session time/i)).toBeVisible()
  expect(screen.getByText(/rest time/i)).not.toBeVisible()
  expect(screen.getByText('02:00:00')).toBeVisible()
})

it('maintains total time when resetting after finishing session', async () => {
  const { user } = await renderAndStartTimer()

  const reset = screen.getByLabelText(/reset/i)
  const finish = screen.getByLabelText(/finish/i)

  addSystemTime(1, 'hour')
  await user.click(finish)
  await user.click(reset)
  addSystemTime(30, 'minute')
  await user.click(finish)

  expect(screen.getByText(/total session time/i)).toBeVisible()
  expect(screen.getByText('01:30:00')).toBeVisible()
})

it('unpauses timer when resetting', async () => {
  const { user } = await renderAndStartTimer()

  await user.click(screen.getByLabelText(/pause/i))
  addSystemTime(1, 'hour')
  await user.click(screen.getByLabelText(/reset/i))
  addSystemTime(30, 'minute')

  expect(screen.getByText('00:30:00')).toBeVisible()
})
