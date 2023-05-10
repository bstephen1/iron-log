import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import Record from 'models/Record'
import handler from './index.api'

var mockFetch: vi.mock
vi.mock('lib/backend/mongoService', () => ({
  fetchRecords: (mockFetch = vi.fn()),
}))

it('fetches records', async () => {
  const data = [new Record('2000-01-01')]
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
