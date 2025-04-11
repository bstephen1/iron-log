import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  deleteExercise,
  fetchExercise,
  updateExerciseFields,
} from '../../../lib/backend/mongoService'
import { exerciseSchema } from '../../../models/AsyncSelectorOption/Exercise'
import { idSchema } from '../../../models/schemas'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchExercise(userId, id)
    case 'PATCH':
      return await updateExerciseFields(
        userId,
        id,
        exerciseSchema.partial().parse(req.body)
      )
    case 'DELETE':
      return await deleteExercise(userId, id)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
