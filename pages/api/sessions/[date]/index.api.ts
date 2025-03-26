import type { NextApiRequest } from 'next'
import {
  UserId,
  methodNotAllowed,
} from '../../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../../lib/backend/apiMiddleware/withStatusHandler'
import { valiDate } from '../../../../lib/backend/apiQueryValidationService'
import {
  fetchSession,
  addSession,
  updateSession,
} from '../../../../lib/backend/mongoService'
import { sessionLogSchema } from '../../../../models/SessionLog'

async function handler(req: NextApiRequest, userId: UserId) {
  const date = valiDate(req.query.date)

  switch (req.method) {
    case 'GET':
      return await fetchSession(userId, date)
    case 'POST':
      return await addSession(userId, sessionLogSchema.parse(req.body))
    case 'PUT':
      return await updateSession(userId, sessionLogSchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
