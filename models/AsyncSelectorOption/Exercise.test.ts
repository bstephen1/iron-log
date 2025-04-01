import { ParsedUrlQuery } from 'querystring'
import { Status } from '../Status'
import { exerciseQuerySchema } from './Exercise'

it('transforms query params', () => {
  const apiQuery: ParsedUrlQuery = {
    status: Status.active,
    category: 'category',
    bodyweight: 'bodyweight',
    unilateral: '',
    modifier: ['m1', 'm2'],
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    status: apiQuery.status,
    categories: { $all: [apiQuery.category] },
    modifiers: { $all: apiQuery.modifier },
    'attributes.bodyweight': true,
    'attributes.unilateral': false,
  })
})

it('ignores undefined keys', () => {
  const apiQuery: ParsedUrlQuery = {
    status: Status.active,
    category: undefined,
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    status: apiQuery.status,
  })
})
