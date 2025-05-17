import dayjs from 'dayjs'
import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/testUtils'
import TitleBar from './TitleBar'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
}))
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
}))

it('updates on date change', async () => {
  const { user } = render(<TitleBar day={dayjs('2020-01-05')} />)

  // update the date
  await user.click(screen.getByText('05'))
  await user.paste('15')
  await user.click(screen.getByLabelText('Confirm'))

  expect(mocks.push).toHaveBeenCalledWith('2020-01-15')
})
