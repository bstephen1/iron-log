import { ApiReq } from '../../lib/backend/apiQueryValidationService'
import { Status } from '../Status'
import { ExerciseQuery, exerciseQuerySchema } from './Exercise'

it('builds full query', () => {
  const apiQuery: ApiReq<ExerciseQuery> = {
    status: Status.active,
    category: 'category',
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    status: apiQuery.status,
    categories: { $all: [apiQuery.category] },
  })
})

it('builds partial query', () => {
  const apiQuery: ApiReq<ExerciseQuery> = {
    status: Status.active,
    category: undefined,
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    status: apiQuery.status,
  })
})

it('builds categories from string category', () => {
  const apiQuery: ApiReq<ExerciseQuery> = {
    category: 'category',
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    categories: { $all: [apiQuery.category] },
  })
})

it('builds categories from array category', () => {
  const apiQuery: ApiReq<ExerciseQuery> = {
    category: ['category'],
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    categories: { $all: apiQuery.category },
  })
})
