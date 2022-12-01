import type { NextApiRequest, NextApiResponse } from 'next'
import {
  addBodyweight,
  fetchBodyweightHistory,
  updateBodyweight,
} from '../../../lib/backend/mongoService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { start, end, limit: rawLimit } = req.query

  const limit = rawLimit ? Number(rawLimit) : undefined

  if (limit && isNaN(limit)) {
    res.status(400).end()
    return
  }

  console.log(`Incoming ${req.method} on bodyweight history ${req.body}`)

  switch (req.method) {
    case 'GET':
      try {
        const data = await fetchBodyweightHistory(
          limit,
          start as string | undefined,
          end as string | undefined
        ) // todo: get rid of string[] type and check for proper date format if string
        res.status(200).json(data)
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
    case 'POST':
      try {
        await addBodyweight(JSON.parse(req.body))
        res.status(201).end()
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
    case 'PUT':
      try {
        await updateBodyweight(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
  }
}
