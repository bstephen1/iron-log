import { ApiReq } from '../../lib/backend/apiQueryValidationService'
import DateRangeQuery, { dateRangeQuerySchema } from './DateRangeQuery'

it('builds full query', () => {
  const apiQuery: ApiReq<DateRangeQuery> = {
    limit: '5',
    start: '2000-01-01',
    end: '2001-01-01',
    sort: 'oldestFirst',
  }
  expect(dateRangeQuerySchema.parse(apiQuery)).toEqual({
    ...apiQuery,
    limit: Number(apiQuery.limit),
    sort: 'oldestFirst',
  })
})

it('builds partial query', () => {
  const apiQuery: ApiReq<DateRangeQuery> = {
    limit: undefined,
    start: '2000-01-01',
    end: undefined,
    sort: undefined,
  }
  expect(dateRangeQuerySchema.parse(apiQuery)).toEqual({
    start: apiQuery.start,
  })
})

it('validates limit', () => {
  // We shouldn't ever get singleton arrays from api requests.
  // This test is more to document the behavior that Number(['5']) does coerce to a number
  expect(() => dateRangeQuerySchema.parse({ limit: ['5'] })).not.toThrow()

  expect(() => dateRangeQuerySchema.parse({ limit: 'invalid' })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ limit: ['5', '3'] })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ limit: ['invalid'] })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ limit: '3.5' })).toThrow()
})

it('validates dates', () => {
  expect(() => dateRangeQuerySchema.parse({ start: 'invalid' })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ start: '2000-10-10-10' })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ start: '20001010' })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ start: '2000-13-10' })).toThrow()

  expect(() => dateRangeQuerySchema.parse({ end: 'invalid' })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ end: '2000-10-10-10' })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ end: '20001010' })).toThrow()
  expect(() => dateRangeQuerySchema.parse({ end: '2000-13-10' })).toThrow()
})
