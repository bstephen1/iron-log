import { expect, it } from 'vitest'
import { updateRecordFields } from '../../../../lib/backend/mongoService'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import RenderSetRow from './RenderSetRow'

it('renders correct set', async () => {
  const { user } = render(
    <RenderSetRow
      displayFields={DEFAULT_DISPLAY_FIELDS}
      _id="1"
      index={1}
      sets={[{ reps: 1 }, { reps: 2 }]}
    />
  )

  expect(screen.queryByLabelText('Set 1')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Set 2')).toBeVisible()

  await user.type(screen.getByDisplayValue('2'), '5')
  await waitFor(() => {
    expect(updateRecordFields).toHaveBeenCalled()
  })
})

it('renders readonly set', async () => {
  render(
    <RenderSetRow
      displayFields={DEFAULT_DISPLAY_FIELDS}
      _id="1"
      index={0}
      sets={[{ reps: 1 }]}
      readOnly
    />
  )

  // no delete button
  expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument()
})
