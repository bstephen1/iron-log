import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { fetchBodyweights } from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/testUtils'
import { createBodyweight } from '../../../models/Bodyweight'
import BodyweightInput from './BodyweightInput'

const date2020 = dayjs('2020-01-01')
const date2000 = dayjs('2000-01-01')
const officialBw2000 = createBodyweight(45, 'official', date2000)

it('renders with no data', async () => {
  render(<BodyweightInput day={date2020} />)

  expect(screen.getByText(/loading/i)).toBeVisible()

  expect(await screen.findByText(/no existing official/i)).toBeVisible()
})

it('renders official weigh-in initially', async () => {
  const weight = 45
  const date = '2000-01-01'
  vi.mocked(fetchBodyweights).mockResolvedValue([
    createBodyweight(weight, 'official', dayjs(date)),
  ])

  render(<BodyweightInput day={date2020} />)

  expect(screen.getByText(/loading/i)).toBeVisible()

  expect(await screen.findByText(/using latest official/i)).toBeVisible()
  expect(screen.getByText(date, { exact: false })).toBeVisible()
  expect(screen.getByDisplayValue(weight)).toBeVisible()
})

it('renders unofficial weigh-in when switching mode to unofficial', async () => {
  const weight = 45
  const date = '2010-01-01'
  // initial fetch must return an empty array because there is no official data
  const { user } = render(<BodyweightInput day={date2020} />)

  expect(await screen.findByText(/no existing official/i)).toBeVisible()

  // after switching to unofficial mode we can return the latest unofficial bodyweight
  vi.mocked(fetchBodyweights).mockResolvedValue([
    createBodyweight(weight, 'unofficial', dayjs(date)),
  ])

  await user.click(screen.getByLabelText(/type/))
  await user.click(screen.getByText('unofficial weigh-ins'))

  expect(await screen.findByText(/using latest unofficial/i)).toBeVisible()
  expect(screen.getByText(date, { exact: false })).toBeVisible()
  expect(screen.getByDisplayValue(weight)).toBeVisible()
})

it('does not render data if unexpected weigh-in type is received', async () => {
  const weight = 45
  const date = '2010-01-01'
  vi.mocked(fetchBodyweights).mockResolvedValue([
    createBodyweight(weight, 'unofficial', dayjs(date)),
  ])
  render(<BodyweightInput day={date2020} />)

  expect(await screen.findByText(/no existing official/i)).toBeVisible()
  expect(screen.queryByDisplayValue(weight)).not.toBeInTheDocument()
})

// These tests have historically had issues with where the cursor was placed on focus.
// It was not reliably starting at the start or end of the input.
// user.clear() is not working on the input so we can't easily just clear out the value.
// We can use the home/end keys to ensure it starts at a known location though.
describe('input', () => {
  it('shows reset and submit buttons when input value is different than existing value', async () => {
    vi.mocked(fetchBodyweights).mockResolvedValue([officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('Bodyweight')
    await screen.findByText(/official/i)

    await user.type(input, '{End}3')

    expect(await screen.findByLabelText('Reset')).toBeVisible()
    expect(screen.getByLabelText('Submit')).toBeVisible()
    expect(screen.getByDisplayValue('453')).toBeVisible()

    await user.type(input, '{Backspace}')

    expect(await screen.findByLabelText('Reset')).not.toBeVisible()
    // submit is still visible since latest bw data is not for current date
    expect(screen.getByLabelText('Submit')).toBeVisible()
  })

  // this is the same as the previous test but the current date is set to the same day as the latest BW value
  it('does not show submit button when latest bodyweight is unchanged and matches current date', async () => {
    vi.mocked(fetchBodyweights).mockResolvedValue([officialBw2000])
    const { user } = render(<BodyweightInput day={date2000} />)
    const input = screen.getByLabelText('Bodyweight')
    await screen.findByText(/official/i)

    await user.type(input, '{End}3')

    expect(await screen.findByLabelText('Reset')).toBeVisible()
    expect(screen.getByLabelText('Submit')).toBeVisible()
    expect(screen.getByDisplayValue('453')).toBeVisible()

    await user.type(input, '{Backspace}')

    expect(await screen.findByLabelText('Reset')).not.toBeVisible()
    // submit is not visible since latest bw data is already on current date
    expect(screen.getByLabelText('Submit')).not.toBeVisible()
  })

  it('validates against changing an existing value to be empty', async () => {
    vi.mocked(fetchBodyweights).mockResolvedValue([officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('Bodyweight')
    await screen.findByText(/official/i)

    await user.type(input, '{End}{Backspace}{Backspace}')

    expect(await screen.findByText(/must have a value/i)).toBeVisible()
    expect(screen.getByLabelText('Submit')).toBeDisabled()
  })

  it('resets to existing value when button is clicked', async () => {
    vi.mocked(fetchBodyweights).mockResolvedValue([officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('Bodyweight')
    await screen.findByText(/official/i)

    await user.type(input, '3')
    await user.click(screen.getByLabelText('Reset'))

    expect(await screen.findByLabelText('Reset')).not.toBeVisible()
    // still visible since latest bw is not current date
    expect(screen.getByLabelText('Submit')).toBeVisible()
  })

  it('submits when button is clicked', async () => {
    vi.mocked(fetchBodyweights).mockResolvedValue([officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('Bodyweight')
    await screen.findByText(/official/i)

    await user.type(input, '{End}3')
    await user.click(screen.getByLabelText('Submit'))

    // input displays the typed value even tho server mock is still returning old value
    // todo: playwright test with bw exercise where updating the weight updates weight in record sets
    expect(
      await screen.findByDisplayValue(officialBw2000.value + '3')
    ).toBeVisible()
    expect(screen.getByLabelText('Reset')).not.toBeVisible()
    expect(screen.getByLabelText('Submit')).not.toBeVisible()
  })
})
