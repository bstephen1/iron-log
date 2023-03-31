import {
  ApiResponse,
  methodNotAllowed,
  UserId,
} from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { valiDate } from 'lib/backend/apiQueryValidationService'
import { fetchRecords } from 'lib/backend/mongoService'
import Record from 'models/Record'
import type { NextApiRequest } from 'next'

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Record[]>> {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const date = valiDate(req.query.date)
  const records = await fetchRecords({ userId, filter: { date } })
  return { payload: records }
}

export default withStatusHandler(handler)
