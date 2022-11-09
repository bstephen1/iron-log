import type { NextApiRequest, NextApiResponse } from 'next'
import {
  addCategory,
  fetchCategory,
  updateCategory,
} from '../../../lib/backend/mongoService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.name

  console.log(`Incoming ${req.method} on category "${name}"`)

  if (!name || typeof name !== 'string') {
    res.status(400).json({ isError: true, message: 'invalid category' })
    return
  }

  switch (req.method) {
    case 'GET':
      try {
        const category = await fetchCategory(name)
        res.status(200).json(category) // todo: return 204 when no content?
      } catch (e) {
        res
          .status(500)
          .json({ isError: true, message: 'error fetching category' })
      }
      break
    case 'POST':
      try {
        await addCategory(JSON.parse(req.body))
        res.status(201).end()
      } catch (e) {
        res
          .status(500)
          .json({ isError: true, message: 'could not create category' })
      }
      break
    case 'PUT':
      try {
        await updateCategory(JSON.parse(req.body))
        res.status(200).end()
      } catch (e) {
        console.error(e)
        res.status(500).json({
          isError: true,
          message: 'could not update category',
          error: e,
        })
      }
    // case 'PATCH':
    //   try {
    //     await updateCategoryField(JSON.parse(req.body))
    //     res.status(200).end()
    //   } catch (e) {
    //     console.error(e)
    //     res.status(500).json({
    //       isError: true,
    //       message: 'could not update category',
    //       error: e,
    //     })
    //   }
  }
}
