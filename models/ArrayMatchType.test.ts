import { ArrayMatchType, buildMatchTypeFilter } from './ArrayMatchType'
import { it, expect } from 'vitest'

it('builds standard MatchType', () => {
  expect(buildMatchTypeFilter(['hi'], ArrayMatchType.Exact)).toEqual({
    $all: ['hi'],
    $size: 1,
  })
  expect(buildMatchTypeFilter(['hi'], ArrayMatchType.Partial)).toEqual({
    $all: ['hi'],
  })
})

it('builds empty MatchType', () => {
  expect(buildMatchTypeFilter([], ArrayMatchType.Exact)).toEqual({ $size: 0 })

  expect(buildMatchTypeFilter([], ArrayMatchType.Partial)).toEqual(undefined)
})
