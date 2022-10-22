import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchModifiers } from '../../lib/backend/mongoService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const modifiers = await fetchModifiers()
    res.status(200).json(modifiers)
  } catch (e) {
    res.status(500).json({ error: 'error fetching modifiers' })
  }
}
