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

it('renders official weigh-in', async () => {
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
})

it('renders unofficial weigh-in', async () => {
  const weight = 45
  const date = '2000-01-01'
  server.use(
    rest.get(URI_BODYWEIGHT, (_, res, ctx) =>
      res(ctx.json([new Bodyweight(weight, 'unofficial', dayjs(date))]))
    )
  )

  render(<BodyweightInput date={date2020} />)

  // this seems to be persisting the cache from the official test
  expect(await screen.findByText(/official/i)).toBeVisible()

  await userEvent.click(screen.getByLabelText('options'))
  await userEvent.click(screen.getByText('unofficial weigh-ins'))

  expect(await screen.findByText(/using latest unofficial/i)).toBeVisible()
  expect(screen.getByText(date, { exact: false })).toBeVisible()
})

// todo: editing value, submit/reset buttons
