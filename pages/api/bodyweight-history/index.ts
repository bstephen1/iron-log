import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { buildBodyweightQuery } from '../../../lib/backend/apiQueryValidationService'
import {
  addBodyweight,
  fetchBodyweightHistory,
  updateBodyweight,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const { start, limit, end, ...filters } = buildBodyweightQuery(req.query)

  switch (req.method) {
    case 'GET':
      const data = await fetchBodyweightHistory(
        userId,
        limit,
        start,
        end,
        filters
      )
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

export default withStatusHandler(handler)
