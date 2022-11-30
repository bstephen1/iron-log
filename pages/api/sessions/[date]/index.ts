import type { NextApiRequest, NextApiResponse } from 'next'
import {
  addSession,
  fetchSession,
  updateSession,
} from '../../../../lib/backend/mongoService'
import { validDateStringRegex } from '../../../../lib/frontend/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const date = req.query.date

  if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
    res.status(400).end()
    return
  }
  console.log(
    `Incoming ${req.method} on session "${req.query.date}" ${req.body}`
  )

  switch (req.method) {
    case 'GET':
      try {
        const record = await fetchSession(date)
        res.status(200).json(record)
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
    case 'POST':
      try {
        await addSession(JSON.parse(req.body))
        res.status(201).end()
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
    case 'PUT':
      try {
        await updateSession(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
  }
}
