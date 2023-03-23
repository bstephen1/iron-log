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
  rest.all('/api/*', (_, res, ctx) => res(ctx.status(StatusCodes.OK))),
]
