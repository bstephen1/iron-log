import Exercise from 'models/Exercise'
import type { NextApiRequest } from 'next'
import {
  ApiResponse,
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

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Exercise>> {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      return { payload: await fetchExercise(userId, name) }
    case 'POST':
      return { payload: await addExercise(userId, JSON.parse(req.body)) }
    case 'PUT':
      return { payload: await updateExercise(userId, JSON.parse(req.body)) }
    case 'PATCH':
      return {
        payload: await updateExerciseFields(userId, JSON.parse(req.body)),
      }
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
