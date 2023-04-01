import { StatusCodes } from 'http-status-codes'
import Category from 'models/Category'
import { testApiHandler } from 'next-test-api-route-handler'
import categories from 'pages/api/categories/index.api'

var mockFetch: jest.Mock
jest.mock('lib/backend/mongoService', () => ({
  fetchCategories: (mockFetch = jest.fn()),
}))

it('fetches categories', async () => {
  const data = [new Category('hi')]
  mockFetch.mockReturnValue(data)

  await testApiHandler<Category[]>({
    handler: categories,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(res.json()).resolves.toEqual(data)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler({
    handler: categories,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(res.json()).resolves.toMatch(/not allowed/i)
    },
  })
})
