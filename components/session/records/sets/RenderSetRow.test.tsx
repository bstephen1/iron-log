import { expect, it } from 'vitest'
import { updateSet } from '../../../../lib/backend/mongoService'
import { testDate } from '../../../../lib/test/data'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import RenderSetRow from './RenderSetRow'

it('renders correct set', async () => {
  const { user } = render(
    <RenderSetRow
      displayFields={DEFAULT_DISPLAY_FIELDS}
      _id="1"
      index={1}
      date={testDate}
      reps={2}
    />
  )

  const repsInput = await screen.findByDisplayValue('2')

  expect(repsInput).toBeVisible()
  expect(screen.queryByLabelText('Set 1')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Set 2')).toBeVisible()

  await user.type(repsInput, '5')
  await waitFor(() => {
    expect(updateSet).toHaveBeenCalled()
  })
})

it('renders readonly set', async () => {
  render(
    <RenderSetRow
      displayFields={DEFAULT_DISPLAY_FIELDS}
      _id="1"
      index={0}
      readOnly
      date={testDate}
      reps={1}
    />
  )

  // no delete button
  expect(await screen.findByDisplayValue('1')).toBeVisible()
  expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument()
})
