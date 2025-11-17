import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import { ArrayMatchType } from '../../models/ArrayMatchType'
import MatchTypeSelector from './MatchTypeSelector'

const mockUpdate = vi.fn()
it('updates', async () => {
  const { user } = render(
    <MatchTypeSelector
      matchType={ArrayMatchType.Any}
      updateMatchType={mockUpdate}
      options={[ArrayMatchType.Any, ArrayMatchType.Partial]}
      descriptions={{ [ArrayMatchType.Partial]: 'partial' }}
    />
  )

  await user.click(screen.getByLabelText('Select match type'))
  await user.click(screen.getByText('partial'))

  expect(mockUpdate).toHaveBeenCalled()
})
