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

const date = '2000-01-01'
const params = { date }

it('fetches records', async () => {
  const data = [new Record(date)]
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})
