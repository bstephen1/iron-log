import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  addExercise,
  deleteExercise,
  fetchExercise,
  updateExercise,
  updateExerciseFields,
} from '../../../lib/backend/mongoService'
import { idSchema } from '../../../lib/util'
import { exerciseSchema } from '../../../models/AsyncSelectorOption/Exercise'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchExercise(userId, id)
    case 'POST':
      return await addExercise(userId, exerciseSchema.parse(req.body))
    case 'PUT':
      return await updateExercise(userId, exerciseSchema.parse(req.body))
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
