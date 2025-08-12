import type { NextApiRequest } from 'next'
import {
  type UserId,
  methodNotAllowed,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchSessionLog } from '../../../lib/backend/mongoService'
import { dateSchema } from '../../../models/schemas'

async function handler(req: NextApiRequest, userId: UserId) {
  const date = dateSchema.parse(req.query.date)

  switch (req.method) {
    case 'GET':
      return await fetchSessionLog(userId, date)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
