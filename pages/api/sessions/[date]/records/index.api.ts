import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchRecords } from '../../../../../lib/backend/mongoService'
import { dateSchema } from '../../../../../lib/util'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const date = dateSchema.parse(req.query.date)
  return await fetchRecords(userId, {}, { date })
}

export default withStatusHandler(handler)
