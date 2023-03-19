import { StatusCodes } from 'http-status-codes'
import { generateId } from 'lib/util'
import Bodyweight from 'models/Bodyweight'
import { rest } from 'msw'

/** This provides default mock responses to endpoints.
 *  Generally in tests the test should define the data it is expecting,
 *  But the defaults here can be useful to mock out valid responses to
 *  endpoints the test doesn't care about.
 */
export const handlers = [
  rest.get('/api/bodyweight-history', (_, res, ctx) =>
    res(
      ctx.status(StatusCodes.OK),
      ctx.json<Bodyweight[]>([
        { value: 50, date: '1970-01-01', type: 'official', _id: generateId() },
      ])
    )
  ),
]
