import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchRecords } from '../../../../../lib/backend/mongoService'
import { validDateStringRegex } from '../../../../../lib/frontend/constants'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const date = req.query.date

  if (!date || typeof date !== 'string' || !date.match(validDateStringRegex)) {
    res.status(400).end()
    return
  }

  console.log(`Incoming GET on records for session "${req.query.date}"`)

  try {
    const records = await fetchRecords({ date })
    res.status(200).json(records)
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
