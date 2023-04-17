import { methodNotAllowed, UserId } from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { valiDate } from 'lib/backend/apiQueryValidationService'
import {
  addSession,
  fetchSession,
  updateSession,
} from 'lib/backend/mongoService'
import type { NextApiRequest } from 'next'

async function handler(req: NextApiRequest, userId: UserId) {
  const date = valiDate(req.query.date)

  switch (req.method) {
    case 'GET':
      return await fetchSession(userId, date)
    case 'POST':
      return await addSession(userId, req.body)
    case 'PUT':
      return await updateSession(userId, req.body)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
