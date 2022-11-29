import type { NextApiRequest, NextApiResponse } from 'next'
import {
  addBodyweight,
  fetchBodyweightHistory,
  updateBodyweight,
} from '../../../lib/backend/mongoService'
import { isValidDateParam } from '../../../lib/util'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { start, end, limit: rawLimit } = req.query

  const limit = rawLimit ? Number(rawLimit) : undefined

  if (!isValidDateParam(start) || !isValidDateParam(end)) {
    res.status(400).json({ isError: true, message: 'invalid date format' })
    return
  } else if (limit && isNaN(limit)) {
    res.status(400).json({ isError: true, message: 'invalid limit' })
    return
  }

  console.log(
    `Incoming ${req.method} on bodyweight history "${req.query.date}" ${req.body}`
  )

  switch (req.method) {
    case 'GET':
      try {
        const data = await fetchBodyweightHistory(
          limit,
          start as string,
          end as string
        ) // todo: ts doesn't see type narrowing since it's an external function
        res.status(200).json(data)
      } catch (e) {
        res.status(500).json({ isError: true, message: 'could not fetch data' })
      }
      break
    case 'POST':
      try {
        await addBodyweight(JSON.parse(req.body))
        res.status(201).end()
      } catch (e) {
        res.status(500).json({ isError: true, message: 'could not add data' })
      }
      break
    case 'PUT':
      try {
        await updateBodyweight(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        res
          .status(500)
          .json({ isError: true, message: 'could not update data' })
      }
      break
  }
}
