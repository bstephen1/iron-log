import { render, screen, waitFor, within } from '../../../lib/testUtils'
import DeleteButton from './DeleteButton'

const mockDelete = vi.fn()

it('calls handlers when buttons are clicked', async () => {
  const { user } = render(
    <DeleteButton type="type" name="name" handleDelete={mockDelete} />
  )

  const deleteButton = screen.getByRole('button', { name: /delete/i })
  await user.click(deleteButton)

  // cancel
  await user.click(screen.getByRole('button', { name: /cancel/i }))
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  expect(mockDelete).not.toHaveBeenCalled()

  // delete
  await user.click(deleteButton)
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: /delete/i,
    })
  )
  expect(mockDelete).toHaveBeenCalled()
})
