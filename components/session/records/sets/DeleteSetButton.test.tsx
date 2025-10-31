import { expect, it } from 'vitest'
import { updateRecordFields } from '../../../../lib/backend/mongoService'
import { render, screen } from '../../../../lib/util/test/rtl'
import DeleteSetButton from './DeleteSetButton'

it('deletes', async () => {
  const { user } = render(
    <DeleteSetButton
      _id="id"
      index={1}
      sets={[{ reps: 1 }, { reps: 2 }, { reps: 3 }]}
    />
  )

  await user.click(screen.getByRole('button'))

  expect(updateRecordFields).toHaveBeenCalledWith('id', {
    sets: [{ reps: 1 }, { reps: 3 }],
  })
})
