import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import {
  addModifier,
  deleteModifier,
  fetchModifier,
  updateModifierFields,
} from '../../../lib/backend/mongoService'
import { idSchema } from '../../../lib/util'
import { modifierSchema } from '../../../models/AsyncSelectorOption/Modifier'

async function handler(req: NextApiRequest, userId: UserId) {
  const id = idSchema.parse(req.query.id)

  switch (req.method) {
    case 'GET':
      return await fetchModifier(userId, id)
    case 'POST':
      return await addModifier(userId, modifierSchema.parse(req.body))
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
