import type { ComponentProps } from 'react'
import { beforeEach, expect, it, vi } from 'vitest'
import {
  fetchRecords,
  fetchSessionLog,
  updateRecordFields,
  upsertSessionLog,
} from '../../../../lib/backend/mongoService'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { createNote } from '../../../../models/Note'
import { createRecord } from '../../../../models/Record'
import { createSessionLog } from '../../../../models/SessionLog'
import ReccordNotesButton from './RecordNotesButton'

const sessionLog = createSessionLog('2000-01-01')
const note = createNote('note')
const record = createRecord('2000-01-01')

const TestWrapper = (
  props: Partial<ComponentProps<typeof ReccordNotesButton>>
) => (
  <ReccordNotesButton
    date={sessionLog.date}
    notes={[note]}
    _id={record._id}
    {...props}
  />
)

beforeEach(() => {
  vi.mocked(fetchSessionLog).mockResolvedValue(sessionLog)
})

it('submits notes', async () => {
  const sessionNote = createNote('session note', ['Session'])
  const { user } = render(<TestWrapper notes={[sessionNote]} />)

  await user.click(screen.getByRole('button'))
  await user.type(screen.getByPlaceholderText(/Add/), 'x')
  await user.click(screen.getByLabelText('Confirm'))

  expect(updateRecordFields).toHaveBeenCalledWith(record._id, {
    notes: [expect.objectContaining({ value: 'x' })],
  })
  expect(upsertSessionLog).toHaveBeenCalledWith({
    ...sessionLog,
    notes: [sessionNote],
  })

  // close dialog
  await user.keyboard('[Escape]')
  await waitFor(() => {
    expect(screen.queryByPlaceholderText(/Add/)).not.toBeInTheDocument()
  })
})

it('shows tags for sets', async () => {
  vi.mocked(fetchRecords).mockResolvedValue([
    {
      ...record,
      sets: [
        { side: '' },
        { side: 'L' },
        { side: 'R' },
        { side: '' },
        { side: 'L' },
        { side: 'L' },
        { side: 'R' },
      ],
    },
  ])
  const { user } = render(<TestWrapper />)

  await user.click(screen.getByRole('button'))
  await user.click(screen.getByText('Record')) // open tag menu

  expect(screen.getByText('Session')).toBeVisible()
  expect(screen.getByText('Set 1')).toBeVisible()
  expect(screen.getByText('Set 2 (L)')).toBeVisible()
  expect(screen.getByText('Set 2 (R)')).toBeVisible()
  expect(screen.getByText('Set 3')).toBeVisible()
  expect(screen.getByText('Set 4 (L)')).toBeVisible()
  expect(screen.getByText('Set 4 (R)')).toBeVisible()
  expect(screen.getByText('Set 5 (L)')).toBeVisible()
})

it('renders as readonly', async () => {
  const { user } = render(<TestWrapper _id={undefined} />)

  await user.click(screen.getByRole('button'))

  expect(screen.getByText(note.value)).toBeVisible()
  expect(screen.queryByLabelText(/Add/)).not.toBeInTheDocument()
})

it('does not submit if sessionLog is loading', async () => {
  vi.mocked(fetchSessionLog).mockResolvedValue(null)
  const { user } = render(<TestWrapper />)

  await user.click(screen.getByRole('button'))
  await user.type(screen.getByPlaceholderText(/Add/), 'x')
  await user.click(screen.getByLabelText('Confirm'))

  expect(updateRecordFields).not.toHaveBeenCalled()
})

it('can delete last note', async () => {
  const sessionNote = createNote('session note', ['Session'])
  const { user } = render(<TestWrapper notes={[sessionNote]} />)

  await user.click(screen.getByRole('button'))
  await user.click(screen.getByLabelText('Delete'))

  expect(updateRecordFields).toHaveBeenCalledWith(record._id, {
    notes: [],
  })
  expect(upsertSessionLog).toHaveBeenCalledWith({
    ...sessionLog,
    notes: [],
  })
})
