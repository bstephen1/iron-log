import Category from 'models/Category'
import type { NextApiRequest } from 'next'
import {
  ApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { validateName } from '../../../lib/backend/apiQueryValidationService'
import {
  addCategory,
  fetchCategory,
  updateCategoryFields,
} from '../../../lib/backend/mongoService'

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Category>> {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      return { payload: await fetchCategory(userId, name) }
    case 'POST':
      return { payload: await addCategory(userId, JSON.parse(req.body)) }
    case 'PATCH':
      return {
        payload: await updateCategoryFields(userId, JSON.parse(req.body)),
      }
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
