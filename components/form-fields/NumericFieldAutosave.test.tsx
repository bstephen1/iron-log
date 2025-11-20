import { expect, it, vi } from 'vitest'
import { render, screen } from '../../lib/test/rtl'
import NumericFieldAutosave from './NumericFieldAutosave'

const mockSubmit = vi.fn()

it('converts to number', async () => {
  const { user } = render(
    <NumericFieldAutosave handleSubmit={mockSubmit} debounceMilliseconds={0} />
  )

  await user.type(screen.getByDisplayValue(''), '5')
  expect(mockSubmit).toHaveBeenCalledWith(5)
})

it('does not convert empty string to zero', async () => {
  const { user } = render(
    <NumericFieldAutosave
      handleSubmit={mockSubmit}
      initialValue={5}
      debounceMilliseconds={0}
    />
  )

  await user.clear(screen.getByDisplayValue('5'))

  expect(mockSubmit).toHaveBeenCalledWith(undefined)
})
