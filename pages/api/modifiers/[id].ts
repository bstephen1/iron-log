import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  deleteModifier,
  fetchModifier,
  updateModifierFields,
} from '../../../lib/backend/mongoService'
import { modifierSchema } from '../../../models/AsyncSelectorOption/Modifier'
import { idSchema } from '../../../models/schemas'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchModifier(userId, id)
    case 'PATCH':
      return await updateModifierFields(
        userId,
        id,
        modifierSchema.partial().parse(req.body)
      )
    case 'DELETE':
      return await deleteModifier(userId, id)
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
