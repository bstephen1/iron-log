import {
  expectApiErrorsOnInvalidMethod,
  expectApiErrorsOnMissingParams,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import SessionLog from 'models/SessionLog'
import handler from './index.api'

var mockFetch: jest.Mock
var mockAdd: jest.Mock
var mockUpdate: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchSession: (mockFetch = jest.fn()),
  addSession: (mockAdd = jest.fn()),
  updateSession: (mockUpdate = jest.fn()),
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
