import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/test/rtl'
import RecordModifierComboBox from './RecordModifierComboBox'

const mockMutate = vi.fn()

it('mutates', async () => {
  const { user } = render(
    <RecordModifierComboBox
      mutateRecordFields={mockMutate}
      availableModifiers={['one', 'two']}
      activeModifiers={['one']}
    />
  )

  await user.click(screen.getByText('one'))
  await user.click(screen.getByText('two'))

  expect(mockMutate).toHaveBeenCalledWith({ activeModifiers: ['one', 'two'] })
})
