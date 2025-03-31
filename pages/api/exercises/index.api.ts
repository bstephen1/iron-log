import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchExercises } from '../../../lib/backend/mongoService'
import { exerciseQuerySchema } from '../../../models/AsyncSelectorOption/Exercise'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const filter = exerciseQuerySchema.parse(req.query)

  return await fetchExercises(userId, filter)
}

export default withStatusHandler(handler)
