import '@testing-library/jest-dom'
import dotenv from 'dotenv'
import { vi } from 'vitest'
import 'whatwg-fetch'
import { server } from './msw-mocks/server'

// load env variables
// todo: does vitest have a different way of doing this?
dotenv.config({ path: './.env.test' })

vi.mock('lib/backend/mongoConnect', () => ({}))
vi.mock('pages/api/auth/[...nextauth].api', () => ({ authOptions: vi.fn() }))
vi.mock('next-auth', () => ({
  getServerSession: () => ({ user: { id: '1234567890AB' } }),
}))

// msw server
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
