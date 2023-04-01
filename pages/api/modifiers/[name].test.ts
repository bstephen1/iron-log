import { StatusCodes } from 'http-status-codes'
import Modifier from 'models/Modifier'
import { Status } from 'models/Status'
import { testApiHandler } from 'next-test-api-route-handler'
import NameApi from './[name].api'

var mockFetch: jest.Mock
var mockAdd: jest.Mock
var mockUpdate: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchModifier: (mockFetch = jest.fn()),
  addModifier: (mockAdd = jest.fn()),
  updateModifierFields: (mockUpdate = jest.fn()),
}))

const data = new Modifier('hi', Status.active, 5)

it('fetches given modifier', async () => {
  mockFetch.mockReturnValue(data)

  await testApiHandler<Modifier>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(res.json()).resolves.toEqual(data)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    },
  })
})

it('adds given modifier', async () => {
  mockAdd.mockReturnValue(data)

  await testApiHandler({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'POST', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      expect(res.json()).resolves.toEqual(data)
      expect(mockAdd).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given modifier', async () => {
  mockUpdate.mockReturnValue(data)

  await testApiHandler({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PATCH', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      expect(res.json()).resolves.toEqual(data)
      expect(mockUpdate).toHaveBeenCalledTimes(1)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'TRACE' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(res.json()).resolves.toMatch(/not allowed/i)
    },
  })
})

it('requires a name', async () => {
  await testApiHandler({
    handler: NameApi,
    // omit the name param
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(res.json()).resolves.toMatch(/name/i)
    },
  })
})

it('handles invalid json body', async () => {
  await testApiHandler({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PATCH', body: 'not json' })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(res.json()).resolves.toMatch(/json/i)
    },
  })
})
