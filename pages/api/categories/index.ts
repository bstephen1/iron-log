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
    console.error(e)
    res.status(500).end()
  }
}
