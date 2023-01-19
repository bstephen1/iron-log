import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { buildModifierQuery } from '../../../lib/backend/apiQueryValidationService'
import { fetchModifiers } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const query = buildModifierQuery(req.query)

  const modifiers = await fetchModifiers({ ...query, userId })

  return { payload: modifiers }
}

export default withApiMiddleware(handler)
