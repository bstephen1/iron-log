import { methodNotAllowed, UserId } from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { validateName } from 'lib/backend/apiQueryValidationService'
import {
  addExercise,
  fetchExercise,
  updateExercise,
  updateExerciseFields,
} from 'lib/backend/mongoService'
import type { NextApiRequest } from 'next'

async function handler(req: NextApiRequest, userId: UserId) {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      return await fetchExercise(userId, name)
    case 'POST':
      return await addExercise(userId, req.body)
    case 'PUT':
      return await updateExercise(userId, req.body)
    case 'PATCH':
      return await updateExerciseFields(userId, req.body)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
