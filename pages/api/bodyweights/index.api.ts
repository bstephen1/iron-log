import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchBodyweights } from '../../../lib/backend/mongoService'
import { dateRangeQuerySchema } from '../../../models/DateRangeQuery'
import { bodyweightQuerySchema } from '../../../models/Bodyweight'

async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET':
      return await fetchBodyweights(
        userId,
        bodyweightQuerySchema.parse(req.query),
        dateRangeQuerySchema.parse(req.query)
      )
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
