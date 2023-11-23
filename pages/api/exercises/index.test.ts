import { vi } from 'vitest'
import { fetchExercises } from '../../../lib/backend/mongoService'
import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from '../../../lib/testUtils'
import Exercise from '../../../models/AsyncSelectorOption/Exercise'
import handler from './index.api'

it('fetches exercises', async () => {
  const data = [new Exercise('hi')]
  vi.mocked(fetchExercises).mockResolvedValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
