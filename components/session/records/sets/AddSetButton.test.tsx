import { expect, it } from 'vitest'
import { addSet } from '../../../../lib/backend/mongoService'
import { generateId } from '../../../../lib/id'
import { render, screen } from '../../../../lib/test/rtl'
import type { Set } from '../../../../models/Set'
import AddSetButton from './AddSetButton'

const _id = generateId()

it('adds initial set', async () => {
  const { user } = render(<AddSetButton _id={_id} />)

  await user.click(screen.getByLabelText(/Add/))

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
