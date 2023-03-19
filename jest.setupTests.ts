import '@testing-library/jest-dom'
import { TextDecoder, TextEncoder } from 'util'
import 'whatwg-fetch'
import { server } from './mocks/server'

// There is an issue with a mongo dep (whatwg-url) and jest.
// The mongo dep requires "TextEncoder" to be imported,
// but it doesn't come bundled with jsdom.
// Here we are manually importing it to avoid the import errors.
// See: https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
// https://stackoverflow.com/a/74377819
// there is a compatibility issue between a mongo dep and jest and
// unfortunately it seems the only solution is to modify the node_modules file.
global.TextEncoder = TextEncoder
// Typescript doesn't like this but whatever, it works.
global.TextDecoder = TextDecoder as any

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
