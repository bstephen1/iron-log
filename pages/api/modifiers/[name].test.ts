import { StatusCodes } from 'http-status-codes'
import Modifier from 'models/Modifier'
import { Status } from 'models/Status'
import { testApiHandler } from 'next-test-api-route-handler'
import NameApi from './[name].api'

var mockFetchModifier: jest.Mock
var mockAddModifier: jest.Mock
var mockUpdateModifier: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchModifier: (mockFetchModifier = jest.fn()),
  addModifier: (mockAddModifier = jest.fn()),
  updateModifierFields: (mockUpdateModifier = jest.fn()),
}))

const data = new Modifier('hi', Status.active, 5)

it('fetches given modifier', async () => {
  mockFetchModifier.mockReturnValue(data)

  await testApiHandler<Modifier>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      await expect(res.json()).resolves.toEqual(data)
    },
  })
})

it('adds given modifier', async () => {
  await testApiHandler({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'POST', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      await expect(res.json()).resolves.toBe(null)
      expect(mockAddModifier).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given modifier', async () => {
  mockUpdateModifier.mockReturnValue(data)

  await testApiHandler({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PATCH', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      await expect(res.json()).resolves.toBe(null)
      expect(mockUpdateModifier).toHaveBeenCalledTimes(1)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(await res.json()).toBe('Method not allowed.')
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
      expect(await res.json()).toMatch(/name/i)
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
      expect(await res.json()).toMatch(/json/i)
    },
  })
})
