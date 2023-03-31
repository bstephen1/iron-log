import {
  ApiResponse,
  methodNotAllowed,
  UserId,
} from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { fetchCategories } from 'lib/backend/mongoService'
import Category from 'models/Category'
import type { NextApiRequest } from 'next'

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Category[]>> {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const categories = await fetchCategories({ userId })
  return { payload: categories }
}

export default withStatusHandler(handler)
