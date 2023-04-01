import { StatusCodes } from 'http-status-codes'
import Exercise from 'models/Exercise'
import { testApiHandler } from 'next-test-api-route-handler'
import NameApi from './[name].api'

var mockFetch: jest.Mock
var mockAdd: jest.Mock
var mockUpdate: jest.Mock
var mockUpdateFields: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchExercise: (mockFetch = jest.fn()),
  addExercise: (mockAdd = jest.fn()),
  updateExercise: (mockUpdate = jest.fn()),
  updateExerciseFields: (mockUpdateFields = jest.fn()),
}))

const data = new Exercise('hi')

it('fetches given exercise', async () => {
  mockFetch.mockReturnValue(data)

  await testApiHandler<Exercise>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    },
  })
})

it('adds given exercise', async () => {
  mockAdd.mockReturnValue(data)

  await testApiHandler<Exercise>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'POST', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockAdd).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given exercise fields', async () => {
  mockUpdateFields.mockReturnValue(data)

  await testApiHandler<Exercise>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PATCH', body: JSON.stringify(data) })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toEqual(data)
      expect(mockUpdateFields).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given exercise', async () => {
  mockUpdate.mockReturnValue(data)

  await testApiHandler<Exercise>({
    handler: NameApi,
    params: { name: 'name' },
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
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'TRACE' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(await res.json()).toMatch(/not allowed/i)
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
