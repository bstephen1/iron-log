import dayjs, { type ManipulateType } from 'dayjs'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { LOCAL_STORAGE } from '../../../lib/frontend/constants'
import { act, render, screen, waitFor } from '../../../lib/test/rtl'
import RestTimer, { type IntervalSettings } from './RestTimer'

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

describe('interval timer', () => {
  const setIntervalSettings = (settings: IntervalSettings) =>
    localStorage.setItem(LOCAL_STORAGE.intervalTimer, JSON.stringify(settings))

  it('opens settings dialog when local storage is empty', async () => {
    const { user } = await renderAndStartTimer()

    await user.click(screen.getByLabelText(/interval/))

    expect(screen.getByText('Interval settings')).toBeVisible()
  })

  it('iterates through interval modes properly', async () => {
    setIntervalSettings({ delay: 10, work: 5, rest: 7 })
    const { user } = await renderAndStartTimer()

    await user.click(screen.getByLabelText(/interval/))

    expect(screen.getByText('Delay')).toBeVisible()
    expect(screen.getByText('00:00:10')).toBeVisible()

    addSystemTime(10, 'second')
    expect(screen.getByText('Work')).toBeVisible()
    expect(screen.getByText('00:00:05')).toBeVisible()

    addSystemTime(5, 'second')
    expect(screen.getByText('Rest')).toBeVisible()
    expect(screen.getByText('00:00:07')).toBeVisible()
  })

  it('edits stored interval settings', async () => {
    setIntervalSettings({ delay: 6, work: 5, rest: 5 })
    const { user } = await renderAndStartTimer()

    // go through a few rounds
    addSystemTime(30, 'second')

    // change delay
    await user.click(screen.getByLabelText(/interval/))
    await user.click(screen.getByLabelText(/Change interval settings/))
    await user.type(screen.getByLabelText('Delay'), '2')
    await user.click(screen.getByText('Confirm'))

    // resets timer
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Delay')).toBeVisible()
    expect(screen.getByText('00:00:02')).toBeVisible()
  })

  it('resets rest timer after stopping interval timer', async () => {
    setIntervalSettings({ delay: 1, work: 1, rest: 1 })
    const { user } = await renderAndStartTimer()

    // increment rest timer
    addSystemTime(30, 'second')

    // start and stop interval
    await user.click(screen.getByLabelText(/interval/))
    await user.click(screen.getByLabelText(/Stop interval/))

    // resets rest timer
    expect(screen.queryByText('Delay')).not.toBeInTheDocument()
    expect(screen.getByText('00:00:00')).toBeVisible()
  })

  it('shows rep count after finishing', async () => {
    setIntervalSettings({ delay: 0, work: 1, rest: 2 })
    const { user } = await renderAndStartTimer()

    await user.click(screen.getByLabelText(/interval/))
    // need to do separate calls so the component can rerender
    addSystemTime(1, 'second') // work 1
    addSystemTime(2, 'second')
    addSystemTime(1, 'second') // work 2
    addSystemTime(2, 'second')
    addSystemTime(1, 'second') // work 3

    await user.click(screen.getByLabelText(/Stop interval/))

    // snackbar appears
    expect(await screen.findByText(/completed 3 reps/)).toBeVisible()
  })
})
