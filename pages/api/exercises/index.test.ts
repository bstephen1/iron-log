import { vi } from 'vitest'
import { addExercise, fetchExercises } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from './index.api'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'

it('fetches exercises', async () => {
  const data = [createExercise('hi')]
  vi.mocked(fetchExercises).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('adds given exercise', async () => {
  const data = createExercise('hi')
  vi.mocked(addExercise).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler, method: 'POST' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
