import {
  ApiResponse,
  methodNotAllowed,
  UserId,
} from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { buildExerciseQuery } from 'lib/backend/apiQueryValidationService'
import { fetchExercises } from 'lib/backend/mongoService'
import Exercise from 'models/Exercise'
import type { NextApiRequest } from 'next'

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Exercise[]>> {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const query = buildExerciseQuery(req.query, userId)

  const exercises = await fetchExercises(query)
  return { payload: exercises }
}

export default withStatusHandler(handler)
