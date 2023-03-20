import '@testing-library/jest-dom'
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

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
