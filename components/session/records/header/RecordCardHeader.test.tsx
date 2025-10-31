import type { ComponentProps } from 'react'
import { Swiper } from 'swiper/react'
import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../../lib/test/rtl'
import { createExercise } from '../../../../models/AsyncSelectorOption/Exercise'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import RecordCardHeader from './RecordCardHeader'

const storageKey = 'cardHeaderActions'
const totalActions = 7

vi.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({
    width: undefined,
    ref: null,
  }),
}))

const TestWrapper = (
  props: Partial<ComponentProps<typeof RecordCardHeader>>
) => (
  <Swiper>
    <RecordCardHeader
      swiperIndex={0}
      mutateExerciseFields={vi.fn()}
      mutateRecordFields={vi.fn()}
      displayFields={DEFAULT_DISPLAY_FIELDS}
      date="2000-01-01"
      notes={[]}
      sets={[]}
      _id="1"
      exercise={createExercise('dips')}
      {...props}
    />
  </Swiper>
)

it('shows all actions', async () => {
  localStorage.setItem(storageKey, `${totalActions}`)

  render(<TestWrapper />)

  expect(screen.queryByLabelText('More...')).not.toBeInTheDocument()
})

it('does not collapse actions if only one would be collapsed', async () => {
  localStorage.setItem(storageKey, `${totalActions - 1}`)

  render(<TestWrapper />)

  expect(screen.queryByLabelText('More...')).not.toBeInTheDocument()
})

it('collapses actions', async () => {
  localStorage.setItem(storageKey, `1`)

  render(<TestWrapper />)

  expect(screen.getByLabelText('More...')).toBeVisible()
})

// make sure negatives aren't treated as counting back from the end of the array
it('treats negative visible actions as zero', async () => {
  localStorage.setItem(storageKey, `-3`)

  render(<TestWrapper />)

  expect(screen.getByLabelText('More...')).toBeVisible()
  expect(screen.getAllByRole('button').length).toBe(1)
})
