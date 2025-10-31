import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../../lib/util/test/rtl'
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
