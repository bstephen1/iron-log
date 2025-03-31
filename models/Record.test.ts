import { ApiReq } from '../lib/backend/apiQueryValidationService'
import { RecordQuery, recordQuerySchema } from './Record'
import { MatchType } from './query-filters/MongoQuery'

it('builds full query', () => {
  const apiQuery: ApiReq<RecordQuery> = {
    exercise: 'exercise',
    modifier: 'modifier',
    modifierMatchType: MatchType.Partial,
    operator: 'exactly',
    field: 'reps',
    value: '5',
    min: '1',
    max: '8',
  }
  expect(recordQuerySchema.parse(apiQuery)).toEqual({
    activeModifiers: { $all: [apiQuery.modifier] },
    'exercise.name': apiQuery.exercise,
    'setType.operator': apiQuery.operator,
    'setType.field': apiQuery.field,
    'setType.value': Number(apiQuery.value),
    'setType.min': Number(apiQuery.min),
    'setType.max': Number(apiQuery.max),
  })
})

it('builds partial query', () => {
  const apiQuery: ApiReq<RecordQuery> = {
    field: 'reps',
    exercise: undefined,
  }
  expect(recordQuerySchema.parse(apiQuery)).toEqual({
    'setType.field': 'reps',
  })
})

it('validates exercise', () => {
  expect(() => recordQuerySchema.parse({ exercise: ['invalid'] })).toThrow()
})

it('builds modifiers from string modifier', () => {
  const apiQuery: ApiReq<RecordQuery> = {
    modifier: 'modifier',
    modifierMatchType: MatchType.Exact,
  }
  expect(recordQuerySchema.parse(apiQuery)).toEqual({
    activeModifiers: { $all: [apiQuery.modifier], $size: 1 },
  })
})

it('builds modifiers from array modifier', () => {
  const apiQuery: ApiReq<RecordQuery> = {
    modifier: ['modifier'],
    modifierMatchType: MatchType.Exact,
  }
  expect(recordQuerySchema.parse(apiQuery)).toEqual({
    activeModifiers: { $size: 1, $all: apiQuery.modifier },
  })
})

it('validates match type', () => {
  expect(() =>
    recordQuerySchema.parse({
      modifier: 'modifier',
      modifierMatchType: 'invalid',
    })
  ).toThrow()
})

it('ignores matchType when modifier is empty', () => {
  expect(
    recordQuerySchema.parse({ modifierMatchType: MatchType.Partial })
  ).toEqual({})
})
