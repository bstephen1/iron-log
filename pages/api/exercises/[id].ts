import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { validateId } from '../../../lib/backend/apiQueryValidationService'
import {
  addExercise,
  fetchExercise,
  updateExercise,
  updateExerciseFields,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = validateId(req.query.id)

  switch (req.method) {
    case 'GET':
      const exercise = await fetchExercise(userId, id)
      return { payload: exercise }
    case 'POST':
      await addExercise(JSON.parse(req.body))
      return emptyApiResponse
    case 'PUT':
      await updateExercise(JSON.parse(req.body))
      return emptyApiResponse
    case 'PATCH':
      await updateExerciseFields(JSON.parse(req.body))
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withApiMiddleware(handler)
