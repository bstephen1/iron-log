import type { NextApiRequest, NextApiResponse } from 'next'
import {
  deleteSessionRecord,
  fetchRecord,
} from '../../../../../lib/backend/mongoService'
import { validDateStringRegex } from '../../../../../lib/frontend/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date, id } = req.query

  if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
    res.status(400).end()
    return
  }
  console.log(
    `Incoming ${req.method} on session "${req.query.date}" ${req.body}`
  )

  if (!id || typeof id !== 'string') {
    res.status(400).end()
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const record = await fetchRecord(id)
        res.status(200).json(record)
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
    case 'DELETE':
      try {
        await deleteSessionRecord({ date, recordId: id })
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
  }
}
