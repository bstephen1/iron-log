import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Exercise from 'models/Exercise'
import handler from './index.api'

var mockFetch: vi.mock
vi.mock('lib/backend/mongoService', () => ({
  fetchExercises: (mockFetch = vi.fn()),
}))

it('fetches exercises', async () => {
  const data = [new Exercise('hi')]
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
