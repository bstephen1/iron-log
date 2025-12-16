import { expect, it } from 'vitest'
import { updateRecordFields } from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import RecordModifierComboBox from './RecordModifierComboBox'

it('mutates', async () => {
  const { user } = render(
    <RecordModifierComboBox
      _id="1"
      availableModifiers={['one', 'two']}
      activeModifiers={['one']}
    />
  )

  await user.click(screen.getByText('one'))
  await user.click(screen.getByText('two'))

  expect(updateRecordFields).toHaveBeenCalledWith('1', {
    activeModifiers: ['one', 'two'],
  })
})
