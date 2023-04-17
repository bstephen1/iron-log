import { methodNotAllowed, UserId } from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { validateName } from 'lib/backend/apiQueryValidationService'
import {
  addCategory,
  fetchCategory,
  updateCategoryFields,
} from 'lib/backend/mongoService'
import type { NextApiRequest } from 'next'

async function handler(req: NextApiRequest, userId: UserId) {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      return await fetchCategory(userId, name)
    case 'POST':
      return await addCategory(userId, req.body)
    case 'PATCH':
      return await updateCategoryFields(userId, req.body)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
