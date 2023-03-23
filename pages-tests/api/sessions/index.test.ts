import SessionLog from 'models/SessionLog'
import { testApiHandler } from 'next-test-api-route-handler'
import sessions from 'pages/api/sessions'

var mockFetchSessions: jest.Mock
jest.mock('lib/backend/mongoService', () => ({
  fetchSessions: (mockFetchSessions = jest.fn()),
}))

it('fetches sessions', async () => {
  const data = [new SessionLog('2000-01-01')]
  mockFetchSessions.mockReturnValue(data)

  await testApiHandler<SessionLog[]>({
    handler: sessions,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' })
      await expect(res.json()).resolves.toEqual(data)
    },
  })
})

it('blocks invalid method types', async () => {
  await testApiHandler<SessionLog[]>({
    handler: sessions,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'PUT' })
      expect(await res.json()).toBe('Method not allowed.')
    },
  })
})
