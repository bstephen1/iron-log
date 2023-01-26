import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { buildDateRangeQuery } from '../../../lib/backend/apiQueryValidationService'
import { fetchSessions } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const { start, limit, end } = buildDateRangeQuery(req.query)

  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const data = await fetchSessions(userId, limit, start, end)
  return { payload: data }
}

export default withStatusHandler(handler)
