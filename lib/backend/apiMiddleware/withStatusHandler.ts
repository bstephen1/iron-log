import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'
import { ApiError } from '../../../models/ApiError'
import { ApiHandler, getUserId } from './util'

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

      if (!payload) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'not found')
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
          message: 'invalid request',
          details: e.errors,
        })
      } else {
        if (process.env.SERVER_LOG_LEVEL === 'verbose') {
          console.error(e)
        }
        const statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        res.status(statusCode).json({ statusCode, message: 'unknown error' })
      }
    }
  }
}
