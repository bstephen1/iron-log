import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { validateId } from '../../../lib/backend/apiQueryValidationService'
import {
  addRecord,
  fetchRecord,
  updateRecord,
  updateRecordFields,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = validateId(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchRecord(userId, id)
    case 'POST':
      return await addRecord(userId, JSON.parse(req.body))
    case 'PUT':
      return await updateRecord(userId, JSON.parse(req.body))
    case 'PATCH':
      return await updateRecordFields(userId, JSON.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
