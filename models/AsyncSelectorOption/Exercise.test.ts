import { ApiParams } from '../query-filters/ApiParams'
import { Status } from '../Status'
import { ExerciseQuery, exerciseQuerySchema } from './Exercise'

it('builds full query', () => {
  const apiQuery: ApiParams<ExerciseQuery> = {
    status: Status.active,
    category: 'category',
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    status: apiQuery.status,
    categories: { $all: [apiQuery.category] },
  })
})

it('builds partial query', () => {
  const apiQuery: ApiParams<ExerciseQuery> = {
    status: Status.active,
    category: undefined,
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    status: apiQuery.status,
  })
})

it('builds categories from string category', () => {
  const apiQuery: ApiParams<ExerciseQuery> = {
    category: 'category',
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    categories: { $all: [apiQuery.category] },
  })
})

it('builds categories from array category', () => {
  const apiQuery: ApiParams<ExerciseQuery> = {
    category: ['category'],
  }
  expect(exerciseQuerySchema.parse(apiQuery)).toEqual({
    categories: { $all: apiQuery.category },
  })
})
