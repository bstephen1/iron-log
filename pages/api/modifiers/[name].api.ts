import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { validateName } from '../../../lib/backend/apiQueryValidationService'
import {
  addModifier,
  deleteModifier,
  fetchModifier,
  updateModifierFields,
} from '../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const name = validateName(req.query.name)

  switch (req.method) {
    case 'GET':
      return await fetchModifier(userId, name)
    case 'POST':
      return await addModifier(userId, req.body)
    case 'PATCH':
      return await updateModifierFields(userId, req.body)
    case 'DELETE':
      return await deleteModifier(userId, name)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
