import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { addRecord, fetchRecords } from '../../../lib/backend/mongoService'
import { dateRangeQuerySchema } from '../../../models//DateRangeQuery'
import { recordQuerySchema, recordSchema } from '../../../models/Record'

async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET': {
      const recordFilter = recordQuerySchema.parse(req.query)
      const dateFilter = dateRangeQuerySchema.parse(req.query)

      return await fetchRecords(userId, recordFilter, dateFilter)
    }
    case 'POST':
      return await addRecord(userId, recordSchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
