import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { validateId } from '../../../lib/backend/apiQueryValidationService'
import {
  addCategory,
  deleteCategory,
  fetchCategory,
  updateCategoryFields,
} from '../../../lib/backend/mongoService'
import { categorySchema } from '../../../models/AsyncSelectorOption/Category'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = validateId(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchCategory(userId, id)
    case 'POST':
      return await addCategory(userId, categorySchema.parse(req.body))
    case 'PATCH':
      return await updateCategoryFields(
        userId,
        id,
        categorySchema.partial().parse(req.body)
      )
    case 'DELETE':
      return await deleteCategory(userId, id)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
