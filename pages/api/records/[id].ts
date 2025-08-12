import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  deleteRecord,
  fetchRecord,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { idSchema } from '../../../models/schemas'
import { recordSchema } from '../../../models/Record'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchRecord(userId, id)
    case 'PATCH':
      return await updateRecordFields(
        userId,
        id,
        recordSchema.partial().parse(req.body)
      )
    case 'DELETE':
      return await deleteRecord(userId, id)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
