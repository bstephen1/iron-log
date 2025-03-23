import { render, screen } from '../../../lib/testUtils'
import AddNote from './AddNote'

const mockHandleAdd = vi.fn()

it('submits the given note and resets the input', async () => {
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

  // reset
  await user.click(screen.getByLabelText(/clear/i))
  expect(screen.queryByText(noteText)).not.toBeInTheDocument()

  // submit
  await user.paste(noteText)
  await user.click(screen.getByLabelText(/add/i))
  expect(mockHandleAdd).toHaveBeenCalledWith(
    expect.objectContaining({
      value: noteText,
      tags: [changedTag],
    })
  )
})
