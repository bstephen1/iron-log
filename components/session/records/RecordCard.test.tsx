import { expect, it, vi } from 'vitest'
import {
  fetchExercises,
  fetchRecords,
  updateExerciseFields,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import { ignoreConsoleErrorOnce } from '../../../lib/util/test/console'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'
import { createRecord } from '../../../models/Record'
import RecordCard from './RecordCard'

const exercise = createExercise('finger curls')

it('mutates', async () => {
  localStorage.setItem('cardHeaderActions', '10') // avoid needing to click "More..."
  const record = createRecord('2000-01-01', {
    exercise,
  })
  vi.mocked(fetchRecords).mockResolvedValue([record])
  vi.mocked(fetchExercises).mockResolvedValue([
    exercise,
    createExercise('other'),
  ])
  const { user } = render(
    <RecordCard id={record._id} date={record.date} swiperIndex={0} />
  )

  // update record exercise
  await user.click(await screen.findByLabelText('Exercise'))
  await user.click(screen.getByText('other'))
  expect(updateRecordFields).toHaveBeenCalled()

  // update exercise notes
  await user.click(screen.getByLabelText('Exercise notes'))
  await user.type(screen.getByPlaceholderText('Add note'), 'x')
  await user.click(screen.getByLabelText('Confirm'))

  expect(updateExerciseFields).toHaveBeenCalled()
})

it('displays error when update fails', async () => {
  const record = createRecord('2000-01-01')
  vi.mocked(fetchRecords).mockResolvedValue([record])
  const { user } = render(
    <RecordCard id={record._id} date={record.date} swiperIndex={0} />
  )

  // update record
  vi.mocked(updateRecordFields).mockRejectedValue(new Error('error'))
  ignoreConsoleErrorOnce()
  await user.click(await screen.findByLabelText('Add new set'))

  expect(updateRecordFields).toHaveBeenCalled()

  await screen.findByText(/not saved/)
})
