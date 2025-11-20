import { expect, it } from 'vitest'
import { ArrayMatchType, buildMatchTypeFilter } from './ArrayMatchType'

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

it('throws error on unexpected MatchType', () => {
  // @ts-expect-error
  expect(() => buildMatchTypeFilter([], 'new type')).toThrow()
})
