import {
  addExercise,
  fetchExercise,
  updateExercise,
  updateExerciseFields,
} from 'lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Exercise from 'models/AsyncSelectorOption/Exercise'
import { it, vi } from 'vitest'
import handler from './[name].api'

const data = new Exercise('hi')
const params = { name: 'name' }

it('fetches given exercise', async () => {
  vi.mocked(fetchExercise).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given exercise', async () => {
  vi.mocked(addExercise).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given exercise fields', async () => {
  vi.mocked(updateExerciseFields).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('updates given exercise', async () => {
  vi.mocked(updateExercise).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a name', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
