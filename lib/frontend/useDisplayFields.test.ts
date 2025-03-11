import { renderHook } from '@testing-library/react'
import {
  DEFAULT_DISPLAY_FIELDS,
  DEFAULT_DISPLAY_FIELDS_SPLIT_WEIGHT,
  DisplayFields,
} from '../../models/DisplayFields'
import { DB_UNITS } from '../../models/Set'
import useDisplayFields from './useDisplayFields'
import { createExercise } from '../../models/AsyncSelectorOption/Exercise'

it('returns display fields from record', () => {
  const displayFields: DisplayFields = {
    visibleFields: [],
    units: DB_UNITS,
  }
  const exercise = createExercise('lift heavy thing', { displayFields })
  const { result } = renderHook(() => useDisplayFields(exercise))

  expect(result.current).toBe(displayFields)
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
