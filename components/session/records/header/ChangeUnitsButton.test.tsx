import { expect, it } from 'vitest'
import { updateExerciseFields } from '../../../../lib/backend/mongoService'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import ChangeUnitsButton from './ChangeUnitsButton'

it('updates units', async () => {
  const { user } = render(
    <ChangeUnitsButton _id="1" displayFields={DEFAULT_DISPLAY_FIELDS} />
  )

  await user.click(screen.getByLabelText('Change units'))
  await user.click(screen.getByText('lbs'))

  expect(updateExerciseFields).toHaveBeenCalled()

  // does not show units with only one option
  expect(screen.queryByText('reps')).not.toBeInTheDocument()

  // close dialog
  await user.keyboard('[Escape]')
  await waitFor(() => {
    expect(screen.queryByText('lbs')).not.toBeInTheDocument()
  })
})

it('disables when id is missing', async () => {
  render(<ChangeUnitsButton displayFields={DEFAULT_DISPLAY_FIELDS} />)

  expect(screen.getByLabelText('Change units')).toBeDisabled()
})
