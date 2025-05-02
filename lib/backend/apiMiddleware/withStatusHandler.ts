import { StatusCodes } from 'http-status-codes'
import { type NextApiRequest, type NextApiResponse } from 'next'
import { ZodError } from 'zod'
import { ApiError } from '../../../models/ApiError'
import { ERRORS } from '../../frontend/constants'
import { type ApiHandler, getUserId } from './util'

/** This HOF is responsible for anything involving "res" in the handler.
 * The handler either returns an ApiResponse or throws an ApiError.
 */
export default function withStatusHandler<T>(handler: ApiHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = await getUserId(req, res)

      if (req.body && req.headers['content-type'] !== 'application/json') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'content type must be json')
      }

      const payload = await handler(req, userId)

      // The payload may be null. For GET requests, useSWR expects the res to be
      // null when the resource does not exist, so we don't throw a 404 error.
      // We rely on this behavior in the sessions/[date] endpoint -- we don't want
      // to create a new session every time a user flips through dates unless they
      // actually create a record for that date.
      // For any other method, the request is attempting to update data in the db,
      // so a null res indicates that something went wrong. All other methods
      // expect the res to contain the updated data.
      if (!payload && req.method?.toLocaleUpperCase() !== 'GET') {
        throw new ApiError(StatusCodes.NOT_FOUND, 'record does not exist')
      }

      res.status(StatusCodes.OK).json(payload)
    } catch (e) {
      if (e instanceof ApiError) {
        const { statusCode, message } = e
        res.status(statusCode).json({ statusCode, message })
      } else if (e instanceof ZodError) {
        const statusCode = StatusCodes.BAD_REQUEST
        res.status(statusCode).json({
          statusCode,
          message: ERRORS.validationFail,
          details: e.errors,
        })
      } else {
        if (process.env.SERVER_LOG_LEVEL === 'verbose') {
          console.error(e)
        }
        const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(statusCode).json({
          statusCode,
          message: e instanceof Error ? e.message : ERRORS.default,
        })
      }
    }
  }
}
