import { expect, it, vi } from 'vitest'
import { DEFAULT_CLOTHING_OFFSET } from '../../lib/frontend/constants'
import { render, screen } from '../../lib/test/rtl'
import GraphOptionsForm from './GraphOptionsForm'

const mockUpdateOptions = vi.fn()

it('updates', async () => {
  const { user } = render(
    <GraphOptionsForm
      updateGraphOptions={mockUpdateOptions}
      graphOptions={{
        showBodyweight: true,
        includeUnofficial: true,
      }}
      recordDisplay={{
        grouping: 'daily',
        operator: 'highest',
        field: 'weight',
      }}
      updateRecordDisplay={vi.fn()}
    />
  )

  await user.click(screen.getByText('Show bodyweight'))
  await user.click(screen.getByText('Use unofficial weigh-ins'))
  await user.click(screen.getByText('Use smoothed line'))
  await user.type(screen.getByLabelText('Clothing offset'), '1')

  expect(mockUpdateOptions).toHaveBeenCalledTimes(4)
})

// this confirms the input is not coerced to "0" when it becomes empty
// eg if input is "1" and you enter Backspace it should not become "0"
it('updates clothing offset to undefined instead of 0', async () => {
  const { user } = render(
    <GraphOptionsForm
      updateGraphOptions={mockUpdateOptions}
      graphOptions={{
        showBodyweight: true,
        includeUnofficial: true,
        clothingOffset: DEFAULT_CLOTHING_OFFSET,
      }}
      recordDisplay={{
        grouping: 'daily',
        operator: 'highest',
        field: 'weight',
      }}
      updateRecordDisplay={vi.fn()}
    />
  )

  await user.click(screen.getByLabelText('Clothing offset'))
  await user.keyboard('{Backspace}')

  expect(mockUpdateOptions).toHaveBeenCalledWith({ clothingOffset: undefined })
})
