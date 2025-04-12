import { render, screen } from '../../lib/testUtils'
import { Status } from '../../models/Status'
import StatusSelectField from './StatusSelectField'

const mockHandleUpdate = vi.fn()

it('calls update handler', async () => {
  const { user } = render(
    <StatusSelectField status={Status.active} handleUpdate={mockHandleUpdate} />
  )

  // open dropdown and change value
  await user.click(screen.getByText(Status.active))
  await user.click(screen.getByText(Status.archived))

  expect(mockHandleUpdate).toHaveBeenCalledWith({ status: Status.archived })
})
