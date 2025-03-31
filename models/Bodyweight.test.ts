import { BodyweightQuery, bodyweightQuerySchema } from './Bodyweight'
import { ApiParams } from './query-filters/ApiParams'

it('builds full query', () => {
  const apiQuery: ApiParams<BodyweightQuery> = {
    type: 'official',
  }
  expect(bodyweightQuerySchema.parse(apiQuery)).toMatchObject({
    type: apiQuery.type,
  })
})

it('validates type', () => {
  expect(() => bodyweightQuerySchema.parse({ type: 'invalid' })).toThrow()
  expect(() => bodyweightQuerySchema.parse({ type: ['official'] })).toThrow()
})
