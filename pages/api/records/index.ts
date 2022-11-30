import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchRecords } from '../../../lib/backend/mongoService'
import { validDateStringRegex } from '../../../lib/frontend/constants'
import { RecordParams } from '../../../models/rest/RecordParams'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Incoming ${req.method} on records`)

  try {
    const { date, exercise } = req.query as RecordParams

    if (date && !date.match(validDateStringRegex)) {
      res.status(400).end()
    }

    const query = {} as any
    if (date) query.date = date
    if (exercise) query['exercise.name'] = exercise

    const records = await fetchRecords(query)
    res.status(200).json(records)
  } catch (e) {
    console.error(e)
    res.status(500).end()
  }
}
