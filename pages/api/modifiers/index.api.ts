import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { buildModifierQuery } from '../../../lib/backend/apiQueryValidationService'
import { fetchModifiers } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const query = buildModifierQuery(req.query, userId)

  return await fetchModifiers(query)
}

export default withStatusHandler(handler)
