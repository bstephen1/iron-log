import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../../../lib/backend/apiMiddleware/withApiMiddleware'
import {
  valiDate,
  validateId,
} from '../../../../../lib/backend/apiQueryValidationService'
import {
  deleteSessionRecord,
  fetchRecord,
} from '../../../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = validateId(req.query.id)
  const date = valiDate(req.query.date)

  switch (req.method) {
    case 'GET':
      const record = await fetchRecord(userId, id)
      return { payload: record }
    case 'DELETE':
      await deleteSessionRecord({ date, recordId: id })
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withApiMiddleware(handler)
