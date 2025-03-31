import { ApiReq } from '../lib/backend/apiQueryValidationService'
import {
  BodyweightQuery,
  bodyweightQuerySchema,
} from './query-filters/BodyweightQuery'

it('builds full query', () => {
  const apiQuery: ApiReq<BodyweightQuery> = {
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
