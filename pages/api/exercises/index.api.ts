import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { addExercise, fetchExercises } from '../../../lib/backend/mongoService'
import {
  exerciseQuerySchema,
  exerciseSchema,
} from '../../../models/AsyncSelectorOption/Exercise'

async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET':
      const filter = exerciseQuerySchema.parse(req.query)
      return await fetchExercises(userId, filter)
    case 'POST':
      return await addExercise(userId, exerciseSchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
