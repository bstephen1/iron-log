import { StatusCodes } from 'http-status-codes'
import type { NextApiRequest } from 'next'
import { unstable_getServerSession } from 'next-auth'
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
import { authOptions } from '../../auth/[...nextauth]'

async function handler(req: NextApiRequest, userId: string) {
  const date = req.query.date

  const session = await unstable_getServerSession(authOptions)

  if (!session || !session.user?.id) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'You must be logged in.')
  }

  if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid date.')
  }

  switch (req.method) {
    case 'GET':
      const record = await fetchSession(session.user.id, date)
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
