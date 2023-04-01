import { StatusCodes } from 'http-status-codes'
import SessionLog from 'models/SessionLog'
import { testApiHandler } from 'next-test-api-route-handler'
import IndexApi from './index.api'

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

it('fetches given session', async () => {
  mockFetch.mockReturnValue(data)

  await testApiHandler<SessionLog>({
    handler: IndexApi,
    params: { date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      await expect(await res.json()).toEqual(data)
      expect(res.status).toBe(StatusCodes.OK)
    },
  })
})

it('fetches null session', async () => {
  mockFetch.mockReturnValue(data)

  await testApiHandler<SessionLog>({
    handler: IndexApi,
    params: { date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(await res.json()).toEqual(data)
      expect(res.status).toBe(StatusCodes.OK)
    },
  })
})

it('adds given session', async () => {
  mockAdd.mockReturnValue(data)

  await testApiHandler({
    handler: IndexApi,
    params: { date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'POST', body: JSON.stringify(data) })
      expect(await res.json()).toEqual(data)
      expect(res.status).toBe(StatusCodes.OK)
      expect(mockAdd).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given session', async () => {
  mockUpdate.mockReturnValue(data)

  await testApiHandler({
    handler: IndexApi,
    params: { date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT', body: JSON.stringify(data) })
      expect(await res.json()).toEqual(data)
      expect(res.status).toBe(StatusCodes.OK)
      expect(mockUpdate).toHaveBeenCalledTimes(1)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: IndexApi,
    params: { date },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'TRACE' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(await res.json()).toMatch(/not allowed/i)
    },
  })
})

it('requires a date', async () => {
  await testApiHandler({
    handler: IndexApi,
    // omit the date param
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(await res.json()).toMatch(/date/i)
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
    },
  })
})
