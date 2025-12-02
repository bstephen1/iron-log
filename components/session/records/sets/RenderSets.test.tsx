import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../../lib/test/rtl'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import RenderSets from './RenderSets'

it('renders editable sets', () => {
  render(
    <RenderSets
      mutateExerciseFields={vi.fn()}
      displayFields={DEFAULT_DISPLAY_FIELDS}
      sets={[{ reps: 1, weight: 5 }, { reps: 2 }]}
      _id="1"
    />
  )

  expect(screen.getByLabelText('Set 1')).toBeVisible()
  expect(screen.getByLabelText('Set 2')).toBeVisible()
  expect(screen.getByLabelText('Add new set')).toBeVisible()
})

it('renders readonly sets', () => {
  render(
    <RenderSets displayFields={DEFAULT_DISPLAY_FIELDS} sets={[]} _id="1" />
  )

  expect(screen.queryByLabelText('Add new set')).not.toBeInTheDocument()
})

it('does not render delete button if there are no display fields', () => {
  render(
    <RenderSets
      mutateExerciseFields={vi.fn()}
      displayFields={{ ...DEFAULT_DISPLAY_FIELDS, visibleFields: [] }}
      sets={[{ reps: 1, weight: 1 }]}
      _id="1"
    />
  )

  expect(screen.getByLabelText('Set 1')).toBeVisible()
  expect(screen.queryByLabelText('Delete set 1')).not.toBeInTheDocument()
})
