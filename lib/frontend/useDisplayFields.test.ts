import { renderHook } from '@testing-library/react'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'
import {
  DEFAULT_DISPLAY_FIELDS,
  DEFAULT_DISPLAY_FIELDS_SPLIT_WEIGHT,
  type DisplayFields,
} from '../../models/DisplayFields'
import { DB_UNITS } from '../../models/Units'
import useDisplayFields from './useDisplayFields'

it('returns display fields from record', () => {
  const displayFields: DisplayFields = {
    visibleFields: [],
    units: DB_UNITS,
  }
  const exercise = createExercise('lift heavy thing', { displayFields })
  const { result } = renderHook(() => useDisplayFields(exercise))

  expect(result.current).toEqual(displayFields)
})

it('returns default split weight fields', () => {
  const exercise = createExercise('lift something', {
    attributes: { bodyweight: true },
  })
  const { result } = renderHook(() => useDisplayFields(exercise))

  expect(result.current).toBe(DEFAULT_DISPLAY_FIELDS_SPLIT_WEIGHT)
})

it('returns default fields', () => {
  const { result } = renderHook(() => useDisplayFields(null))

  expect(result.current).toBe(DEFAULT_DISPLAY_FIELDS)
})
