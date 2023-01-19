import type { NextApiRequest } from 'next'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { validateModifierStatus } from '../../../lib/backend/apiQueryValidationService'
import { fetchModifiers } from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest) {
  const status = validateModifierStatus(req.query.status)

  const modifiers = await (status
    ? fetchModifiers({ status })
    : fetchModifiers())

  return { payload: modifiers }
}

export default withApiMiddleware(handler)
