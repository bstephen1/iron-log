import '@testing-library/jest-dom'
import dotenv from 'dotenv'
import { TextDecoder, TextEncoder } from 'util'
import 'whatwg-fetch'
import { server } from './mocks/server'

// There is an issue with a mongo dep (whatwg-url) and jest.
// The mongo dep requires "TextEncoder" to be imported,
// but it doesn't come bundled with jsdom.
// Here we are manually importing it to avoid the import errors.
// See: https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
// See: https://stackoverflow.com/a/74377819
global.TextEncoder = TextEncoder
// Typescript doesn't like the decoder for some reason so we have to force it.
global.TextDecoder = TextDecoder as any

dotenv.config({ path: './.env.test' })

// mongoConnect and nextauth cause huge problems for jest.
// These mocks remove compilation errors. Jest mocks don't affect consts
// tho so anything that tries to use certain values may break.
// Eg, mongoService can't use "db" from mongoConnect since it's undefined.
// This probably is fine because it seems only mongoService is affected and
// that will also be mocked.
jest.mock('lib/backend/mongoConnect', () => jest.fn())
jest.mock('pages/api/auth/[...nextauth]', () => jest.fn())

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
