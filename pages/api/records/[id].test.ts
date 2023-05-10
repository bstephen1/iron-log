import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import { generateId } from 'lib/util'
import Record from 'models/Record'
import handler from './[id].api'

var mockFetch: vi.mock
var mockAdd: vi.mock
var mockUpdate: vi.mock
var mockUpdateFields: vi.mock

vi.mock('lib/backend/mongoService', () => ({
  fetchRecord: (mockFetch = vi.fn()),
  addRecord: (mockAdd = vi.fn()),
  updateRecord: (mockUpdate = vi.fn()),
  updateRecordFields: (mockUpdateFields = vi.fn()),
}))

const data = new Record('2000-01-01')
const id = generateId()
const params = { id }

it('fetches given record', async () => {
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given record', async () => {
  mockAdd.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given record fields', async () => {
  mockUpdateFields.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PATCH' })
})

it('updates given record', async () => {
  mockUpdate.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires an id', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
