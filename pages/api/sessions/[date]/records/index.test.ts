import { StatusCodes } from 'http-status-codes'
import Record from 'models/Record'
import { testApiHandler } from 'next-test-api-route-handler'
import records from 'pages/api/records/index.api'

var mockFetch: jest.Mock
jest.mock('lib/backend/mongoService', () => ({
  fetchRecords: (mockFetch = jest.fn()),
}))

it('fetches records', async () => {
  const data = [new Record('2000-01-01')]
  mockFetch.mockReturnValue(data)

  await testApiHandler<Record[]>({
    handler: records,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      await expect(res.json()).resolves.toEqual(data)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: records,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(await res.json()).toMatch(/not allowed/i)
    },
  })
})
