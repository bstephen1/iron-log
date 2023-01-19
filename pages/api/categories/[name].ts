import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { validateName } from '../../../lib/backend/apiQueryValidationService'
import {
  addCategory,
  fetchCategory,
  updateCategoryFields,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      const category = await fetchCategory(userId, name)
      return { payload: category }
    case 'POST':
      await addCategory(userId, JSON.parse(req.body))
      return emptyApiResponse
    case 'PATCH':
      await updateCategoryFields(userId, JSON.parse(req.body))
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withApiMiddleware(handler)
