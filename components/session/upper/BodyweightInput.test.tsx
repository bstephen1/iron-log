import dayjs from 'dayjs'
import { URI_BODYWEIGHT } from '../../../lib/frontend/constants'
import { render, screen, useServer } from '../../../lib/testUtils'
import BodyweightInput from './BodyweightInput'
import { createBodyweight } from '../../../models/Bodyweight'

const date2020 = dayjs('2020-01-01')
const date2000 = dayjs('2000-01-01')
const officialBw2000 = createBodyweight(45, 'official', date2000)

it('renders with no data', async () => {
  useServer(URI_BODYWEIGHT, [])
  render(<BodyweightInput day={date2020} />)

  expect(screen.getByText(/loading/i)).toBeVisible()

  expect(await screen.findByText(/no existing official/i)).toBeVisible()
})

it('renders official weigh-in initially', async () => {
  const weight = 45
  const date = '2000-01-01'
  useServer(URI_BODYWEIGHT, [createBodyweight(weight, 'official', dayjs(date))])

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
  useServer(URI_BODYWEIGHT, [])
  const { user } = render(<BodyweightInput day={date2020} />)

  expect(await screen.findByText(/no existing official/i)).toBeVisible()

  // after switching to unofficial mode we can return the latest unofficial bodyweight
  useServer(URI_BODYWEIGHT, [
    createBodyweight(weight, 'unofficial', dayjs(date)),
  ])

  await user.click(screen.getByLabelText('Options'))
  await user.click(screen.getByText('unofficial weigh-ins'))

  expect(await screen.findByText(/using latest unofficial/i)).toBeVisible()
  expect(screen.getByText(date, { exact: false })).toBeVisible()
  expect(screen.getByDisplayValue(weight)).toBeVisible()
})

it('does not render data if unexpected weigh-in type is received', async () => {
  const weight = 45
  const date = '2010-01-01'
  useServer(URI_BODYWEIGHT, [
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
    useServer(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
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
    useServer(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2000} />)
    const input = screen.getByLabelText('bodyweight input')
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
    useServer(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    await user.type(input, '{End}{Backspace}{Backspace}')

    expect(await screen.findByText(/must have a value/i)).toBeVisible()
    expect(screen.getByLabelText('Submit')).toBeDisabled()
  })

  it('resets to existing value when button is clicked', async () => {
    useServer(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    await user.type(input, '3')
    await user.click(screen.getByLabelText('Reset'))

    expect(await screen.findByLabelText('Reset')).not.toBeVisible()
    // still visible since latest bw is not current date
    expect(screen.getByLabelText('Submit')).toBeVisible()
  })

  it('submits and revalidates when button is clicked', async () => {
    useServer(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    // simulate the res from revalidation is different from UI value
    const newWeight = 15

    const newBW = createBodyweight(newWeight, 'official', date2020)
    useServer(
      URI_BODYWEIGHT + newBW.date,
      newBW,
      // slight delay is necessary for the optimistic data to be detected
      { delay: 100 }
    )

    await user.type(input, '{End}3')
    await user.click(screen.getByLabelText('Submit'))

    // value should remain as what was inputted while revalidating
    expect(await screen.findByDisplayValue('453')).toBeVisible()
    // after revalidation should update to the server response
    expect(await screen.findByDisplayValue(newWeight)).toBeVisible()
    expect(screen.getByLabelText('Reset')).not.toBeVisible()
    expect(screen.getByLabelText('Submit')).not.toBeVisible()
  })
})
