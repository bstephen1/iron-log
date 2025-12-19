import { expect, it, vi } from 'vitest'
import { addSet, fetchRecords } from '../../../../lib/backend/mongoService'
import { useRecords } from '../../../../lib/frontend/data/useQuery'
import { testDate } from '../../../../lib/test/data'
import { render, screen } from '../../../../lib/test/rtl'
import { createRecord } from '../../../../models/Record'
import type { Set } from '../../../../models/Set'
import AddSetButton from './AddSetButton'

const record = createRecord(testDate)
const _id = record._id

it('adds set to record', async () => {
  const record2 = createRecord(testDate)
  vi.mocked(fetchRecords).mockResolvedValue([record, record2])
  // this component has no way to visibly wait for the data, so need a wrapper
  const LoadedButton = () => {
    const { isLoading } = useRecords({ date: testDate })

    return isLoading ? <div>loading</div> : <AddSetButton _id={record._id} />
  }

  const { user } = render(<LoadedButton />)

  await user.click(await screen.findByLabelText(/Add/))

  expect(addSet).toHaveBeenCalledWith(_id, {})
})

it('adds set based on previous unilateral left set', async () => {
  const prevSet: Set = { time: 5, side: 'L', effort: 8 }
  const { user } = render(<AddSetButton _id={_id} {...prevSet} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(addSet).toHaveBeenCalledWith(_id, {
    // does not include effort
    side: 'R',
    time: 5,
  })
})

it('adds set based on previous unilateral right set', async () => {
  const prevSet: Set = { side: 'R' }
  const { user } = render(<AddSetButton _id={_id} {...prevSet} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(addSet).toHaveBeenCalledWith(_id, { side: 'L' })
})
