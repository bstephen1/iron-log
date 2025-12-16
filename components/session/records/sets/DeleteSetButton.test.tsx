import { expect, it } from 'vitest'
import { deleteSet } from '../../../../lib/backend/mongoService'
import { render, screen } from '../../../../lib/test/rtl'
import DeleteSetButton from './DeleteSetButton'

it('deletes', async () => {
  const { user } = render(<DeleteSetButton _id="id" index={1} />)

  await user.click(screen.getByRole('button'))

  expect(deleteSet).toHaveBeenCalledWith('id', 1)
})
