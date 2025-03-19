import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { validateId } from '../../../lib/backend/apiQueryValidationService'
import {
  addExercise,
  deleteExercise,
  fetchExercise,
  updateExercise,
  updateExerciseFields,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = validateId(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchExercise(userId, id)
    case 'POST':
      return await addExercise(userId, req.body)
    case 'PUT':
      return await updateExercise(userId, req.body)
    case 'PATCH':
      return await updateExerciseFields(userId, id, req.body)
    case 'DELETE':
      return await deleteExercise(userId, id)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
