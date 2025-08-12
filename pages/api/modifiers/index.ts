import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchModifiers } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET':
      return await fetchModifiers(userId)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
