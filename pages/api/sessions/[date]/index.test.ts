import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import SessionLog from 'models/SessionLog'
import handler from './index.api'

var mockFetch: vi.mock
var mockAdd: vi.mock
var mockUpdate: vi.mock

vi.mock('lib/backend/mongoService', () => ({
  fetchSession: (mockFetch = vi.fn()),
  addSession: (mockAdd = vi.fn()),
  updateSession: (mockUpdate = vi.fn()),
}))

const date = '2000-01-01'
const data = new SessionLog(date)
const params = { date }

it('fetches given session', async () => {
  mockFetch.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params })
})

it('adds given session', async () => {
  mockAdd.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'POST' })
})

it('updates given session', async () => {
  mockUpdate.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler, params, method: 'PUT' })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler, params })
})

it('requires a date', async () => {
  await expectApiErrorsOnMissingParams({ handler })
})
