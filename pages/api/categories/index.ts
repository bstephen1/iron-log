import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCategories } from '../../../lib/backend/mongoService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`Incoming ${req.method} on categories`)

  try {
    const categories = await fetchCategories()
    res.status(200).json(categories)
  } catch (e) {
    res
      .status(500)
      .json({ isError: true, message: 'error fetching categories' })
  }
}
