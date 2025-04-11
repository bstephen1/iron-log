import type { NextApiRequest } from 'next'
import {
  methodNotAllowed,
  UserId,
} from '../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../lib/backend/apiMiddleware/withStatusHandler'
import { updateBodyweight } from '../../../lib/backend/mongoService'
import { bodyweightSchema } from '../../../models/Bodyweight'
import { dateSchema } from '../../../models/schemas'

async function handler(req: NextApiRequest, userId: UserId) {
  dateSchema.parse(req.query.date)

  switch (req.method) {
    case 'PUT':
      return await updateBodyweight(userId, bodyweightSchema.parse(req.body))
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
