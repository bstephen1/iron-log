import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchRecords } from '../../../lib/backend/mongoService'
import { dateRangeQuerySchema } from '../../../models//DateRangeQuery'
import { recordQuerySchema } from '../../../models/Record'

async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET': {
      const recordFilter = recordQuerySchema.parse(req.query)
      const dateFilter = dateRangeQuerySchema.parse(req.query)

      return await fetchRecords(userId, recordFilter, dateFilter)
    }
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
