import { vi, it } from 'vitest'
import {
  deleteExercise,
  fetchExercise,
  updateExerciseFields,
} from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './[id]'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'
import { generateId } from '../../../lib/util'

const data = createExercise('hi')
const params = { id: generateId() }

it('fetches given exercise', async () => {
  vi.mocked(fetchExercise).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('updates given exercise fields', async () => {
  vi.mocked(updateExerciseFields).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('deletes given exercise', async () => {
  vi.mocked(deleteExercise).mockResolvedValue(data._id)

  await expectApiRespondsWithData({
    data: data._id,
    handler,
    params,
    method: 'DELETE',
  })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
