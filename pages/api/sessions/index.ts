import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchSessionLogs } from '../../../lib/backend/mongoService'
import { dateRangeQuerySchema } from '../../../models//DateRangeQuery'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const filter = dateRangeQuerySchema.parse(req.query)
  return await fetchSessionLogs(userId, filter)
}

export default withStatusHandler(handler)
