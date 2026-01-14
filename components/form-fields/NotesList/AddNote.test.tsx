import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../lib/test/rtl'
import AddNote from './AddNote'

const mockHandleAdd = vi.fn()

it('submits the given note', async () => {
  const initialTag = 'initial'
  const changedTag = 'changed'
  const noteText = 'my note'
  const options = [initialTag, changedTag]
  const placeholder = 'add a note'
  const { user } = render(
    <AddNote
      handleAdd={mockHandleAdd}
      options={options}
      initialTags={[initialTag]}
      placeholder={placeholder}
    />
  )

  // change the tag
  await user.click(screen.getByText(initialTag))
  await user.click(screen.getByText(changedTag))

  // change the text
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.paste(noteText)

  // submit
  await user.click(screen.getByLabelText('Confirm'))
  expect(mockHandleAdd).toHaveBeenCalledWith(
    expect.objectContaining({
      value: noteText,
      tags: [changedTag],
    })
  )
  // does not reset tag
  expect(screen.getByText(changedTag)).toBeVisible()
})

it('resets input', async () => {
  const initialTag = 'initial'
  const changedTag = 'changed'
  const noteText = 'my note'
  const options = [initialTag, changedTag]
  const placeholder = 'add a note'
  const { user } = render(
    <AddNote
      handleAdd={mockHandleAdd}
      options={options}
      initialTags={[initialTag]}
      placeholder={placeholder}
    />,
    { paletteMode: 'dark' }
  )

  // change the tag
  await user.click(screen.getByText(initialTag))
  await user.click(screen.getByText(changedTag))

  // change the text
  await user.click(screen.getByPlaceholderText(placeholder))
  await user.paste(noteText)

  // reset -- resets both tags and text
  await user.click(screen.getByLabelText('Clear'))
  expect(screen.queryByText(noteText)).not.toBeInTheDocument()
  expect(screen.queryByText(changedTag)).not.toBeInTheDocument()
})
