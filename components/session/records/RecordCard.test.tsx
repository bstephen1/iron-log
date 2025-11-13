import { expect, it, vi } from 'vitest'
import {
  fetchExercises,
  updateExerciseFields,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import { ignoreConsoleErrorOnce } from '../../../lib/util/test/console'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'
import { createRecord } from '../../../models/Record'
import RecordCard from './RecordCard'

vi.mock('swiper/react', () => ({
  useSwiper: () => ({
    update: vi.fn(),
    slideTo: vi.fn(),
    slides: ['one', 'add record'],
  }),
}))

const exercise = createExercise('finger curls')

it('mutates', async () => {
  localStorage.setItem('cardHeaderActions', '10') // avoid needing to click "More..."
  vi.mocked(fetchExercises).mockResolvedValue([
    exercise,
    createExercise('other'),
  ])
  const record = createRecord('2000-01-01', {
    exercise,
  })
  const { user } = render(<RecordCard record={record} swiperIndex={0} />)

  // update record exercise
  await user.click(screen.getByLabelText('Exercise'))
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
  const { user } = render(<RecordCard record={record} swiperIndex={0} />)

  // update record
  vi.mocked(updateRecordFields).mockRejectedValue(new Error('error'))
  ignoreConsoleErrorOnce()
  await user.click(screen.getByLabelText('Add new set'))

  expect(updateRecordFields).toHaveBeenCalled()

  await screen.findByText(/Could not save/)
})
