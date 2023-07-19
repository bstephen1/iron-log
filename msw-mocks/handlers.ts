import { StatusCodes } from 'http-status-codes'
import { rest } from 'msw'

/** This provides default mock responses to endpoints.
 *  Generally in tests the test should define the data it is expecting,
 *  but the defaults here can be useful to mock out valid responses to
 *  endpoints the test doesn't care about.
 */
export const handlers = [
  // Handler matching is done by order of definition. This handler will
  // match any api endpoint, so it should be defined last and act as a default res.
  rest.all('/api/*', (_, res, ctx) =>
    // NOTE: Returning null could potentially cause issues with array fetches in restService.ts
    // which expect either an array or undefined, not null. Specifically if a component is
    // checking that the return value === undefined instead of == undefined or just checking falsy
    // (an empty array is not considered falsy). In this case the component should just be updated to
    // with one of the latter options. Null must be used here because undefined is not considered valid json.
    res(ctx.status(StatusCodes.OK), ctx.json(null))
  ),
]
