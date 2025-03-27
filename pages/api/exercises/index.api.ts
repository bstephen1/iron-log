import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { buildExerciseQuery } from '../../../lib/backend/apiQueryValidationService'
import { fetchExercises } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const query = buildExerciseQuery(req.query)

  return await fetchExercises(userId, query)
}

export default withStatusHandler(handler)
