import { useState } from 'react'
import { expect, it, vi } from 'vitest'
import { fetchExercises, fetchModifiers } from '../../lib/backend/mongoService'
import { render, screen } from '../../lib/test/rtl'
import { ArrayMatchType } from '../../models/ArrayMatchType'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import { createModifier } from '../../models/AsyncSelectorOption/Modifier'
import {
  DEFAULT_RECORD_HISTORY_QUERY,
  type RecordQuery,
} from '../../models/Record'
import QueryForm from './QueryForm'

const TestWrapper = (props: { query?: RecordQuery } = {}) => {
  const [query, setQuery] = useState<RecordQuery>({
    ...DEFAULT_RECORD_HISTORY_QUERY,
    ...props.query,
  })
  return <QueryForm query={query} updateQuery={setQuery} />
}

it('updates and resets', async () => {
  vi.mocked(fetchExercises).mockResolvedValue([
    createExercise('squats', { modifiers: ['belt'] }),
  ])
  vi.mocked(fetchModifiers).mockResolvedValue([createModifier('belt')])
  const { user } = render(
    <TestWrapper query={{ setTypeMatchType: ArrayMatchType.Exact }} />
  )

  // update date range
  await user.click(screen.getByText('No filter'))
  await user.click(screen.getByText('Last 3 months'))
  await user.click(screen.getByText('Update filter'))

  expect(screen.getByText('Update filter')).toBeDisabled()

  // update fields
  await user.click(screen.getByText('Last 3 months'))
  await user.click(screen.getByText('Last 6 months'))

  await user.click(screen.getByLabelText('Exercise'))
  await user.click(screen.getByText('squats'))

  await user.click(screen.getByLabelText('Modifiers'))
  await user.click(screen.getByText('belt'))
  // await user.keyboard('{Escape}')

  await user.click(screen.getByText('exactly 6 reps'))
  await user.click(screen.getByText('at most'))
  await user.keyboard('{Escape}')

  await user.type(screen.getByLabelText('Record limit'), '1')

  // resets to latest query from "updateQuery"
  await user.click(screen.getByText('Reset'))

  expect(screen.getByText('Last 3 months')).toBeVisible()
  expect(
    screen.getByDisplayValue(`${DEFAULT_RECORD_HISTORY_QUERY.limit}`)
  ).toBeVisible()
  expect(screen.getByText('exactly 6 reps')).toBeVisible()
  expect(screen.queryByText('belt')).not.toBeInTheDocument()
  expect(screen.queryByText('squats')).not.toBeInTheDocument()
})

it('clears exercise', async () => {
  vi.mocked(fetchExercises).mockResolvedValue([createExercise('squats')])
  const { user } = render(<TestWrapper query={{ modifiers: undefined }} />)

  await user.click(screen.getByLabelText('Exercise'))
  await user.click(screen.getByText('squats'))
  await user.click(screen.getByLabelText('Clear'))

  expect(screen.getByLabelText('Exercise')).toHaveDisplayValue('')
})
