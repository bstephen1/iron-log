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
    res.status(400).json({ isError: true, message: 'invalid date format' })
    return
  }
  console.log(
    `Incoming ${req.method} on session "${req.query.date}" ${req.body}`
  )

  if (!id || typeof id !== 'string') {
    res.status(400).json({ isError: true, message: 'invalid record id format' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const record = await fetchRecord(id)
        res.status(200).json(record)
      } catch (e) {
        res.status(500).json({ isError: true, message: 'could not fetch data' })
      }
      break
    case 'DELETE':
      try {
        await deleteSessionRecord({ date, recordId: id })
        res.status(200).end()
      } catch (e) {
        res
          .status(500)
          .json({ isError: true, message: 'could not update session' })
      }
      break
  }
}
