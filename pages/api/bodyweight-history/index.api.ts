import Bodyweight from 'models/Bodyweight'
import type { NextApiRequest } from 'next'
import {
  ApiResponse,
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
async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Bodyweight | Bodyweight[]>> {
  const query = buildBodyweightQuery(req.query, userId)

  switch (req.method) {
    case 'GET':
      return { payload: await fetchBodyweightHistory(query) } as ApiResponse<
        Bodyweight[]
      >
    case 'POST':
      return {
        payload: await addBodyweight(userId, JSON.parse(req.body)),
      } as ApiResponse<Bodyweight>
    case 'PUT':
      return {
        payload: await updateBodyweight(userId, JSON.parse(req.body)),
      } as ApiResponse<Bodyweight>
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
