import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { render, screen } from 'lib/customRender'
import { URI_BODYWEIGHT } from 'lib/frontend/constants'
import { server } from 'mocks/server'
import Bodyweight from 'models/Bodyweight'
import { rest } from 'msw'
import BodyweightInput from './BodyweightInput'

const date2020 = dayjs('2020-01-01')

it('renders with no data', async () => {
  server.use(rest.get(URI_BODYWEIGHT, (_, res, ctx) => res(ctx.json([]))))
  render(<BodyweightInput date={date2020} />)

  expect(screen.getByText(/loading/i)).toBeVisible()

  expect(await screen.findByText(/no existing official/i)).toBeVisible()
})

it('renders official weigh-in initially', async () => {
  const weight = 45
  const date = '2000-01-01'
  server.use(
    rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
      res(ctx.json([new Bodyweight(weight, 'official', dayjs(date))]))
    )
  )

  render(<BodyweightInput date={date2020} />)

  expect(screen.getByText(/loading/i)).toBeVisible()

  expect(await screen.findByText(/using latest official/i)).toBeVisible()
  expect(screen.getByText(date, { exact: false })).toBeVisible()
  expect(screen.getByDisplayValue(weight)).toBeVisible()
})

it('renders unofficial weigh-in when switching mode to unofficial', async () => {
  const weight = 45
  const date = '2010-01-01'
  const user = userEvent.setup()
  // initial fetch must return an empty array because there is no official data
  server.use(rest.get(URI_BODYWEIGHT, (_, res, ctx) => res(ctx.json([]))))
  render(<BodyweightInput date={date2020} />)

  expect(await screen.findByText(/no existing official/i)).toBeVisible()

  // after switching to unofficial mode we can return the latest unofficial bodyweight
  server.use(
    rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
      res(ctx.json([new Bodyweight(weight, 'unofficial', dayjs(date))]))
    )
  )

  await user.click(screen.getByLabelText('options'))
  await user.click(screen.getByText('unofficial weigh-ins'))

  expect(await screen.findByText(/using latest unofficial/i)).toBeVisible()
  expect(screen.getByText(date, { exact: false })).toBeVisible()
  expect(screen.getByDisplayValue(weight)).toBeVisible()
})

it('does not render data if unexpected weigh-in type is received', async () => {
  const weight = 45
  const date = '2010-01-01'
  server.use(
    rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
      res(ctx.json([new Bodyweight(weight, 'unofficial', dayjs(date))]))
    )
  )
  render(<BodyweightInput date={date2020} />)

  expect(await screen.findByText(/no existing official/i)).toBeVisible()
  expect(screen.queryByDisplayValue(weight)).not.toBeInTheDocument()
})

describe('input', () => {
  it('shows reset and submit buttons when input value is different than existing value', async () => {
    const user = userEvent.setup()
    server.use(
      rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
        res(ctx.json([new Bodyweight(45, 'official', dayjs('2000-01-01'))]))
      )
    )
    render(<BodyweightInput date={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    await user.type(input, '30')

    expect(await screen.findByLabelText('reset')).toBeVisible()
    expect(screen.getByLabelText('submit')).toBeVisible()

    await user.type(input, '{Backspace}{Backspace}')

    expect(await screen.findByLabelText('reset')).not.toBeVisible()
    expect(screen.getByLabelText('submit')).not.toBeVisible()
  })

  it('validates against changing an existing value to be empty', async () => {
    const user = userEvent.setup()
    server.use(
      rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
        res(ctx.json([new Bodyweight(45, 'official', dayjs('2000-01-01'))]))
      )
    )
    render(<BodyweightInput date={date2020} />)
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
    const user = userEvent.setup()
    server.use(
      rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
        res(ctx.json([new Bodyweight(45, 'official', dayjs('2000-01-01'))]))
      )
    )
    render(<BodyweightInput date={date2020} />)
    const input = screen.getByLabelText('bodyweight input')
    await screen.findByText(/official/i)

    await user.type(input, '30')
    await user.click(screen.getByLabelText('reset'))

    // the input is uncontrolled. There doesn't seem to be a good way to get a hold of the unsubmitted value
    expect(await screen.findByLabelText('reset')).not.toBeVisible()
    expect(screen.getByLabelText('submit')).not.toBeVisible()
  })

  // getting the Text encoder not defined problem here.

  // xit('submits and revalidates when button is clicked', async () => {
  //   const user = userEvent.setup()
  //   server.use(
  //     rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
  //       res(ctx.json([new Bodyweight(45, 'official', dayjs('2000-01-01'))]))
  //     )
  //   )
  //   render(<BodyweightInput date={date2020} />)
  //   const input = screen.getByLabelText('bodyweight input')
  //   await screen.findByText(/official/i)

  //   //
  //   let apiReq
  //   server.use(
  //     rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
  //       res(ctx.json([new Bodyweight(45, 'official', dayjs('2000-01-01'))]))
  //     ),
  //     rest.put(URI_BODYWEIGHT, (req, res, ctx) => {
  //       apiReq = req
  //       return res(ctx.json(emptyApiResponse))
  //     })
  //   )
  //   await user.type(input, '30')
  //   await user.click(screen.getByLabelText('submit'))

  //   // the input is uncontrolled. There doesn't seem to be a good way to get a hold of the unsubmitted value
  //   expect(await screen.findByLabelText('reset')).not.toBeVisible()
  //   expect(screen.getByLabelText('submit')).not.toBeVisible()
  //   console.log(apiReq)
  // })

  // todo: submitting official does not overwrite unofficial, but does overwrite previous official
})
