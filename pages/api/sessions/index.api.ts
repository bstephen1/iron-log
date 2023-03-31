import {
  ApiResponse,
  methodNotAllowed,
  UserId,
} from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { buildDateRangeQuery } from 'lib/backend/apiQueryValidationService'
import { fetchSessions } from 'lib/backend/mongoService'
import SessionLog from 'models/SessionLog'
import type { NextApiRequest } from 'next'

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<SessionLog[]>> {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }
  const query = buildDateRangeQuery<SessionLog>(req.query, userId)

  const data = await fetchSessions(query)
  return { payload: data }
}

export default withStatusHandler(handler)
