import dayjs from 'dayjs'
import { vi } from 'vitest'
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
  const { user } = render(<TitleBar day={dayjs('2020-01-01')} />)

  await user.clear(screen.getByText('2020'))
  await user.paste('2021')

  expect(mocks.push).toHaveBeenCalledWith('2021-01-01')
})
