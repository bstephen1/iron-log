import { expect, it } from 'vitest'
import { ArrayMatchType } from './ArrayMatchType'
import { buildRecordFilter, type RecordQuery } from './Record'
import type { SetType } from './Set'

it('transforms query params', () => {
  const setType: SetType = {
    operator: 'exactly',
    field: 'reps',
    value: 5,
    min: 1,
    max: 8,
  }
  const recordQuery: RecordQuery = {
    exerciseId: 'ex1',
    modifiers: ['modifier'],
    modifierMatchType: ArrayMatchType.Exact,
    setType,
  }

  expect(buildRecordFilter(recordQuery)).toEqual({
    exerciseId: 'ex1',
    activeModifiers: { $all: recordQuery.modifiers, $size: 1 },
    'setType.operator': setType.operator,
    'setType.field': setType.field,
    'setType.value': setType.value,
    'setType.min': setType.min,
    'setType.max': setType.max,
  })
})

it('ignores undefined keys', () => {
  const recordQuery: RecordQuery = {
    date: '2000-01-01',
    exerciseId: undefined,
  }
  expect(buildRecordFilter(recordQuery)).toEqual({
    date: recordQuery.date,
  })
})

it('ignores setType when set to any', () => {
  const recordQuery: RecordQuery = {
    exerciseId: 'ex1',
    setTypeMatchType: ArrayMatchType.Any,
  }
  expect(buildRecordFilter(recordQuery)).toEqual({
    exerciseId: recordQuery.exerciseId,
  })
})
