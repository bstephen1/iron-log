import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  deleteCategory,
  fetchCategory,
  updateCategoryFields,
} from '../../../lib/backend/mongoService'
import { categorySchema } from '../../../models/AsyncSelectorOption/Category'
import { idSchema } from '../../../models/schemas'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchCategory(userId, id)
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
