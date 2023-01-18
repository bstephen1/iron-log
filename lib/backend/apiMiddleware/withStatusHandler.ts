import { StatusCodes } from 'http-status-codes'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import { ApiHandler, getUserId } from './util'

// this HOF is responsible for anything involving "res" in the handler.
// The handler either returns an ApiResponse or throws an ApiError.
export default function withStatusHandler(handler: ApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(`Incoming ${req.method} on ${req.url}`)

    try {
      const userId = await getUserId(req, res)
      const { statusCode, payload } = await handler(req, userId)
      res.status(statusCode || StatusCodes.OK).json(payload ?? {})
    } catch (e: unknown) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      let message = 'An unexpected error occured.'
      if (e instanceof ApiError) {
        statusCode = e.statusCode ?? statusCode
        message = e.message ?? message
      }
      res.status(statusCode).json(message)
    }
  }
}
