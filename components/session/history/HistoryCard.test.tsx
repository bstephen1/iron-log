import { beforeEach, expect, it, vi } from 'vitest'
import { fetchExercises } from '../../../lib/backend/mongoService'
import { render, screen } from '../../../lib/test/rtl'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'
import { DEFAULT_DISPLAY_FIELDS } from '../../../models/DisplayFields'
import { createRecord } from '../../../models/Record'
import HistoryCard from './HistoryCard'

const squats = createExercise('squats')

beforeEach(() => {
  vi.mocked(fetchExercises).mockResolvedValue([squats])
})

it('shows custom display fields', async () => {
  render(
    <HistoryCard
      displayFields={{
        ...DEFAULT_DISPLAY_FIELDS,
        visibleFields: [{ name: 'plateWeight', source: 'weight' }],
      }}
      record={createRecord('2000-01-01', squats._id, {
        sets: [{ weight: 5, reps: 5 }],
      })}
      content={['sets']}
    />
  )

  expect(screen.getByText('PW kg')).toBeVisible()
})

it('shows provided content and actions', async () => {
  render(
    <HistoryCard
      record={createRecord('2000-01-01', squats._id, {
        sets: [{ weight: 5, reps: 5 }],
      })}
      actions={['recordNotes']}
      content={['exercise']}
      cardProps={{ sx: {} }} // for coverage
    />
  )

  expect(await screen.findByDisplayValue('squats')).toBeVisible()
  expect(screen.getByLabelText('Record notes')).toBeVisible()

  expect(screen.queryByDisplayValue('5')).not.toBeInTheDocument()
})
