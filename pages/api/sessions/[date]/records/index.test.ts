import { StatusCodes } from 'http-status-codes'
import Record from 'models/Record'
import { testApiHandler } from 'next-test-api-route-handler'
import indexApi from './index.api'

var mockFetch: jest.Mock
jest.mock('lib/backend/mongoService', () => ({
  fetchRecords: (mockFetch = jest.fn()),
}))

const date = '2000-01-01'

it('fetches records', async () => {
  const data = [new Record(date)]
  mockFetch.mockReturnValue(data)

  await testApiHandler<Record[]>({
    handler: indexApi,
    params: { date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: indexApi,
    params: { date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(await res.json()).toMatch(/not allowed/i)
    },
  })
})
