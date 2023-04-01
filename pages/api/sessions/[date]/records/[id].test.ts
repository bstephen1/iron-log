import { StatusCodes } from 'http-status-codes'
import { generateId } from 'lib/util'
import Record from 'models/Record'
import { testApiHandler } from 'next-test-api-route-handler'
import IdApi from './[id].api'

var mockFetch: jest.Mock
var mockDelete: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchRecord: (mockFetch = jest.fn()),
  deleteSessionRecord: (mockDelete = jest.fn()),
}))

const date = '2000-01-01'
const data = new Record(date)
const id = generateId()

it('fetches given record', async () => {
  mockFetch.mockReturnValue(data)

  await testApiHandler<Record>({
    handler: IdApi,
    params: { id, date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      await expect(res.json()).resolves.toEqual(data)
      expect(res.status).toBe(StatusCodes.OK)
    },
  })
})

it('deletes given record', async () => {
  mockDelete.mockReturnValue(data)

  await testApiHandler({
    handler: IdApi,
    params: { id, date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'DELETE' })
      expect(res.json()).resolves.toEqual(data)
      expect(res.status).toBe(StatusCodes.OK)
      expect(mockDelete).toHaveBeenCalledTimes(1)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: IdApi,
    params: { id, date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'TRACE' })
      expect(res.json()).resolves.toMatch(/not allowed/i)
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
    },
  })
})

it('requires an id', async () => {
  await testApiHandler({
    handler: IdApi,
    // omit the id param
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.json()).resolves.toMatch(/id/i)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    },
  })
})
