import { methodNotAllowed, UserId } from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { valiDate, validateId } from 'lib/backend/apiQueryValidationService'
import { deleteSessionRecord, fetchRecord } from 'lib/backend/mongoService'
import type { NextApiRequest } from 'next'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = validateId(req.query.id)
  const date = valiDate(req.query.date)

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
