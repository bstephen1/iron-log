import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { fetchCategories } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const categories = await fetchCategories({ userId })
  return { payload: categories }
}

export default withApiMiddleware(handler)
