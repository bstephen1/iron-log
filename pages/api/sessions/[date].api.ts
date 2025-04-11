import type { NextApiRequest } from 'next'
import {
  UserId,
  methodNotAllowed,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchSession, updateSession } from '../../../lib/backend/mongoService'
import { sessionLogSchema } from '../../../models/SessionLog'
import { dateSchema } from '../../../models/schemas'

async function handler(req: NextApiRequest, userId: UserId) {
  const date = dateSchema.parse(req.query.date)

  switch (req.method) {
    case 'GET':
      return await fetchSession(userId, date)
    case 'PUT':
      return await updateSession(userId, sessionLogSchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
