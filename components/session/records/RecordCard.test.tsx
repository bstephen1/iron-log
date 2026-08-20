import type { ComponentProps } from 'react'
import { Swiper } from 'swiper/react'
import { expect, it, vi } from 'vitest'
import {
  addSet,
  fetchExercises,
  fetchRecords,
  updateExerciseFields,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { createTestRecord, testExercise } from '../../../lib/test/data'
import { render, screen } from '../../../lib/test/rtl'
import { ignoreConsoleErrorOnce } from '../../../lib/util/test/console'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'
import RecordCard from './RecordCard'

const TestWrapper = (props: ComponentProps<typeof RecordCard>) => (
  <Swiper>
    <RecordCard {...props} />
  </Swiper>
)

it('mutates', async () => {
  localStorage.setItem('cardHeaderActions', '10') // avoid needing to click "More..."
  const record = createTestRecord()
  vi.mocked(fetchRecords).mockResolvedValue([record])
  vi.mocked(fetchExercises).mockResolvedValue([
    testExercise,
    createExercise('other'),
  ])
  const { user } = render(
    <TestWrapper id={record._id} date={record.date} swiperIndex={0} />
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
  const record = createTestRecord({
    setType: { operator: 'between', field: 'reps' },
  })
  vi.mocked(fetchRecords).mockResolvedValue([record])
  vi.mocked(fetchExercises).mockResolvedValue([testExercise])
  const { user } = render(
    <TestWrapper id={record._id} date={record.date} swiperIndex={0} />
  )

  // update record
  vi.mocked(addSet).mockRejectedValue(new Error('error'))
  ignoreConsoleErrorOnce()
  await user.click(await screen.findByLabelText('Add new set'))

  expect(addSet).toHaveBeenCalled()

  await screen.findByText(/not saved/)
})
