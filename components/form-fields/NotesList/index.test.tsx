import { vi, it, expect } from 'vitest'
import NotesList from '.'
import { render, screen } from '../../../lib/testUtils'
import { createNote } from '../../../models/Note'

const mockSubmit = vi.fn()

it('adds a note', async () => {
  const initialNote = createNote('note')
  const initialNotes = [initialNote]
  const { user } = render(
    <NotesList handleSubmit={mockSubmit} notes={initialNotes} />
  )

  await user.click(screen.getByPlaceholderText(/add/i))
  await user.paste('new note')
  await user.click(screen.getByLabelText('Confirm'))

  expect(mockSubmit).toHaveBeenCalledWith(
    [expect.objectContaining({ value: 'new note' })].concat(initialNotes)
  )
})

it('deletes a note', async () => {
  const remainingNote = createNote('note')
  const initialNotes = [createNote('expendable'), remainingNote]
  const { user } = render(
    <NotesList handleSubmit={mockSubmit} notes={initialNotes} />
  )

  await user.click(screen.getAllByLabelText(/delete/i)[0])

  expect(mockSubmit).toHaveBeenCalledWith([remainingNote])
})

it('updates notes', async () => {
  const updatedNote = createNote('note')
  const initialNotes = [createNote('first'), updatedNote, createNote('other')]
  const { user } = render(
    <NotesList handleSubmit={mockSubmit} notes={initialNotes} />
  )

  await user.click(screen.getByText(updatedNote.value))
  await user.paste('changes')
  // switch focus to trigger submit
  // note: change is also triggered with a long debounce but fakeTimers
  // were not working to trigger that
  await user.click(screen.getByLabelText('Confirm'))

  expect(mockSubmit).toHaveBeenCalledWith([
    initialNotes[0],
    { ...updatedNote, value: updatedNote.value + 'changes' },
    initialNotes[2],
  ])
})

it('renders in readonly mode', () => {
  render(
    <NotesList label="label" handleSubmit={mockSubmit} notes={[]} readOnly />
  )

  expect(screen.queryByPlaceholderText(/add/i)).not.toBeInTheDocument()
  // in readonly with no notes there is special text
  expect(screen.getByText(/no notes/i)).toBeVisible()
  // also check that label is rendered when provided (not related to readonly)
  expect(screen.getByText('label')).toBeVisible()
})
