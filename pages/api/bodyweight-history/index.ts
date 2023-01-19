import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { buildBodyweightQuery } from '../../../lib/backend/apiQueryValidationService'
import {
  addBodyweight,
  fetchBodyweightHistory,
  updateBodyweight,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const { start, limit, end } = buildBodyweightQuery(req.query)

  switch (req.method) {
    case 'GET':
      const data = await fetchBodyweightHistory(userId, limit, start, end)
      return { payload: data }
    case 'POST':
      await addBodyweight(userId, JSON.parse(req.body))
      return emptyApiResponse
    case 'PUT':
      await updateBodyweight(userId, JSON.parse(req.body))
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withApiMiddleware(handler)
