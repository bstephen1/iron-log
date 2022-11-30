import type { NextApiRequest, NextApiResponse } from 'next'
import {
  addRecord,
  fetchRecord,
  updateRecord,
  updateRecordFields,
} from '../../../lib/backend/mongoService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id

  console.log(`Incoming ${req.method} on record "${id}"`)

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
        res
          .status(500)
          .json({ isError: true, message: 'error fetching records' })
      }
      break
    case 'POST':
      try {
        await addRecord(JSON.parse(req.body))
        res.status(201).end()
      } catch (e) {
        res
          .status(500)
          .json({ isError: true, message: 'could not create record' })
      }
      break
    case 'PUT':
      try {
        await updateRecord(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res
          .status(500)
          .json({ isError: true, message: 'could not update record', error: e })
      }
      break
    case 'PATCH':
      try {
        await updateRecordFields(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res
          .status(500)
          .json({ isError: true, message: 'could not update record', error: e })
      }
      break
  }
}
