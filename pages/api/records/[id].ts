import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
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
      const record = await fetchRecord(userId, id)
      return { payload: record }
    case 'POST':
      await addRecord(JSON.parse(req.body))
      return emptyApiResponse
    case 'PUT':
      await updateRecord(JSON.parse(req.body))
      return emptyApiResponse
    case 'PATCH':
      await updateRecordFields(JSON.parse(req.body))
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withApiMiddleware(handler)
