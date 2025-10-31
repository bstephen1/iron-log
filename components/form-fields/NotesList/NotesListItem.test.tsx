import type { ComponentProps } from 'react'
import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/util/test/rtl'
import { createNote } from '../../../models/Note'
import NotesListItem from './NotesListItem'

const mockHandleDelete = vi.fn()
const mockUpdate = vi.fn()
const note = createNote('my note')
const index = 0

const defaultProps: ComponentProps<typeof NotesListItem> = {
  handleDelete: mockHandleDelete,
  handleUpdate: mockUpdate,
  note,
  index,
}
const otherDiv = 'other'

/** renders NotesListItem with default props and an extra clickable div
 *  that can trigger onBlur
 */
const TestComponent = (
  props: Partial<ComponentProps<typeof NotesListItem>>
) => (
  <div>
    <div>{otherDiv}</div>
    <NotesListItem {...defaultProps} {...props} />
  </div>
)

it('deletes empty notes', async () => {
  const { user } = render(<TestComponent note={createNote('x')} />)

  await user.type(screen.getByText('x'), '[Backspace]')
  expect(screen.getByPlaceholderText(/empty note/i)).toBeVisible()

  await user.click(screen.getByText('other'))
  expect(mockHandleDelete).toHaveBeenCalled()
})

it('submits non-empty note', async () => {
  const { user } = render(<TestComponent />)

  await user.click(screen.getByText(note.value))
  await user.paste('changes')
  await user.click(screen.getByText('other'))

  expect(mockUpdate).toHaveBeenCalledWith(index, {
    ...note,
    value: `${note.value}changes`,
  })
})

it('updates tags', async () => {
  const tag = 'some tag'
  const { user } = render(<TestComponent options={[tag]} />)

  await user.click(screen.getByText('no tag'))
  await user.click(screen.getByText(tag))

  expect(mockUpdate).toHaveBeenCalledWith(index, { ...note, tags: [tag] })
})

it('renders in readonly mode', () => {
  render(<NotesListItem {...defaultProps} readOnly />)

  expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument()
})
