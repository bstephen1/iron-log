import { methodNotAllowed, UserId } from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { buildDateRangeQuery } from 'lib/backend/apiQueryValidationService'
import { fetchSessions } from 'lib/backend/mongoService'
import SessionLog from 'models/SessionLog'
import type { NextApiRequest } from 'next'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }
  const query = buildDateRangeQuery<SessionLog>(req.query, userId)

  return await fetchSessions(query)
}

export default withStatusHandler(handler)
