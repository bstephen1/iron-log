import type { NextApiRequest } from 'next'
import {
  emptyApiResponse,
  methodNotAllowed,
  UserId,
} from '../../../../lib/backend/apiMiddleware/util'
import withStatusHandler from '../../../../lib/backend/apiMiddleware/withStatusHandler'
import { valiDate } from '../../../../lib/backend/apiQueryValidationService'
import {
  addSession,
  fetchSession,
  updateSession,
} from '../../../../lib/backend/mongoService'

async function handler(req: NextApiRequest, userId: UserId) {
  const date = valiDate(req.query.date)

  switch (req.method) {
    case 'GET':
      const record = await fetchSession(userId, date)
      // We want to send a null res when there is no session for a given date so the user can
      // flip through arbitrary dates without creating a bunch of empty SessionLogs. A new
      // SessionLog should only be created when the user tries to add a Record on an empty date.
      return { payload: record, nullOk: true }
    case 'POST':
      await addSession(userId, JSON.parse(req.body))
      return emptyApiResponse
    case 'PUT':
      await updateSession(userId, JSON.parse(req.body))
      return emptyApiResponse
    default:
      throw methodNotAllowed
  }
}

export default withStatusHandler(handler)
