import { StatusCodes } from 'http-status-codes'
import type { NextApiRequest } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import {
  emptyApiResponse,
  methodNotAllowed,
} from '../../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  addSession,
  fetchSession,
  updateSession,
} from '../../../../lib/backend/mongoService'
import { validDateStringRegex } from '../../../../lib/frontend/constants'

async function handler(req: NextApiRequest, userId: string) {
  const date = req.query.date

  if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid date.')
  }

  switch (req.method) {
    case 'GET':
      const record = await fetchSession(userId, date)
      return { payload: record }
    case 'POST':
      await addSession(userId, JSON.parse(req.body))
      return emptyApiResponse
    case 'PUT':
      await updateSession(userId, JSON.parse(req.body))
      return emptyApiResponse
    default:
      return methodNotAllowed
  }
}

export default withStatusHandler(handler)
