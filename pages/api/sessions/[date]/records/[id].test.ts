import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import { generateId } from 'lib/util'
import Record from 'models/Record'
import handler from './[id].api'

var mockFetch: jest.Mock
var mockDelete: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchRecord: (mockFetch = jest.fn()),
  deleteSessionRecord: (mockDelete = jest.fn()),
}))

const date = '2000-01-01'
const data = new Record(date)
const id = generateId()
const params = { id, date }

it('fetches given record', async () => {
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('deletes given record', async () => {
  mockDelete.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'DELETE' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
