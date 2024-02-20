import { StatusCodes } from 'http-status-codes'
import { testApiHandler } from 'next-test-api-route-handler'
import { ApiError } from 'next/dist/server/api-utils'
import { vi } from 'vitest'
import withStatusHandler from './withStatusHandler'

const mockHandler = vi.fn()

beforeEach(() => {
  mockHandler.mockClear()
})

it('should set the response body to the returned non-null payload', async () => {
  const payload = 'payload'
  mockHandler.mockResolvedValueOnce(payload)
  await testApiHandler({
    pagesHandler: withStatusHandler(mockHandler),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toBe(payload)
    },
  })
})

// ensure json is handling null values correctly
it('should set the response body to the returned null payload', async () => {
  const payload = null
  mockHandler.mockReturnValueOnce(payload)
  await testApiHandler({
    pagesHandler: withStatusHandler(mockHandler),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toBe(payload)
    },
  })
})

it('returns error message when content header is invalid', async () => {
  await testApiHandler({
    pagesHandler: withStatusHandler(mockHandler),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PATCH', body: 'not json' })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await res.json()).toMatch(/json/i)
    },
  })
})

it('returns error message when ApiError is thrown', async () => {
  const error = new ApiError(StatusCodes.IM_A_TEAPOT, 'short and stout')
  await testApiHandler({
    pagesHandler: withStatusHandler(() => {
      throw error
    }),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(error.statusCode)
      expect(await res.json()).toBe(error.message)
    },
  })
})

it('returns generic error message when unknown error is thrown', async () => {
  const error = new Error()
  await testApiHandler({
    pagesHandler: withStatusHandler(() => {
      throw error
    }),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(await res.json()).toMatch(/unexpected error/i)
    },
  })
})
