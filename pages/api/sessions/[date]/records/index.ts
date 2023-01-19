import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../../../lib/backend/apiMiddleware/withStatusHandler'
import { valiDate } from '../../../../../lib/backend/apiQueryValidationService'
import { fetchRecords } from '../../../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const date = valiDate(req.query.date)
  const records = await fetchRecords({ userId, date })
  return { payload: records }
}

export default withStatusHandler(handler)
