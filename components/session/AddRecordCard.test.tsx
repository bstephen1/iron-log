import { expect, it, vi } from 'vitest'
import { addRecord, fetchExercises } from '../../lib/backend/mongoService'
import { render, screen } from '../../lib/test/rtl'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import AddRecordCard from './AddRecordCard'

it('adds record', async () => {
  vi.mocked(fetchExercises).mockResolvedValue([createExercise('squats')])
  const { user } = render(<AddRecordCard />)

  await user.click(screen.getByLabelText('Exercise'))
  await user.click(screen.getByText('squats'))
  await user.click(screen.getByText('Add record'))

  expect(vi.mocked(addRecord)).toHaveBeenCalled()
  // resets add record input
  expect(screen.getByLabelText('Exercise')).toHaveDisplayValue('')
})
