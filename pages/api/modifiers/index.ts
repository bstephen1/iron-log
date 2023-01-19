import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { validateModifierStatus } from '../../../lib/backend/apiQueryValidationService'
import { fetchModifiers } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const status = validateModifierStatus(req.query.status)

  const modifiers = await (status
    ? fetchModifiers({ userId, status })
    : fetchModifiers({ userId }))

  return { payload: modifiers }
}

export default withApiMiddleware(handler)
