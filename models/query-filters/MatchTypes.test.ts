import { buildMatchTypeFilter, MatchType } from './MongoQuery'

it('builds standard MatchType', () => {
  expect(buildMatchTypeFilter(['hi'], MatchType.Exact)).toEqual({
    $all: ['hi'],
    $size: 1,
  })
  expect(buildMatchTypeFilter(['hi'], MatchType.Partial)).toEqual({
    $all: ['hi'],
  })
})

it('builds empty MatchType', () => {
  expect(buildMatchTypeFilter([], MatchType.Exact)).toEqual({ $size: 0 })
  expect(buildMatchTypeFilter([''], MatchType.Exact)).toEqual({ $size: 0 })

  expect(buildMatchTypeFilter([], MatchType.Partial)).toEqual(undefined)
  expect(buildMatchTypeFilter([''], MatchType.Partial)).toEqual(undefined)
})
