import { StatusCodes } from 'http-status-codes'
import { testApiHandler } from 'next-test-api-route-handler'
import { vi } from 'vitest'
import { ApiError } from '../../../models/ApiError'
import withStatusHandler from './withStatusHandler'
import { ZodError } from 'zod'

const mockHandler = vi.fn()

beforeEach(() => {
  mockHandler.mockClear()
})

it('should set the response body to the returned payload', async () => {
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

it('returns error when payload is null and method is not GET', async () => {
  mockHandler.mockReturnValueOnce(null)
  await testApiHandler({
    pagesHandler: withStatusHandler(mockHandler),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.NOT_FOUND)
    },
  })
})

it('returns null and does not throw error when payload is null and method is GET', async () => {
  mockHandler.mockReturnValueOnce(null)
  await testApiHandler({
    pagesHandler: withStatusHandler(mockHandler),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.OK)
      expect(await res.json()).toBe(null)
    },
  })
})

it('returns error when content header is invalid', async () => {
  await testApiHandler({
    pagesHandler: withStatusHandler(mockHandler),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PATCH', body: 'not json' })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await res.json()).toEqual({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'content type must be json',
      })
    },
  })
})

it('returns error when ApiError is thrown', async () => {
  const error = new ApiError(StatusCodes.IM_A_TEAPOT, 'short and stout')
  await testApiHandler({
    pagesHandler: withStatusHandler(() => {
      throw error
    }),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(error.statusCode)
      expect(await res.json()).toEqual({
        statusCode: error.statusCode,
        message: error.message,
      })
    },
  })
})

it('returns error when ZodError is thrown', async () => {
  const error = new ZodError([
    { message: 'message', path: ['path'], code: 'custom' },
  ])
  await testApiHandler({
    pagesHandler: withStatusHandler(() => {
      throw error
    }),
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      expect(res.status).toBe(StatusCodes.BAD_REQUEST)
      expect(await res.json()).toEqual({
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'invalid request',
        details: error.errors,
      })
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
      expect(await res.json()).toMatchObject(/unexpected error/i)
    },
  })
})
