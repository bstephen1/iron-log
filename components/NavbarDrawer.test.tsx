import {
  devUserId,
  guestUserName,
  sampleLogDate,
} from '../lib/frontend/constants'
import { render, screen } from '../lib/testUtils'
import NavbarDrawer from './NavbarDrawer'

const mocks = vi.hoisted(() => ({
  now: '2000-01-01',
}))
vi.mock('dayjs', () => ({
  default: () => ({
    format: () => mocks.now,
  }),
}))

it('renders with sample session link', async () => {
  const { user } = render(<NavbarDrawer />, {
    user: { name: guestUserName, id: devUserId },
  })

  await user.click(screen.getByLabelText(/open/))

  expect(screen.getByRole('link', { name: 'Today' })).toHaveAttribute(
    'href',
    `/sessions/${sampleLogDate}`
  )
})

it("renders with today's session link", async () => {
  const { user } = render(<NavbarDrawer />)

  await user.click(screen.getByLabelText(/open/))

  expect(screen.getByRole('link', { name: 'Today' })).toHaveAttribute(
    'href',
    `/sessions/${mocks.now}`
  )
})
