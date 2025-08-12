import { vi, it } from 'vitest'
import { fetchExercise } from '../../../lib/backend/mongoService'
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

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
