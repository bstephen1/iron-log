import type { NextApiRequest } from 'next'
import { methodNotAllowed } from '../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../lib/backend/apiMiddleware/withStatusHandler'
import { fetchUnits } from '../../lib/backend/mongoService'

async function handler(req: NextApiRequest) {
  if (req.method !== 'GET') {
    throw methodNotAllowed
  }

  const data = await fetchUnits()
  return { payload: data }
}

export default withStatusHandler(handler)
