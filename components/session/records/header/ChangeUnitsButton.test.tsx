import { expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '../../../../lib/util/test/rtl'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import ChangeUnitsButton from './ChangeUnitsButton'

const mockMutate = vi.fn()

it('updates units', async () => {
  const { user } = render(
    <ChangeUnitsButton
      mutateExerciseFields={mockMutate}
      displayFields={DEFAULT_DISPLAY_FIELDS}
    />
  )

  await user.click(screen.getByLabelText('Change units'))
  await user.click(screen.getByText('lbs'))

  expect(mockMutate).toHaveBeenCalled()

  // does not show units with only one option
  expect(screen.queryByText('reps')).not.toBeInTheDocument()

  // close dialog
  await user.keyboard('[Escape]')
  await waitFor(() => {
    expect(screen.queryByText('lbs')).not.toBeInTheDocument()
  })
})
