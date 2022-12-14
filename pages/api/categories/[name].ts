import type { NextApiRequest, NextApiResponse } from 'next'
import {
  addCategory,
  fetchCategory,
  updateCategoryFields,
} from '../../../lib/backend/mongoService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name

  console.log(`Incoming ${req.method} on category "${name}"`)

  if (!name || typeof name !== 'string') {
    res.status(400).end()
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const category = await fetchCategory(name)
        res.status(200).json(category) // todo: return 204 when no content?
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
    case 'POST':
      try {
        await addCategory(JSON.parse(req.body))
        res.status(201).end()
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
      break
    case 'PATCH':
      try {
        await updateCategoryFields(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res.status(500).end()
      }
  }
}
