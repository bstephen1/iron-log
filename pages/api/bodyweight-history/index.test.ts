import { StatusCodes } from 'http-status-codes'
import Bodyweight from 'models/Bodyweight'
import { testApiHandler } from 'next-test-api-route-handler'
import indexApi from './index.api'

var mockFetch: jest.Mock
var mockAdd: jest.Mock
var mockUpdate: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchBodyweightHistory: (mockFetch = jest.fn()),
  addBodyweight: (mockAdd = jest.fn()),
  updateBodyweight: (mockUpdate = jest.fn()),
}))

const data = new Bodyweight(50, 'official')

it('fetches given bodyweight', async () => {
  mockFetch.mockReturnValue([data])

  await testApiHandler<Bodyweight[]>({
    handler: indexApi,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual([data])
      expect(mockFetch).toHaveBeenCalledTimes(1)
    },
  })
})

it('adds given bodyweight', async () => {
  mockAdd.mockReturnValue(data)

  await testApiHandler<Bodyweight>({
    handler: indexApi,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'POST', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockAdd).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given bodyweight', async () => {
  mockUpdate.mockReturnValue(data)

  await testApiHandler<Bodyweight>({
    handler: indexApi,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockUpdate).toHaveBeenCalledTimes(1)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: indexApi,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'TRACE' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(await res.json()).toMatch(/not allowed/i)
    },
  })
})

it('handles invalid json body', async () => {
  await testApiHandler({
    handler: indexApi,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT', body: 'not json' })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await res.json()).toMatch(/json/i)
    },
  })
})
