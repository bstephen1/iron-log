import { expect, it, vi } from 'vitest'
import { deleteSet, fetchRecords } from '../../../../lib/backend/mongoService'
import { useRecords } from '../../../../lib/frontend/data/useQuery'
import { testDate } from '../../../../lib/test/data'
import { render, screen } from '../../../../lib/test/rtl'
import { createRecord } from '../../../../models/Record'
import DeleteSetButton from './DeleteSetButton'

it('deletes', async () => {
  const record = createRecord(testDate, { sets: [{}, {}] })
  const record2 = createRecord(testDate)
  vi.mocked(fetchRecords).mockResolvedValue([record, record2])
  // this component has no way to visibly wait for the data, so need a wrapper
  const LoadedButton = () => {
    const { isLoading } = useRecords({ date: testDate })

    return isLoading ? (
      <div>loading</div>
    ) : (
      <DeleteSetButton _id={record._id} index={1} />
    )
  }

  const { user } = render(<LoadedButton />)

  await user.click(await screen.findByRole('button'))

  expect(deleteSet).toHaveBeenCalledWith(record._id, 1)
})
