import type { NextApiRequest } from 'next'
import {
  ApiResponse,
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

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse> {
  const id = validateId(req.query.id)

  switch (req.method) {
    case 'GET':
      return { payload: await fetchRecord(userId, id) }
    case 'POST':
      return { payload: await addRecord(userId, JSON.parse(req.body)) }
    case 'PUT':
      return { payload: await updateRecord(userId, JSON.parse(req.body)) }
    case 'PATCH':
      return { payload: await updateRecordFields(userId, JSON.parse(req.body)) }
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
