import { StatusCodes } from 'http-status-codes'
import Exercise from 'models/Exercise'
import { testApiHandler } from 'next-test-api-route-handler'
import exercises from 'pages/api/exercises/index.api'

var mockFetch: jest.Mock
jest.mock('lib/backend/mongoService', () => ({
  fetchExercises: (mockFetch = jest.fn()),
}))

it('fetches exercises', async () => {
  const data = [new Exercise('hi')]
  mockFetch.mockReturnValue(data)

  await testApiHandler<Exercise[]>({
    handler: exercises,
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
    handler: exercises,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(res.status).toBe(StatusCodes.METHOD_NOT_ALLOWED)
      expect(res.json()).resolves.toMatch(/not allowed/i)
    },
  })
})
