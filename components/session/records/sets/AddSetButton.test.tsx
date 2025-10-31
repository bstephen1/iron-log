import { expect, it, vi } from 'vitest'
import { updateRecordFields } from '../../../../lib/backend/mongoService'
import { generateId } from '../../../../lib/util/id'
import { render, screen } from '../../../../lib/util/test/rtl'
import type { Set } from '../../../../models/Set'
import AddSetButton from './AddSetButton'

const _id = generateId()

it('adds initial set', async () => {
  const { user } = render(<AddSetButton sets={[]} _id={_id} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(vi.mocked(updateRecordFields))
  expect(vi.mocked(updateRecordFields)).toHaveBeenCalledWith(_id, {
    sets: [{}],
  })
})

it('adds set based on previous unilateral left set', async () => {
  const initialSets: Set[] = [{ weight: 1 }, { time: 5, side: 'L', effort: 8 }]
  const { user } = render(<AddSetButton sets={initialSets} _id={_id} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(vi.mocked(updateRecordFields)).toHaveBeenCalledWith(_id, {
    // does not include effort
    sets: [...initialSets, { side: 'R', time: 5 }],
  })
})

it('adds set based on previous unilateral right set', async () => {
  const initialSets: Set[] = [{ side: 'R' }]
  const { user } = render(<AddSetButton sets={initialSets} _id={_id} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(vi.mocked(updateRecordFields)).toHaveBeenCalledWith(_id, {
    sets: [...initialSets, { side: 'L' }],
  })
})
