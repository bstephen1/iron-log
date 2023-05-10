import '@testing-library/jest-dom'
import dotenv from 'dotenv'
import { TextDecoder, TextEncoder } from 'util'
import 'whatwg-fetch'
import { server } from './msw-mocks/server'
import { vi } from 'vitest'

// There is an issue with a mongo dep (whatwg-url) and jest.
// The mongo dep requires "TextEncoder" to be imported,
// but it doesn't come bundled with jsdom.
// Here we are manually importing it to avoid the import errors.
// See:
// https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
// https://stackoverflow.com/a/74377819
global.TextEncoder = TextEncoder
// Typescript doesn't like the decoder for some reason so we have to force it.
global.TextDecoder = TextDecoder as any

dotenv.config({ path: './.env.test' })

// mongoConnect and nextauth cause huge problems for jest.
// These mocks remove compilation errors. Jest mocks don't affect consts
// tho so anything that tries to use certain exported consts may break.
// Eg, mongoService can't use "db" from mongoConnect since it's undefined.
// This should be fine because it seems only mongoService is affected and
// that probably will also be mocked. This is a pretty esoteric error that's
// hard to debug, so I'd caution against making changes to this pattern unless
// there's a good reason to.
// An alternate solution is to use a __mocks__ folder, but that only works for
// node_modules, so we can only mock out next-auth.
vi.mock('lib/backend/mongoConnect', () => ({}))
vi.mock('pages/api/auth/[...nextauth].api', () => ({}))
vi.mock('next-auth', () => ({
  getServerSession: () => ({ user: { id: '1234567890AB' } }),
}))

// msw server
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
