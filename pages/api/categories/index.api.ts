import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { addCategory, fetchCategories } from '../../../lib/backend/mongoService'
import { categorySchema } from '../../../models/AsyncSelectorOption/Category'

async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET':
      return await fetchCategories(userId)
    case 'POST':
      return await addCategory(userId, categorySchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
