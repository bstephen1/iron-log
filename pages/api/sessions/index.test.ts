import {
  expectApiErrorsOnInvalidMethod,
  expectApiRespondsWithData,
} from 'lib/testUtils'
import SessionLog from 'models/SessionLog'
import handler from './index.api'

var mockFetchSessions: jest.Mock
jest.mock('lib/backend/mongoService', () => ({
  fetchSessions: (mockFetchSessions = jest.fn()),
}))

it('fetches sessions', async () => {
  const data = [new SessionLog('2000-01-01')]
  mockFetchSessions.mockReturnValue(data)

  await expectApiRespondsWithData({ data, handler })
})

it('blocks invalid method types', async () => {
  await expectApiErrorsOnInvalidMethod({ handler })
})
