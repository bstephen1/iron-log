import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchRecord } from '../../../lib/backend/mongoService'
import { idSchema } from '../../../models/schemas'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchRecord(userId, id)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
