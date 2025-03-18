import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from '../../../models/ApiError'
import { ApiHandler, getUserId } from './util'

/** This HOF is responsible for anything involving "res" in the handler.
 * The handler either returns an ApiResponse or throws an ApiError.
 */
export default function withStatusHandler<T>(handler: ApiHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = await getUserId(req, res)
      if (process.env.SERVER_LOG_LEVEL === 'verbose') {
        console.log(`${req.method} ${req.url} for user ${userId.toString()}`)
      }

      if (req.body && req.headers['content-type'] !== 'application/json') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'content type must be json')
      }

      const payload = await handler(req, userId)

      // Note: null data is being returned as status 200. Originally it was returning
      // a 404, but that made implementation more complicated handling the error,
      // and a 200 makes sense because the request did complete successfully, it was just empty.
      // A 204 (no content) might semantically make sense, but it breaks json parsing and
      // the client has to then factor in a null body instead of an empty json object.
      res.status(StatusCodes.OK).json(payload)
    } catch (e) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      let message = 'An unexpected error occured.'
      if (e instanceof ApiError) {
        statusCode = e.statusCode
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
