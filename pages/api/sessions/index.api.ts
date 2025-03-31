import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchSessions } from '../../../lib/backend/mongoService'
import { dateRangeQuerySchema } from '../../../models/query-filters/DateRangeQuery'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const filter = dateRangeQuerySchema.parse(req.query)
  return await fetchSessions(userId, filter)
}

export default withStatusHandler(handler)
