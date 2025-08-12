import { vi, it } from 'vitest'
import { fetchExercises } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import handler from '.'
import { createExercise } from '../../../models/AsyncSelectorOption/Exercise'

it('fetches exercises', async () => {
  const data = [createExercise('hi')]
  vi.mocked(fetchExercises).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
