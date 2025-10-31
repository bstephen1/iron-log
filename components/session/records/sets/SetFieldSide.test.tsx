import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../../lib/util/test/rtl'
import SetFieldSide from './SetFieldSide'

const mockMutate = vi.fn()

it('updates', async () => {
  const { user } = render(
    <SetFieldSide
      value=""
      handleSetChange={mockMutate}
      // just for coverage
      slotProps={{
        select: {},
        htmlInput: {},
      }}
    />
  )

  await user.click(screen.getByRole('combobox'))
  await user.click(screen.getByText('L'))

  expect(mockMutate).toHaveBeenCalled()
})
