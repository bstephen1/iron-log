import {
  ApiResponse,
  methodNotAllowed,
  UserId,
} from 'lib/backend/apiMiddleware/util'
import withStatusHandler from 'lib/backend/apiMiddleware/withStatusHandler'
import { buildModifierQuery } from 'lib/backend/apiQueryValidationService'
import { fetchModifiers } from 'lib/backend/mongoService'
import Modifier from 'models/Modifier'
import type { NextApiRequest } from 'next'

async function handler(
  req: NextApiRequest,
  userId: UserId
): Promise<ApiResponse<Modifier[]>> {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const query = buildModifierQuery(req.query, userId)

  const modifiers = await fetchModifiers(query)

  return { payload: modifiers }
}

export default withStatusHandler(handler)
