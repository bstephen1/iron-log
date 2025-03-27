import type { NextApiRequest } from 'next'
import {
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
import { bodyweightSchema } from '../../../models/Bodyweight'

// todo: This endpoint is weird in that it can return a singleton or an array depending on the http method.
// May want to update it to have a [date].ts for post/put to stay in line with other endpoints.
async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET': {
      const query = buildBodyweightQuery(req.query)
      return await fetchBodyweightHistory(userId, query)
    }
    case 'POST':
      return await addBodyweight(userId, bodyweightSchema.parse(req.body))
    case 'PUT':
      return await updateBodyweight(userId, bodyweightSchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
