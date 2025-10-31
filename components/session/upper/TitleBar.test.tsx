import { useRouter } from 'next/navigation'
import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/test/rtl'
import TitleBar from './TitleBar'

it('updates on date change', async () => {
  const mockPush = vi.fn()
  // @ts-expect-error only need push
  vi.mocked(useRouter).mockReturnValue({ push: mockPush })
  const { user } = render(<TitleBar date={'2020-01-05'} />)

  // update the date
  await user.click(await screen.findByText('05'))
  await user.paste('15')
  await user.click(screen.getByLabelText('Confirm'))

  expect(mockPush).toHaveBeenCalledWith('2020-01-15')
})
