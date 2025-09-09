import { type ParsedUrlQuery } from 'querystring'
import { ArrayMatchType } from './ArrayMatchType'
import { recordQuerySchema } from './Record'
import { it, expect } from 'vitest'

it('transforms query params', () => {
  const apiQuery: ParsedUrlQuery = {
    exercise: 'exercise',
    modifiers: ['modifier'],
    modifierMatchType: ArrayMatchType.Exact,
    operator: 'exactly',
    field: 'reps',
    value: '5',
    min: '1',
    max: '8',
  }
  expect(recordQuerySchema.parse(apiQuery)).toEqual({
    activeModifiers: { $all: apiQuery.modifiers, $size: 1 },
    'exercise.name': apiQuery.exercise,
    'setType.operator': apiQuery.operator,
    'setType.field': apiQuery.field,
    'setType.value': Number(apiQuery.value),
    'setType.min': Number(apiQuery.min),
    'setType.max': Number(apiQuery.max),
  })
})

it('ignores undefined keys', () => {
  const apiQuery: ParsedUrlQuery = {
    exercise: '2000-01-01',
    category: undefined,
  }
  expect(recordQuerySchema.parse(apiQuery)).toEqual({
    'exercise.name': apiQuery.exercise,
  })
})
