import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../../lib/backend/apiMiddleware/withApiMiddleware'
import { valiDate } from '../../../../lib/backend/apiQueryValidationService'
import {
  addSession,
  fetchSession,
  updateSession,
} from '../../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const date = valiDate(req.query.date)

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

export default withApiMiddleware(handler)
