import { useRouter } from 'next/navigation'
import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../../lib/util/test/rtl'
import ManageExerciseButton from './ManageExerciseButton'

it('links to given id', async () => {
  const mockPush = vi.fn()
  // @ts-expect-error only need push
  vi.mocked(useRouter).mockReturnValue({ push: mockPush })
  const { user } = render(<ManageExerciseButton _id="test" />)

  await user.click(screen.getByRole('button'))

  expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('test'))
})

it('renders as disabled with no id', () => {
  render(<ManageExerciseButton />)

  expect(screen.getByRole('button')).toBeDisabled()
})
