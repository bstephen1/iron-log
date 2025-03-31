import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  addRecord,
  fetchRecord,
  updateRecord,
  updateRecordFields,
} from '../../../lib/backend/mongoService'
import { idSchema } from '../../../lib/util'
import { recordSchema } from '../../../models/Record'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchRecord(userId, id)
    case 'POST':
      return await addRecord(userId, recordSchema.parse(req.body))
    case 'PUT':
      return await updateRecord(userId, recordSchema.parse(req.body))
    case 'PATCH':
      return await updateRecordFields(
        userId,
        id,
        recordSchema.partial().parse(req.body)
      )
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
