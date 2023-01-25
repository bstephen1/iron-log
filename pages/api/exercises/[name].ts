import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { validateName } from '../../../lib/backend/apiQueryValidationService'
import {
  addExercise,
  fetchExercise,
  updateExercise,
  updateExerciseFields,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      const exercise = await fetchExercise(userId, name)
      return { payload: exercise }
    case 'POST':
      await addExercise(userId, JSON.parse(req.body))
      return emptyApiResponse
    case 'PUT':
      await updateExercise(userId, JSON.parse(req.body))
      return emptyApiResponse
    case 'PATCH':
      await updateExerciseFields(userId, JSON.parse(req.body))
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
