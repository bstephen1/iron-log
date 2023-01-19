import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withApiMiddleware from '../../../lib/backend/apiMiddleware/withApiMiddleware'
import { validateName } from '../../../lib/backend/apiQueryValidationService'
import {
  addModifier,
  fetchModifier,
  updateModifierFields,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      const modifier = await fetchModifier(userId, name)
      return { payload: modifier }
    case 'POST':
      await addModifier(userId, JSON.parse(req.body))
      return emptyApiResponse
    case 'PATCH':
      await updateModifierFields(userId, JSON.parse(req.body))
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withApiMiddleware(handler)
