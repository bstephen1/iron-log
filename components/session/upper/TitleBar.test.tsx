import dayjs from 'dayjs'
import { render, screen } from 'lib/testUtils'
import { vi } from 'vitest'
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

  // have to use the date format the input uses
  await user.clear(screen.getByDisplayValue('01/01/2020'))
  await user.paste('01/05/2020')

  expect(mocks.push).toHaveBeenCalledWith('2020-01-05')
})
