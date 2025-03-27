import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { buildRecordQuery } from '../../../lib/backend/apiQueryValidationService'
import { fetchRecords } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const query = buildRecordQuery(req.query)

  return await fetchRecords(userId, query)
}

export default withStatusHandler(handler)
