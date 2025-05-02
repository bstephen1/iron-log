import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  type UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { addModifier, fetchModifiers } from '../../../lib/backend/mongoService'
import { modifierSchema } from '../../../models/AsyncSelectorOption/Modifier'

async function handler(req: NextApiRequest, userId: UserId) {
  switch (req.method) {
    case 'GET':
      return await fetchModifiers(userId)
    case 'POST':
      return await addModifier(userId, modifierSchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
