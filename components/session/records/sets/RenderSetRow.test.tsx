import { expect, it, vi } from 'vitest'
import { fetchRecords, updateSet } from '../../../../lib/backend/mongoService'
import { testDate } from '../../../../lib/test/data'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import { createRecord } from '../../../../models/Record'
import RenderSetRow from './RenderSetRow'

it('renders correct set', async () => {
  const record = createRecord(testDate, {
    sets: [{ reps: 1 }, { reps: 2 }],
  })
  vi.mocked(fetchRecords).mockResolvedValue([createRecord(testDate), record])

  const { user } = render(
    <RenderSetRow
      displayFields={DEFAULT_DISPLAY_FIELDS}
      _id={record._id}
      index={1}
      date={testDate}
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
  const record = createRecord('2000-01-01', { _id: '1', sets: [{ reps: 1 }] })
  vi.mocked(fetchRecords).mockResolvedValue([record])
  render(
    <RenderSetRow
      displayFields={DEFAULT_DISPLAY_FIELDS}
      _id={record._id}
      index={0}
      readOnly
      date={testDate}
    />
  )

  // no delete button
  expect(await screen.findByDisplayValue('1')).toBeVisible()
  expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument()
})
