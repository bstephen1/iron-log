import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  deleteSessionRecord,
  fetchRecord,
} from '../../../../../lib/backend/mongoService'
import { dateSchema, idSchema } from '../../../../../lib/util'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)
  const date = dateSchema.parse(req.query.date)

  switch (req.method) {
    case 'GET':
      return await fetchRecord(userId, id)
    case 'DELETE':
      return await deleteSessionRecord(userId, date, id)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
