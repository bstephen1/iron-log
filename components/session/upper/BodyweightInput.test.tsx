import dayjs from 'dayjs'
import { URI_BODYWEIGHT } from '../../../lib/frontend/constants'
import { render, screen, useServerOnce } from '../../../lib/testUtils'
import Bodyweight from '../../../models/Bodyweight'
import BodyweightInput from './BodyweightInput'

const date2020 = dayjs('2020-01-01')
const date2000 = dayjs('2000-01-01')
const officialBw2000 = new Bodyweight(45, 'official', date2000)

it('renders with no data', async () => {
  useServerOnce(URI_BODYWEIGHT, [])
  render(<BodyweightInput day={date2020} />)

  expect(screen.getByText(/loading/i)).toBeVisible()

  expect(await screen.findByText(/no existing official/i)).toBeVisible()
})

it('renders official weigh-in initially', async () => {
  const weight = 45
  const date = '2000-01-01'
  useServerOnce(URI_BODYWEIGHT, [
    new Bodyweight(weight, 'official', dayjs(date)),
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
  useServerOnce(URI_BODYWEIGHT, [])
  const { user } = render(<BodyweightInput day={date2020} />)

  expect(await screen.findByText(/no existing official/i)).toBeVisible()

  // after switching to unofficial mode we can return the latest unofficial bodyweight
  useServerOnce(URI_BODYWEIGHT, [
    new Bodyweight(weight, 'unofficial', dayjs(date)),
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
  useServerOnce(URI_BODYWEIGHT, [
    new Bodyweight(weight, 'unofficial', dayjs(date)),
  ])
  render(<BodyweightInput day={date2020} />)

  expect(await screen.findByText(/no existing official/i)).toBeVisible()
  expect(screen.queryByDisplayValue(weight)).not.toBeInTheDocument()
})

describe('input', () => {
  it('shows reset and submit buttons when input value is different than existing value', async () => {
    useServerOnce(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    await user.type(input, '30')

    expect(await screen.findByLabelText('Reset')).toBeVisible()
    expect(screen.getByLabelText('Submit')).toBeVisible()
    expect(screen.getByDisplayValue('3045')).toBeVisible()

    await user.type(input, '{Backspace}{Backspace}')

    expect(await screen.findByLabelText('Reset')).not.toBeVisible()
    // submit is still visible since latest bw data is not for current date
    expect(screen.getByLabelText('Submit')).toBeVisible()
  })

  it('does not show submit button when latest bodyweight is unchanged and matches current date', async () => {
    useServerOnce(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2000} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    await user.type(input, '30')

    expect(await screen.findByLabelText('Reset')).toBeVisible()
    expect(screen.getByLabelText('Submit')).toBeVisible()
    expect(screen.getByDisplayValue('3045')).toBeVisible()

    await user.type(input, '{Backspace}{Backspace}')

    expect(await screen.findByLabelText('Reset')).not.toBeVisible()
    // submit is not visible since latest bw data is already on current date
    expect(screen.getByLabelText('Submit')).not.toBeVisible()
  })

  it('validates against changing an existing value to be empty', async () => {
    useServerOnce(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    // After much confusion, I realized userEvent must put the cursor at the START of the input, not the end...
    await user.type(input, '{Delete}{Delete}')

    expect(await screen.findByText(/must have a value/i)).toBeVisible()
    // mui makes it exceedingly annoying to access these buttons.
    // The outer button has the role and whether it's disabled, but the child svg img has the label
    expect(screen.getByTestId('submit button')).not.toBeEnabled()
  })

  it('resets to existing value when button is clicked', async () => {
    useServerOnce(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    await user.type(input, '30')
    await user.click(screen.getByLabelText('Reset'))

    expect(await screen.findByLabelText('Reset')).not.toBeVisible()
    // still visible since latest bw is not current date
    expect(screen.getByLabelText('Submit')).toBeVisible()
  })

  it('submits and revalidates when button is clicked', async () => {
    useServerOnce(URI_BODYWEIGHT, [officialBw2000])
    const { user } = render(<BodyweightInput day={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    // simulate the res from revalidation is different from UI value
    const newWeight = 15
    useServerOnce(
      URI_BODYWEIGHT,
      new Bodyweight(newWeight, 'official', date2020),
      // slight delay is necessary for the optimistic data to be detected
      { delay: 100 },
    )

    await user.type(input, '3')
    await user.click(screen.getByLabelText('Submit'))

    // value should remain as what was inputted while revalidating
    expect(await screen.findByDisplayValue(345)).toBeVisible()
    // after revalidation should update to the server response
    expect(await screen.findByDisplayValue(newWeight)).toBeVisible()
    expect(screen.getByLabelText('Reset')).not.toBeVisible()
    expect(screen.getByLabelText('Submit')).not.toBeVisible()
  })
})
