import { StatusCodes } from 'http-status-codes'
import Category from 'models/Category'
import { testApiHandler } from 'next-test-api-route-handler'
import NameApi from './[name].api'

var mockFetch: jest.Mock
var mockAdd: jest.Mock
var mockUpdate: jest.Mock

jest.mock('lib/backend/mongoService', () => ({
  fetchCategory: (mockFetch = jest.fn()),
  addCategory: (mockAdd = jest.fn()),
  updateCategoryFields: (mockUpdate = jest.fn()),
}))

const data = new Category('hi')

it('fetches given category', async () => {
  mockFetch.mockReturnValue(data)

  await testApiHandler<Category>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      await expect(await res.json()).toEqual(data)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    },
  })
})

it('adds given category', async () => {
  mockAdd.mockReturnValue(data)

  await testApiHandler<Category>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      })
      expect(res.status).toBe(StatusCodes.OK)
      await expect(await res.json()).toEqual(data)
      expect(mockAdd).toHaveBeenCalledTimes(1)
    },
  })
})

it('updates given category', async () => {
  mockUpdate.mockReturnValue(data)

  await testApiHandler<Category>({
    handler: NameApi,
    params: { name: 'name' },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
      })
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
