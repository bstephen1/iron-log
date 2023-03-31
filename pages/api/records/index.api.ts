import Record from 'models/Record'
import type { NextApiRequest } from 'next'
import {
  ApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { buildRecordQuery } from '../../../lib/backend/apiQueryValidationService'
import { fetchRecords } from '../../../lib/backend/mongoService'

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Record[]>> {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const query = buildRecordQuery(req.query, userId)

  const records = await fetchRecords(query)
  return { payload: records }
}

export default withStatusHandler(handler)
