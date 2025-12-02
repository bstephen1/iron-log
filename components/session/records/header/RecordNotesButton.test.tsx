import type { ComponentProps } from 'react'
import { beforeEach, expect, it, vi } from 'vitest'
import {
  fetchSessionLog,
  upsertSessionLog,
} from '../../../../lib/backend/mongoService'
import { render, screen, waitFor } from '../../../../lib/test/rtl'
import { createNote } from '../../../../models/Note'
import { createSessionLog } from '../../../../models/SessionLog'
import ReccordNotesButton from './RecordNotesButton'

const mockMutate = vi.fn()
const sessionLog = createSessionLog('2000-01-01')
const note = createNote('note')

const TestWrapper = (
  props: Partial<ComponentProps<typeof ReccordNotesButton>>
) => (
  <ReccordNotesButton
    date={sessionLog.date}
    notes={[note]}
    mutateRecordFields={mockMutate}
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

  expect(mockMutate).toHaveBeenCalledWith({
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
  const { user } = render(
    <TestWrapper sides={['', 'L', 'R', '', 'L', 'L', 'R']} />
  )

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
  const { user } = render(<TestWrapper mutateRecordFields={undefined} />)

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

  expect(mockMutate).not.toHaveBeenCalled()
})

it('can delete last note', async () => {
  const sessionNote = createNote('session note', ['Session'])
  const { user } = render(<TestWrapper notes={[sessionNote]} />)

  await user.click(screen.getByRole('button'))
  await user.click(screen.getByLabelText('Delete'))

  expect(mockMutate).toHaveBeenCalledWith({
    notes: [],
  })
  expect(upsertSessionLog).toHaveBeenCalledWith({
    ...sessionLog,
    notes: [],
  })
})
