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

// todo: This endpoint is weird in that it can return a singleton or an array depending on the http method.
// May want to update it to have a [date].ts for post/put to stay in line with other endpoints.
async function handler(req: NextApiRequest, userId: UserId) {
  const query = buildBodyweightQuery(req.query, userId)

  // todo: some kind of guard against req.body. Should make sure content type is application json and body is Bodyweight object
  switch (req.method) {
    case 'GET':
      return await fetchBodyweightHistory(query)
    case 'POST':
      return await addBodyweight(userId, req.body)
    case 'PUT':
      return await updateBodyweight(userId, req.body)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
