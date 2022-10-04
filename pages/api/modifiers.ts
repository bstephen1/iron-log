import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchCollection } from '../../lib/backend/mongoService'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const modifiers = await fetchCollection('modifiers')
        res.status(200).json(modifiers)
    } catch (e) {
        res.status(500).json({ error: 'error fetching modifiers' })
    }
}
