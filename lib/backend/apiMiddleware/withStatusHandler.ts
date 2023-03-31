import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { ApiHandler, getUserId } from './util'

/** This HOF is responsible for anything involving "res" in the handler.
 * The handler either returns an ApiResponse or throws an ApiError.
 */
export default function withStatusHandler<T>(handler: ApiHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = await getUserId(req, res)
      if (process.env.SERVER_LOG_LEVEL === 'verbose') {
        console.log(`Incoming ${req.method} on ${req.url} for user ${userId}`)
      }

      const { payload, nullOk } = await handler(req, userId)

      if (payload === null && !nullOk) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Record not found.')
      }

      // .json() must accept a serializable object. Null is considered valid json (returning null),
      // but undefined is not. So if there is no payload we must send back null instead of undefined.
      // SWR on the frontend also treats undefined as loading and null as "loading finished, no data".
      res.status(StatusCodes.OK).json(payload ?? null)
    } catch (e: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      let message = 'An unexpected error occured.'
      if (e instanceof ApiError) {
        statusCode = e.statusCode ?? statusCode
        message = e.message ?? message
      } else if (e?.message.includes('JSON')) {
        statusCode = StatusCodes.BAD_REQUEST
        message = e.message
      }

      if (process.env.SERVER_LOG_LEVEL === 'verbose') {
        statusCode > 499
          ? console.trace(e)
          : console.error(`Error ${statusCode}: ${message}`)
      }
      res.status(statusCode).json(message)
    }
  }
}
