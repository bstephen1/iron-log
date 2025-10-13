import { expect, it, vi } from 'vitest'
import { render, screen } from '../../../../lib/testUtils'
import { DEFAULT_DISPLAY_FIELDS } from '../../../../models/DisplayFields'
import SetHeader from './SetHeader'

const mockMutate = vi.fn()

it('switches display fields', async () => {
  const { user } = render(
    <SetHeader
      mutateExerciseFields={mockMutate}
      displayFields={{
        ...DEFAULT_DISPLAY_FIELDS,
        units: { ...DEFAULT_DISPLAY_FIELDS.units, weight: 'lbs' },
      }}
    />
  )

  await user.click(screen.getByRole('combobox'))
  await user.click(screen.getByText('Weight (lbs)'))

  expect(mockMutate).toHaveBeenCalled()
})

it('shows special fields', async () => {
  const { user } = render(
    <SetHeader
      mutateExerciseFields={mockMutate}
      displayFields={DEFAULT_DISPLAY_FIELDS}
      showSplitWeight
      showUnilateral
    />
  )

  await user.click(screen.getByRole('combobox'))
  expect(screen.getByText('Side')).toBeVisible()
  expect(screen.getByText('Total Weight (TW kg)')).toBeVisible()
  expect(screen.getByText('Plate Weight (PW kg)')).toBeVisible()
})

it('handles no fields selected', async () => {
  render(
    <SetHeader
      mutateExerciseFields={mockMutate}
      displayFields={{ visibleFields: [], units: DEFAULT_DISPLAY_FIELDS.units }}
    />
  )

  expect(screen.getByText(/no display fields/i)).toBeVisible()
})
