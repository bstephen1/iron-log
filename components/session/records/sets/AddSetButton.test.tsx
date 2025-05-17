import { beforeEach, expect, it, vi, type MockInstance } from 'vitest'
import * as restService from '../../../../lib/frontend/restService'
import { render, screen } from '../../../../lib/testUtils'
import { generateId } from '../../../../lib/util'
import AddSetButton from './AddSetButton'
import { type Set } from '../../../../models/Set'

const _id = generateId()
let updateFieldsSpy: MockInstance

beforeEach(() => {
  updateFieldsSpy = vi.spyOn(restService, 'updateRecordFields')
})

it('adds initial set', async () => {
  const { user } = render(<AddSetButton sets={[]} _id={_id} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(updateFieldsSpy).toHaveBeenCalledWith(_id, { sets: [{}] })
})

it('adds set based on previous unilateral left set', async () => {
  const initialSets: Set[] = [{ weight: 1 }, { time: 5, side: 'L', effort: 8 }]
  const { user } = render(<AddSetButton sets={initialSets} _id={_id} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(updateFieldsSpy).toHaveBeenCalledWith(_id, {
    // does not include effort
    sets: [...initialSets, { side: 'R', time: 5 }],
  })
})

it('adds set based on previous unilateral right set', async () => {
  const initialSets: Set[] = [{ side: 'R' }]
  const { user } = render(<AddSetButton sets={initialSets} _id={_id} />)

  await user.click(screen.getByLabelText(/Add/))

  expect(updateFieldsSpy).toHaveBeenCalledWith(_id, {
    sets: [...initialSets, { side: 'L' }],
  })
})
